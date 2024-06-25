import { BaseService } from '@api/core/services/base.service'

export class SyncedWorkspacesService extends BaseService {
  async checkSynced() {
    return !!this.db.syncedWorkspaces.findFirst({ where: { workspaceId: this.user.workspaceId } })
  }

  async addAsSynced() {
    await this.db.syncedWorkspaces.create({ data: { workspaceId: this.user.workspaceId } })
  }
}
