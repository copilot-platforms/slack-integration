import { getDefaultSettings } from '@ui/helpers'
import { CreateUpdateSettingsDTO, PatchUpdateSettings } from '@/types/dtos/settings.dto'
import { BaseService } from '@api/core/services/base.service'
import { Setting } from '@prisma/client'

export class SettingsService extends BaseService {
  async getSettings(): Promise<Setting> {
    let settings = await this.db.setting.findFirst({
      where: { workspaceId: this.user.workspaceId },
    })
    if (!settings) {
      // Create one with default settings for this workspace
      const firstInternalUser = (await this.copilot.getInternalUsers()).data?.[0]
      settings = await this.db.setting.create({
        data: { ...getDefaultSettings(firstInternalUser.id), workspaceId: this.user.workspaceId },
      })
    }
    return settings
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
    let settings = await this.getSettings()

    return await this.db.setting.update({
      where: { id: settings.id, workspaceId: this.user.workspaceId },
      data: {
        ...newData,
        // If sync is currently running and user toggles bidirectional slack sync to off, turn off sync
        isSyncRunning: settings.isSyncRunning && newData.bidirectionalSlackSync,
      },
    })
  }

  async runHistoricalChannelSync() {
    // TODO:
    // Fetch all channels for IU
    // For each check if already synced in table using channelId
    // Fetch list of emails for each channel, using similar approach as CopilotWebhookService#handleChannelCreated
    // If not synced, add to Zeplo queue for copilot channel sync
  }
}
