import { ChannelSyncOptions } from '@prisma/client'
import { z } from 'zod'

export const CreateUpdateSettingsSchema = z.object({
  bidirectionalSlackSync: z.boolean(),
  channelsToSync: z.nativeEnum(ChannelSyncOptions),
  fallbackMessageSenderId: z.string().uuid(),
  slackChannelPrefix: z.string().min(1).max(255).regex(/^\S+$/, 'Slack channel prefix must not contain spaces'),
  isSyncRunning: z.boolean(),
})
export type CreateUpdateSettingsDTO = z.infer<typeof CreateUpdateSettingsSchema>

export type SettingsFormFields = keyof CreateUpdateSettingsDTO

export const PatchUpdateSettingsSchema = z.object({
  bidirectionalSlackSync: z.boolean(),
})
export type PatchUpdateSettings = z.infer<typeof PatchUpdateSettingsSchema>
