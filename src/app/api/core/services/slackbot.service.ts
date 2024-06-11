import { ConversationsCreateResponse, WebClient } from '@slack/web-api'
import httpStatus from 'http-status'
import { z } from 'zod'
import { slackConfig } from '@/config'
import { SlackChannel } from '@api/core/types/slackbot'
import { BaseService } from '@api/core/services/base.service'
import APIError from '@api/core/exceptions/APIError'
import { SyncedMessagesService } from '@api/synced-messages/synced-messages.service'

export class SlackbotService extends BaseService {
  slackClient = new WebClient(slackConfig.botOAuthToken)

  async createChannel(channel: SlackChannel): Promise<string> {
    console.info(`Creating channel ${channel.channelName}`)
    // TODO: Properly invite new users - for now fetching user ids is an issue
    console.info(`Sending invite emails from slack to:`, channel.emails)

    let createResponse: ConversationsCreateResponse
    try {
      createResponse = await this.slackClient.conversations.create({
        name: channel.channelName,
        is_private: false,
      })
    } catch (e: unknown) {
      console.error(e)
      throw new APIError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create corresponding slack channel')
    }
    const slackChannelId = z.string().parse(createResponse.channel?.id)

    return slackChannelId
  }

  async postMessage(channel: string, text: string) {
    const syncedMessage = await this.db.syncedMessage.findFirstOrThrow({ where: { slackChannelId: channel } })
    const syncedMessagesService = new SyncedMessagesService(this.user)
    try {
      await this.slackClient.chat.postMessage({ channel, text })
      await syncedMessagesService.markSyncComplete(syncedMessage.id)
    } catch (err: unknown) {
      await syncedMessagesService.markSyncFailed(syncedMessage.id)
      throw new APIError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to sync message', err)
    }
  }
}
