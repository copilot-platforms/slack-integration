import { z } from 'zod'

export const SlackChannelSchema = z.object({
  syncedChannelId: z.string().uuid(),
  channelName: z.string(),
  emails: z.array(z.string()),
})
export const SlackChannelsSchema = z.array(SlackChannelSchema)
export type SlackChannel = z.infer<typeof SlackChannelSchema>

export const SlackChannelEventSchema = z.object({
  user: z.string(),
  type: z.enum(['message']),
  ts: z.string(),
  text: z.string(),
  channel: z.string(),
  channel_type: z.enum(['channel']),
  bot_id: z.string().optional(),
  app_id: z.string().optional(),
  subtype: z.string().optional(),
})
export const SlackEventSubscriptionSchema = z.object({
  token: z.string(),
  team_id: z.string(),
  event: SlackChannelEventSchema,
  event_time: z.number(),
})
export type SlackEventSubscription = z.infer<typeof SlackEventSubscriptionSchema>
