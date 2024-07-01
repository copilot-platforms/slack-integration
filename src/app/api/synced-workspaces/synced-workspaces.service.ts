import { BaseService } from '@api/core/services/base.service'
import { SyncedWorkspace } from '@prisma/client'

export class SyncedWorkspacesService extends BaseService {
  async getSyncedWorkspace(): Promise<SyncedWorkspace | null> {
    return await this.db.syncedWorkspace.findFirst({ where: { workspaceId: this.user.workspaceId } })
  }

  async checkSynced(): Promise<boolean> {
    return !!(await this.getSyncedWorkspace())
  }

  async addAsSynced(): Promise<void> {
    const syncedWorkspace = await this.db.syncedWorkspace.findFirst({ where: { workspaceId: this.user.workspaceId } })
    if (syncedWorkspace) return

    await this.db.syncedWorkspace.create({ data: { workspaceId: this.user.workspaceId } })
  }

  async addSlackMetadata(slackTeamId: string, slackAccessToken: string): Promise<void> {
    const syncedWorkspace = await this.db.syncedWorkspace.findFirst({ where: { workspaceId: this.user.workspaceId } })
    await this.db.syncedWorkspace.update({
      where: { id: syncedWorkspace?.id },
      data: { slackTeamId, slackAccessToken },
    })
  }
}
