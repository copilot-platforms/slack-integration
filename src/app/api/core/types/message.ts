import { z } from 'zod'

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
