import { BaseService } from '@api/core/services/base.service'
import { SyncStatus, SyncedMessage } from '@prisma/client'

export class SyncedMessagesService extends BaseService {
  /**
   * Factory function to mark a SyncedMessage with a particular status
   * @param status New status for the sync
   * @returns New SyncedMessage record
   */
  private markSyncFactory(status: SyncStatus): (id: string) => Promise<SyncedMessage> {
    return async (id: string) =>
      await this.db.syncedMessage.update({
        where: { id },
        data: { status },
      })
  }

  /**
   * Marks a message sync as success
   */
  markSyncComplete = this.markSyncFactory('success')

  /**
   * Marks a message sync as failed
   */
  markSyncFailed = this.markSyncFactory('failed')

  async checkIfMessageSynced(eventTime: string): Promise<boolean> {
    return !!(await this.db.syncedSlackMessage.findFirst({ where: { eventTime } }))
  }
}
