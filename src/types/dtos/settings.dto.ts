import { ChannelSyncOptions } from '@prisma/client'
import { z } from 'zod'

export const CreateSettingsSchema = z.object({
  bidirectionalSlackSync: z.boolean(),
  channelsToSync: z.nativeEnum(ChannelSyncOptions),
  fallbackMessageSenderId: z.string().uuid(),
  slackChannelPrefix: z.string().min(1).max(255),
  isSyncing: z.boolean(),
})
export type CreateSettingsDTO = z.infer<typeof CreateSettingsSchema>

export const UpdateSettingsSchema = z.object({
  bidirectionalSlackSync: z.boolean().optional(),
  channelsToSync: z.nativeEnum(ChannelSyncOptions).optional(),
  fallbackMessageSenderId: z.string().uuid().optional(),
  slackChannelPrefix: z.string().min(1).max(255).optional(),
  isSyncing: z.boolean().optional(),
})
export type UpdateSettingsDTO = z.infer<typeof UpdateSettingsSchema>
