import httpStatus from 'http-status'
import { z } from 'zod'
import { Setting } from '@prisma/client'
import { ChannelResponse } from '@/types/common'
import { kebabify } from '@/utils/string'
import { WebhookActions, WebhookEvent } from '@api/core/types/webhook'
import { ChannelSchema, MessageSchema, SyncedMessageSchema } from '@api/core/types/message'
import APIError from '@api/core/exceptions/APIError'
import { parseUserIdAndEmail } from '@api/core/utils/users'
import { RequestQueueService } from '@api/core/services/queue/request-queue.service'
import { BaseService } from '@api/core/services/base.service'
import User from '@api/core/models/User.model'
import { SlackChannelSchema } from '@api/core/types/slackbot'
import { WORKERS } from '@api/core/constants/routes'

export class CopilotWebhookService extends BaseService {
  constructor(
    user: User,
    public readonly settings: Setting,
  ) {
    super(user)
  }

  /**
   * Handle all associated webhook events - current handles `messageChannel.created`, `messageChannel.deleted` and `message.sent`
   * @param data Parsed WebhookEvent related to this event
   */
  async handleWebhookEvent(data: WebhookEvent) {
    const webhookActions: WebhookActions = {
      'messageChannel.created': this.handleChannelCreated,
      'messageChannel.deleted': this.handleChannelDeleted,
      'message.sent': this.handleMessageSent,
    }
    // Fetch  and run appropriate action if event type exists in webhookActions keys, else ignore this webhook event
    await webhookActions[data.eventType as keyof WebhookActions]?.(data)
  }

  /**
   * Handle webhook envent for `messageChannel.created` from Copilot Messages app
   * @param data Parsed WebhookEvent related to this event
   */
  private handleChannelCreated = async (data: WebhookEvent) => {
    // Extract newly created channel info from webhook payload
    const channelInfo = ChannelSchema.parse(data.data)

    // Get relavant info to sync this channel to Slack
    const channel = await this.copilot.getMessageChannel(channelInfo.id)
    const targetName = await this.getTargetName(channel)
    const [emails, channelName] = await Promise.all([
      this.getChannelParticipantEmails(channel),
      this.getChannelName(targetName),
    ])

    // Create channel sync record in SyncedChannels table
    const sync = await this.db.syncedChannel.create({
      data: {
        copilotChannelId: channel.id,
        slackChannelName: channelName,
        status: 'pending',
      },
    })

    // Create a new Slack channel and send invites to all associated emails
    const requestQueue = new RequestQueueService()
    await requestQueue.push(WORKERS.copilot.channels.create, {
      traceId: sync.id,
      params: {
        token: this.user.token,
        data: SlackChannelSchema.parse({ syncedChannelId: sync.id, channelName, emails }),
      },
    })
  }

  private handleChannelDeleted = async (data: WebhookEvent) => {
    const channelInfo = ChannelSchema.parse(data.data)
    const channel = await this.copilot.getMessageChannel(channelInfo.id)

    // Remove from SyncedChannels table
    const sync = await this.db.syncedChannel.findFirstOrThrow({
      where: { copilotChannelId: channel.id },
    })
    await this.db.syncedChannel.update({
      where: { id: sync?.id },
      data: {
        deletedAt: new Date(),
      },
    })

    // Post message to channel conveying that channel has been deleted
    const requestQueue = new RequestQueueService()
    await requestQueue.push(WORKERS.copilot.channels.delete, {
      traceId: sync.id,
      params: { token: this.user.token, data: sync },
    })
  }

  private handleMessageSent = async (data: WebhookEvent) => {
    // Fetch slack channel id from db
    const message = MessageSchema.parse(data.data)
    const channel = await this.db.syncedChannel.findFirstOrThrow({
      where: {
        copilotChannelId: message.channelId,
      },
    })
    // Add to SyncedMessages table with status
    const syncedMessage = await this.db.syncedMessage.create({
      data: {
        messageId: message.id,
        senderId: message.senderId,
        copilotChannelId: message.channelId,
        slackChannelId: channel.slackChannelId,
        status: 'pending',
      },
    })

    // Get sender name, or fallback to fallbackMessagesSenderId if it doesn't exist
    const senderName =
      (await this.copilot.getUserNameById(message.senderId)) ||
      (await this.copilot.getUserNameById(this.settings.fallbackMessageSenderId))

    // Post message on that particular slack channel by pushing to request queue
    const requestQueueService = new RequestQueueService()
    await requestQueueService.push(WORKERS.copilot.messages.create, {
      traceId: syncedMessage.id,
      params: {
        token: this.user.token,
        data: SyncedMessageSchema.parse({
          syncId: syncedMessage.id,
          text: message.text,
          slackChannelId: syncedMessage.slackChannelId,
          senderName,
        }),
      },
    })
  }

  /**
   * Get new unique slack channel name in format prefix-client-name or prefix-company-name
   * @param targetName Target client's full name or target company's name
   * @returns Unique kebab cased Slack channel name
   */
  getChannelName = async (targetName: string): Promise<string> => {
    let defaultName = `${this.settings.slackChannelPrefix}-${kebabify(targetName)}`
    // If name already exists then append a `-2` kind of suffix to make it unique
    const channelNameOccurances = await this.db.syncedChannel.count({
      where: {
        // Get all records WHERE slackChannelName = {defaultName} OR slackChannelName LIKE "{defaultName}-%"
        OR: [{ slackChannelName: defaultName }, { slackChannelName: { startsWith: `${defaultName}-` } }],
      },
    })
    if (channelNameOccurances) {
      defaultName += `-${String(channelNameOccurances + 1)}`
    }

    return defaultName
  }

  /**
   * Get a channel's target client's full name or target company's name
   * @param channel Relavant channel
   * @returns Name of the target client / company
   */
  getTargetName = async (channel: ChannelResponse): Promise<string> => {
    // Get the client / company that is the target of this message channel
    let targetName: string

    if (channel.membershipType === 'individual') {
      // Client ID is the one that is not present in internalUserIds array - so calculate difference of arrays
      // This will always result in an array with single value of the client ID for membershipType 'individual'
      const internalUserIds = (await this.copilot.getInternalUsers()).data.map((user) => user.id)
      // This is being done because membershipEntityId doesn't always return ID of client
      const clientId = channel.memberIds.filter((id) => !internalUserIds.includes(id))
      const target = await this.copilot.getClient(clientId[0])
      targetName = `${target.givenName} ${target.familyName}`
    } else if (channel.membershipType === 'company') {
      const target = await this.copilot.getCompany(channel.membershipEntityId)
      targetName = target.name
    } else {
      throw new APIError(httpStatus.INTERNAL_SERVER_ERROR, 'Group messages are not supported yet by Copilot')
    }

    return targetName
  }

  /**
   * Gets an array of channel participant's emails
   * @param channel Relavant channel
   * @returns Array of participant emails
   */
  getChannelParticipantEmails = async (channel: ChannelResponse): Promise<string[]> => {
    // Get an array of emails of each message channel participant
    const internalUsers = parseUserIdAndEmail((await this.copilot.getInternalUsers()).data)
    const emails: string[] = []
    channel.memberIds.forEach((memberId) => {
      // Fetch email whether it is of an internal user or a client
      const email = internalUsers[memberId]
      email && emails.push(email)
    })
    return emails
  }
}
