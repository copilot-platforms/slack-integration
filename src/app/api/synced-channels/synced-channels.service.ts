import { BaseService } from '@api/core/services/base.service'
import { SyncedChannel } from '@prisma/client'

export class SyncedChannelsService extends BaseService {
  async markSyncComplete(id: string, slackChannelId: string): Promise<SyncedChannel> {
    return await this.db.syncedChannel.update({
      where: { id },
      data: { status: 'success', slackChannelId },
    })
  }

  async markSyncFailed(id: string): Promise<SyncedChannel> {
    return await this.db.syncedChannel.update({
      where: { id },
      data: { status: 'failed' },
    })
  }

  async checkIfSynced(id: string): Promise<Boolean> {
    return !!(await this.db.syncedChannel.findFirst({
      where: { id, status: 'success' },
    }))
  }
}
