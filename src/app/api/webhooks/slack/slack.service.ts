import { BaseService } from '@api/core/services/base.service'
import { SlackEventSubscription } from '@api/core/types/slackbot'
import APIError from '@api/core/exceptions/APIError'
import httpStatus from 'http-status'
import { SyncedChannel } from '@prisma/client'
import { SlackbotService } from '@api/core/services/slackbot.service'
import { z } from 'zod'
import { SyncedMessageSchema } from '../../core/types/message'
import { SyncedMessagesService } from '../../synced-messages/synced-messages.service'

export class SlackWebhooksService extends BaseService {
  async pushMessageToCopilot(data: SlackEventSubscription) {
    console.log('data', data)
    // First check if the workspace that owns the copilot channel has sync enabled
    const syncedChannel = await this.db.syncedChannel.findFirst({ where: { slackChannelId: data.event.channel } })
    if (!syncedChannel) {
      throw new APIError(httpStatus.BAD_REQUEST, "A corresponding synced channel doesn't exist")
    }
    await this.checkIfShouldSync(syncedChannel, data)
    // Push message to Copilot
    const slackbot = new SlackbotService(this.user)
    const copilotUser = await slackbot.fetchCorrespondingCopilotMember(data.event.user)
    if (!copilotUser) {
      throw new APIError(httpStatus.BAD_REQUEST)
    }
    await this.copilot.sendMessage(copilotUser.id, z.string().parse(syncedChannel.copilotChannelId), data.event.text)
  }

  private async checkIfShouldSync(syncedChannel: SyncedChannel, data: SlackEventSubscription): Promise<void> {
    const setting = this.db.setting.findFirst({ where: { workspaceId: syncedChannel.workspaceId } })
    if (!setting) {
      throw new APIError(httpStatus.BAD_REQUEST, 'Sync is currently disabled for this workspace')
    }

    if (data.event.text.includes(' sent a message in Copilot: ')) {
      throw new APIError(httpStatus.OK, 'Message was sent by slack bot')
    }

    const syncedMessagesService = new SyncedMessagesService(this.user)
    if (await syncedMessagesService.checkIfMessageSynced(data.event.ts)) {
      throw new APIError(httpStatus.OK, 'Ignoring duplicate Slack webhook call')
    }
  }
}
