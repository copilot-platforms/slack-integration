import { BaseService } from '@api/core/services/base.service'
import { SlackEventSubscription } from '@api/core/types/slackbot'
import APIError from '@api/core/exceptions/APIError'
import httpStatus from 'http-status'
import { SyncedChannel } from '@prisma/client'
import { SlackbotService } from '@api/core/services/slackbot.service'
import { z } from 'zod'
import { SyncedMessagesService } from '@api/synced-messages/synced-messages.service'
import { noSyncTriggerKeywords } from '../../core/constants/routes'

export class SlackWebhooksService extends BaseService {
  private buildCopilotForwardedText = (text: string): string => `${text} \n(Sent on slack)`

  async pushMessageToCopilot(data: SlackEventSubscription) {
    // First check if the workspace that owns the copilot channel has sync enabled
    const syncedChannel = await this.db.syncedChannel.findFirst({ where: { slackChannelId: data.event.channel } })
    if (!syncedChannel) return

    await this.checkIfShouldSync(syncedChannel, data)
    await this.db.syncedSlackMessage.create({ data: { eventTime: data.event.ts } })

    // Push message to Copilot
    const slackbot = new SlackbotService(this.user)
    const copilotUser = await slackbot.fetchCorrespondingCopilotMember(data.event.user)
    if (!copilotUser) {
      throw new APIError(httpStatus.BAD_REQUEST)
    }
    await this.copilot.sendMessage(
      copilotUser.id,
      z.string().parse(syncedChannel.copilotChannelId),
      this.buildCopilotForwardedText(data.event.text),
    )
  }

  private async checkIfShouldSync(syncedChannel: SyncedChannel, data: SlackEventSubscription): Promise<void> {
    const setting = this.db.setting.findFirst({ where: { workspaceId: syncedChannel.workspaceId } })
    if (!setting) {
      throw new APIError(httpStatus.BAD_REQUEST, 'Sync is currently disabled for this workspace')
    }

    for (const keyword in noSyncTriggerKeywords) {
      if (data.event.text.includes(keyword)) {
        throw new APIError(httpStatus.OK, 'Message was sent by slack bot so will not be synced back to copilot')
      }
    }

    const syncedMessagesService = new SyncedMessagesService(this.user)
    if (await syncedMessagesService.checkIfMessageSynced(data.event.ts)) {
      throw new APIError(httpStatus.OK, 'Ignoring duplicate Slack webhook call')
    }
  }
}
