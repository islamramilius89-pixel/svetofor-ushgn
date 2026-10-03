import { z } from '@/layers/domain/zod'

export const statsSchema = z.object({
  wells: z.object({
    total: z.number(),
    byStatus: z.object({ GREEN: z.number(), YELLOW: z.number(), RED: z.number() }),
  }),
  tickets: z.object({
    total: z.number(),
    byStatus: z.object({ NEW: z.number(), IN_PROGRESS: z.number(), DONE: z.number() }),
  }),
})
export type Stats = z.infer<typeof statsSchema>
