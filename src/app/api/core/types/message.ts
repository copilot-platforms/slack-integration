import { z } from 'zod'
import { SyncStatus } from '@prisma/client'

export const ChannelSchema = z.object({
  id: z.string(),
  createdAt: z.string().datetime(),
  lastMessageDate: z.string().datetime().nullable(),
  memberIds: z.array(z.string().uuid()),
  membershipEntityId: z.string().uuid(),
  membershipType: z.enum(['individual', 'group', 'company']),
  object: z.enum(['messageChannel']),
  updatedAt: z.string().datetime(),
})
export type Channel = z.infer<typeof ChannelSchema>

export const DeleteSyncedChannelSchema = z.object({
  id: z.string(),
  copilotChannelId: z.string(),
  slackChannelId: z.string(),
  slackChannelName: z.string(),
  status: z.nativeEnum(SyncStatus),
  createdAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
})
