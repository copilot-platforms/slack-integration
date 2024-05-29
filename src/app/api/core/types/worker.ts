import { z } from 'zod'

export const WorkerRequestSchema = z.object({
  token: z.string(),
  data: z.unknown(),
})
export const SyncSchema = z.object({
  slackChannelId: z.string(),
})
