import { BaseService } from '@api/core/services/base.service'
import { SyncStatus, SyncedChannel } from '@prisma/client'

export class BulkCreateService extends BaseService {
  async checkIfSynced(id: string): Promise<Boolean> {
    return !!(await this.db.syncedChannel.findFirst({
      where: { id, status: 'success' },
    }))
  }

  async markSyncStatus(id: string, status: SyncStatus): Promise<SyncedChannel> {
    return await this.db.syncedChannel.update({
      where: { id },
      data: { status },
    })
  }
}
