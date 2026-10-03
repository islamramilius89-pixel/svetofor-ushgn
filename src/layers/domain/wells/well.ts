import { ticketPrioritySchema, ticketStatusSchema } from '@/layers/domain/tickets/ticket'
import { z } from '@/layers/domain/zod'

export const WELL_STATUSES = ['RED', 'YELLOW', 'GREEN'] as const
export const wellStatusSchema = z.enum(WELL_STATUSES)
export type WellStatus = z.infer<typeof wellStatusSchema>

export const WELL_STATUS_LABELS: Record<WellStatus, string> = {
  GREEN: 'Норма',
  YELLOW: 'Отклонение',
  RED: 'Срочно проверить',
}

/** Пороги отклонения тока от эталона, %. То же правило, что на сервере. */
export const STATUS_THRESHOLDS = { yellow: 10, red: 25 } as const

/** Статус определяется отклонением: используем, чтобы показать статус ещё до сохранения формы. */
export function statusFromDeviation(deviation: number): WellStatus {
  if (deviation >= STATUS_THRESHOLDS.red) return 'RED'
  if (deviation >= STATUS_THRESHOLDS.yellow) return 'YELLOW'
  return 'GREEN'
}

export const ngduSchema = z.object({ id: z.number(), name: z.string() })
export type Ngdu = z.infer<typeof ngduSchema>
export const ngduListSchema = z.array(ngduSchema.extend({ wellCount: z.number() }))

export const wellSchema = z.object({
  id: z.number(),
  number: z.string(),
  ngdu: ngduSchema,
  deviation: z.number(),
  status: wellStatusSchema,
  note: z.string(),
  lastCheckAt: z.iso.datetime().nullable(),
  openTickets: z.number(),
  updatedAt: z.iso.datetime(),
})
export type Well = z.infer<typeof wellSchema>

export const wellPageSchema = z.object({
  items: z.array(wellSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
})
export type WellPage = z.infer<typeof wellPageSchema>

export const wellDetailsSchema = wellSchema.extend({
  tickets: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      status: ticketStatusSchema,
      priority: ticketPrioritySchema,
      assignee: z.string(),
      createdAt: z.iso.datetime(),
    }),
  ),
})
export type WellDetails = z.infer<typeof wellDetailsSchema>

export const wellFormSchema = z.object({
  number: z.string().trim().regex(/^\d{3,6}$/, 'Номер скважины — от 3 до 6 цифр'),
  ngduId: z.coerce.number<string | number>().int().positive('Выберите НГДУ'),
  deviation: z.coerce
    .number<string | number>({ error: 'Введите число' })
    .min(0, 'Отклонение не может быть меньше 0%')
    .max(100, 'Отклонение не может быть больше 100%'),
  note: z.string().trim().max(500, 'Заметка — не длиннее 500 символов'),
})
export type WellFormInput = z.input<typeof wellFormSchema>
export type WellForm = z.output<typeof wellFormSchema>

export function daysSince(isoDate: string | null, now: Date = new Date()): number | null {
  if (!isoDate) return null
  return Math.floor((now.getTime() - new Date(isoDate).getTime()) / (24 * 60 * 60 * 1000))
}
