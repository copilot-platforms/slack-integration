import httpStatus from 'http-status'
import { Setting } from '@prisma/client'
import { ChannelResponse } from '@/types/common'
import { CopilotAPI } from '@/utils/CopilotAPI'
import { kebabify } from '@/utils/string'
import { WebhookActions, WebhookEvent } from '@api/core/types/webhook'
import { ChannelSchema } from '@api/core/types/message'
import APIError from '@api/core/exceptions/APIError'
import { parseUserIdAndEmail } from '@api/core/utils/users'
import { RequestQueueService } from '@api/core/services/requestQueue.service'
import { BaseService } from '@api/core/services/base.service'
import User from '@api/core/models/User.model'

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
    webhookActions[data.eventType as keyof WebhookActions]?.(data)
  }

  /**
   * Handle webhook envent for `messageChannel.created` from Copilot Messages app
   * @param data Parsed WebhookEvent related to this event
   */
  private handleChannelCreated = async (data: WebhookEvent) => {
    // Extract newly created channel info from webhook payload
    const channelInfo = ChannelSchema.parse(data.data)

    // Get relavant info to sync this channel to Slack
    const copilot = new CopilotAPI(this.user.token)
    const channel = await copilot.getMessageChannel(channelInfo.id)
    const targetName = await this.getTargetName(channel)
    const emails = await this.getChannelParticipantEmails(channel)
    const channelName = await this.getChannelName(targetName)

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
    requestQueue.push('/api/workers/copilot', {
      traceId: sync.id,
      params: [{ channelName, emails }],
    })
  }

  private handleChannelDeleted = (data: WebhookEvent) => {
    // TODO: After implementing slack bot
  }

  private handleMessageSent = (_: WebhookEvent) => {
    // TODO: implement in relavant PR
  }

  /**
   * Get new unique slack channel name in format prefix-client-name or prefix-company-name
   * @param targetName Target client's full name or target company's name
   * @returns Unique kebab cased Slack channel name
   */
  private getChannelName = async (targetName: string): Promise<string> => {
    let defaultName = `${this.settings.slackChannelPrefix}-${kebabify(targetName)}`
    // If name already exists then append a `-2` kind of suffix to make it unique
    const channelNameOccurances = await this.db.syncedChannel.count({
      where: { slackChannelName: { startsWith: defaultName } },
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
  private getTargetName = async (channel: ChannelResponse): Promise<string> => {
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
  private getChannelParticipantEmails = async (channel: ChannelResponse): Promise<string[]> => {
    // Get an array of emails of each message channel participant
    const internalUsers = parseUserIdAndEmail((await this.copilot.getInternalUsers()).data)
    const clients = parseUserIdAndEmail((await this.copilot.getClients()).data)
    const emails: string[] = []
    channel.memberIds.forEach((memberId) => {
      // Fetch email whether it is of an internal user or a client
      const email = internalUsers[memberId] ?? clients[memberId]
      email && emails.push(email)
    })
    return emails
  }
}
