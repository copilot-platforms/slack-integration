import httpStatus from 'http-status'
import { CopilotAPI } from '@/utils/CopilotAPI'
import { WebhooksService } from '@api/webhooks/webhooks.service'
import { WebhookActions, WebhookEvent } from '@api/core/types/webhook'
import { ChannelSchema } from '@api/core/types/message'
import APIError from '@api/core/exceptions/APIError'
import { parseUserIdAndEmail } from '@api/core/utils/users'
import { SlackbotService } from '../../core/services/slackbot.service'
import { Setting } from '@prisma/client'
import User from '@api/core/models/User.model'
import { ChannelResponse } from '@/types/common'
import { kebabify } from '@/utils/string'

export class CopilotWebhookService extends WebhooksService {
  constructor(
    user: User,
    public syncSettings: Setting,
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
    // Fetch  and run appropriate action, if exists, else ignore this webhook event
    webhookActions[data.eventType as keyof WebhookActions]?.(data)
  }

  // TODO: implement in relavant PR
  private handleMessageSent(_: WebhookEvent) {}

  /**
   * Handle webhook envent for `messageChannel.created` from Copilot Messages app
   * @param data Parsed WebhookEvent related to this event
   */
  private async handleChannelCreated(data: WebhookEvent) {
    const channelInfo = ChannelSchema.parse(data.data)

    const copilot = new CopilotAPI(this.user.token)
    // Get newly created channel info
    const channel = await copilot.getMessageChannel(channelInfo.id)

    // Get the client / company that is the target of this message channel
    let targetName: string
    if (channel.membershipType === 'individual') {
      const target = await copilot.getClient(channel.membershipEntityId)
      targetName = `${target.givenName} ${target.familyName}`
    } else if (channel.membershipType === 'company') {
      const target = await copilot.getCompany(channel.membershipEntityId)
      targetName = target.name
    } else {
      throw new APIError(httpStatus.INTERNAL_SERVER_ERROR, 'Group messages are not supported yet by Copilot')
    }

    // Get an array of emails of each message channel participant
    const internalUsers = parseUserIdAndEmail((await copilot.getInternalUsers()).data)
    const clients = parseUserIdAndEmail((await copilot.getClients()).data)
    const emails: string[] = []
    channel.memberIds.forEach((memberId) => {
      // Fetch email whether it is of an internal user or a client
      const email = internalUsers[memberId] ?? clients[memberId]
      email && emails.push(email)
    })

    // Create a single new channel and send invites to all associated emails

    const slackbot = new SlackbotService()
    await this.bulkCreateChannels([
      {
        channelName: `${this.syncSettings.slackChannelPrefix}-${kebabify(targetName)}`,
        emails,
      },
    ])

    // Create channel sync record in SyncedChannels table
  }

  private handleChannelDeleted(data: WebhookEvent) {
    // TODO: After implementing slack bot
    console.log('Post channel was deleted in integrated slack channel')
  }

  private bulkCreateChannels(channels: { channelName: string; emails: string[] }[]) {}
}
