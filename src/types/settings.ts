import { Setting } from '@prisma/client'

export type DefaultSetting = Omit<
  Setting,
  'id' | 'createdAt' | 'updatedAt' | 'workspaceId' | 'lastSyncedById' | 'lastSyncedAt'
>

export type SelecterOption = {
  label: string
  value: string
}
