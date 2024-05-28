import { z } from 'zod'

export const SlackChannelSchema = z.object({
  channelName: z.string(),
  emails: z.array(z.string()),
})
export const SlackChannelsSchema = z.array(SlackChannelSchema)
export type SlackChannel = z.infer<typeof SlackChannelSchema>
