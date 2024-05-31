import { BaseService } from '@api/core/services/base.service'
import { SyncStatus, SyncedMessage } from '@prisma/client'

export class SyncedMessagesService extends BaseService {
  private markSyncFactory(status: SyncStatus): (id: string) => Promise<SyncedMessage> {
    return async (id: string) =>
      await this.db.syncedMessage.update({
        where: { id },
        data: { status },
      })
  }

  markSyncComplete = this.markSyncFactory('success')
  markSyncFailed = this.markSyncFactory('failed')
}
