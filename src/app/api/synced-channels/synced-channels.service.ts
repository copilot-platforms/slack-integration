import { z } from 'zod'
import { SyncStatus, SyncedChannel } from '@prisma/client'
import { BaseService } from '@api/core/services/base.service'
import { RequestQueueService } from '@api/core/services/queue/request-queue.service'
import { SlackChannelSchema } from '@api/core/types/slackbot'
import { CopilotWebhookService } from '@api/webhooks/copilot/copilot.service'
import { SettingsService } from '@api/settings/settings.service'
import { Channel } from '@api/core/types/message'
import { WORKERS } from '@api/core/constants/routes'

export class SyncedChannelsService extends BaseService {
  private markSyncFactory(status: SyncStatus): (id: string, slackChannelId?: string) => Promise<SyncedChannel> {
    return async (id: string, slackChannelId?: string) => {
      return await this.db.syncedChannel.update({
        where: { id },
        data: { status, slackChannelId },
      })
    }
  }

  markSyncComplete = this.markSyncFactory('success')
  markSyncFailed = this.markSyncFactory('failed')

  async checkIfSynced(id: string): Promise<Boolean> {
    return !!(await this.db.syncedChannel.findFirst({
      where: { id, status: 'success' },
    }))
  }

  async runHistoricalSync() {
    const settings = await new SettingsService(this.user).getSettings()
    if (!settings) return

    // Fetch list of all channels in workspace
    console.info('Running historical channel sync')
    const channels = (await this.copilot.getMessageChannels()).data

    // Build an array of channels that have not been synced
    const channelsWithSync = (
      await this.db.syncedChannel.findMany({
        select: {
          copilotChannelId: true,
        },
      })
    ).map((channel) => channel.copilotChannelId)
    // Do it with a filter method like this to avoid having to do repeated queries to db
    const unsyncedChannels = channels.filter((channel) => !channelsWithSync.includes(channel.id))

    // Add unsynced channels to zeplo queue
    const requestQueue = new RequestQueueService()
    const copilotService = new CopilotWebhookService(this.user, settings)

    for (const channel of unsyncedChannels) {
      // TODO: Use bottleneck along with promises.all to run in parallel without getting ratelimited
      try {
        await this.createSync(copilotService, requestQueue, channel)
      } catch {
        console.error('Failed to sync channel', channel)
      }
    }
  }

  private async createSync(copilotService: CopilotWebhookService, requestQueue: RequestQueueService, channel: Channel) {
    const targetName = await copilotService.getTargetName(channel)
    const emails = await copilotService.getChannelParticipantEmails(channel)
    const channelName = await copilotService.getChannelName(targetName)

    const sync = await this.db.syncedChannel.create({
      data: {
        copilotChannelId: channel.id,
        slackChannelName: channelName,
        status: 'pending',
      },
    })
    await requestQueue.push(WORKERS.copilot.channels.create, {
      traceId: sync.id,
      params: {
        token: this.user.token,
        data: z.array(SlackChannelSchema).parse([{ syncedChannelId: sync.id, channelName, emails }]),
      },
    })
  }
}
