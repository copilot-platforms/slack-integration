import { BaseService } from '@api/core/services/base.service'

export class SyncedWorkspacesService extends BaseService {
  async addAsSynced(workspaceId: string) {
    await this.db.syncedWorkspaces.create({ data: { workspaceId } })
  }
}
