import { z } from 'zod'

export const WebhookSchema = z.object({
  eventType: z.string(),
  created: z.string().optional(),
  object: z.string().optional(),
  data: z.unknown(),
})
export type WebhookEvent = z.infer<typeof WebhookSchema>

export type HandledWebhookEvents = 'messageChannel.created' | 'messageChannel.deleted' | 'message.sent'

export type WebhookActions = { [k in HandledWebhookEvents]: (data: WebhookEvent) => unknown }
