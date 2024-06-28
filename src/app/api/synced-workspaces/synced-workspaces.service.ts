import { BaseService } from '@api/core/services/base.service'

export class SyncedWorkspacesService extends BaseService {
  async checkSynced() {
    return !!(await this.db.syncedWorkspaces.findFirst({ where: { workspaceId: this.user.workspaceId } }))
  }

  async addAsSynced() {
    const syncedWorkspace = await this.db.syncedWorkspaces.findFirst({ where: { workspaceId: this.user.workspaceId } })
    if (syncedWorkspace) return

    await this.db.syncedWorkspaces.create({ data: { workspaceId: this.user.workspaceId } })
  }

  async addTeamIdToSyncedWorkspace(slackTeamId: string) {
    const syncedWorkspace = await this.db.syncedWorkspaces.findFirst({ where: { workspaceId: this.user.workspaceId } })
    await this.db.syncedWorkspaces.update({
      where: { id: syncedWorkspace?.id },
      data: { slackTeamId },
    })
  }
}
