import { CreateUpdateSettingsDTO, PatchUpdateSettings } from '@/types/dtos/settings.dto'
import { BaseService } from '@api/core/services/base.service'
import { Setting } from '@prisma/client'
import { RequestQueueService } from '@api/core/services/queue/request-queue.service'

export class SettingsService extends BaseService {
  async getSettings(): Promise<Setting | null> {
    return await this.db.setting.findFirst({
      where: { workspaceId: this.user.workspaceId },
    })
  }

  async createOrUpdateSettings(newData: CreateUpdateSettingsDTO): Promise<Setting> {
    const settings = await this.getSettings()
    const data = {
      ...newData,
      workspaceId: this.user.workspaceId,
      lastSyncedById: this.user.internalUserId,
    }

    if (!settings) {
      return await this.db.setting.create({ data: { ...data, createdAt: new Date() } })
    }

    return await this.db.setting.update({
      where: { id: settings.id, workspaceId: this.user.workspaceId },
      data: { ...data, updatedAt: new Date() },
    })
  }

  async partialUpdateSettings(newData: PatchUpdateSettings): Promise<Setting | null> {
    const settings = await this.getSettings()
    if (!settings) {
      // Do not partial update settings if no setting has been created beforehand
      return null
    }

    return await this.db.setting.update({
      where: { id: settings.id, workspaceId: this.user.workspaceId },
      data: {
        ...newData,
        // If sync is currently running and user toggles bidirectional slack sync to off, turn off sync
        isSyncRunning: settings.isSyncRunning && newData.bidirectionalSlackSync,
      },
    })
  }

  runHistoricalChannelSync = async () => {
    const requestQueue = new RequestQueueService()
    await requestQueue.push('/api/workers/copilot/channels/historical-sync', {
      params: {
        token: this.user.token,
      },
    })
  }
}
