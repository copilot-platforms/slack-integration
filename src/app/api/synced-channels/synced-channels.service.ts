import { z } from 'zod'
import { SyncStatus, SyncedChannel } from '@prisma/client'
import { BaseService } from '@api/core/services/base.service'
import { RequestQueueService } from '@api/core/services/queue/request-queue.service'
import { SlackChannelSchema } from '@api/core/types/slackbot'
import { CopilotWebhookService } from '@api/webhooks/copilot/copilot.service'
import { SettingsService } from '@api/settings/settings.service'
import { Channel } from '@api/core/types/message'
import { ChannelResponse } from '@/types/common'
import { parseUserIdAndEmail } from '@api/core/utils/users'
import Bottleneck from 'bottleneck'

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

  async batchSyncChannels(batchSize: number) {
    const syncedChannels = await this.db.syncedChannel.findMany({
      where: { status: 'pending' },
      take: batchSize,
    })
    const limiter = new Bottleneck({
      reservoir: 2, // initial capacity is 2
      reservoirRefreshAmount: 2, // refill the reservoir to 2 jobs
      reservoirRefreshInterval: 1000, // every 1000ms
      minTime: 5, // minimal spacing between jobs to handle quick successive calls
    })
    const requestQueue = new RequestQueueService()

    const syncChannel = async (sync: SyncedChannel) => {
      const channel = await this.copilot.getMessageChannel(z.string().parse(sync.copilotChannelId))
      const emails = await this.getChannelParticipantEmails(channel)
      await requestQueue.push('/api/workers/copilot/channels/create', {
        traceId: sync.id,
        params: {
          token: this.user.token,
          data: SlackChannelSchema.parse({ syncedChannelId: sync.id, channelName: sync.slackChannelName, emails }),
        },
      })
    }

    const limitedSyncChannel = limiter.wrap(syncChannel)
    await Promise.all(syncedChannels.map(limitedSyncChannel))
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

    // Add unsynced channels to SyncedChannels table with pending status
    const copilotService = new CopilotWebhookService(this.user, settings)
    for (const channel of unsyncedChannels) {
      await this.createSync(copilotService, channel)
    }
  }

  private async createSync(copilotService: CopilotWebhookService, channel: Channel) {
    const targetName = await copilotService.getTargetName(channel)
    // const emails = await copilotService.getChannelParticipantEmails(channel)
    const channelName = await copilotService.getChannelName(targetName)

    await this.db.syncedChannel.create({
      data: {
        copilotChannelId: channel.id,
        slackChannelName: channelName,
        status: 'pending',
      },
    })
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
