import { CreateSettingsDTO, UpdateSettingsDTO } from '@/types/dtos/settings.dto'
import { BaseService } from '@api/core/services/base.service'
import { Setting } from '@prisma/client'

export class SettingsService extends BaseService {
  async getSettings(): Promise<Setting | null> {
    return await this.db.setting.findFirst({
      where: { workspaceId: this.user.workspaceId, syncedById: this.user.internalUserId },
    })
  }

  async createSettings(data: CreateSettingsDTO): Promise<Setting> {
    return await this.db.setting.create({
      data: {
        ...data,
        workspaceId: this.user.workspaceId,
        syncedById: this.user.internalUserId,
      },
    })
  }

  async updateSettings(id: string, data: UpdateSettingsDTO): Promise<Setting> {
    return await this.db.setting.update({
      where: { id },
      data,
    })
  }
}
