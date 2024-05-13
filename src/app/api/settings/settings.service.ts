import { CreateUpdateSettingsDTO } from '@/types/dtos/settings.dto'
import { BaseService } from '@api/core/services/base.service'
import { Setting } from '@prisma/client'

export class SettingsService extends BaseService {
  async getSettings(): Promise<Setting | null> {
    return await this.db.setting.findFirst({
      where: { workspaceId: this.user.workspaceId, internalUserId: this.user.internalUserId },
    })
  }

  async createOrUpdateSettings(newData: CreateUpdateSettingsDTO): Promise<Setting> {
    const settings = await this.getSettings()
    const data = {
      ...newData,
      workspaceId: this.user.workspaceId,
      internalUserId: this.user.internalUserId,
    }

    if (!settings) {
      return await this.db.setting.create({ data })
    }

    return await this.db.setting.update({
      where: { id: settings.id },
      data,
    })
  }
}
