import { z } from '@/layers/domain/zod'

export const TICKET_STATUSES = ['NEW', 'IN_PROGRESS', 'DONE'] as const
export const ticketStatusSchema = z.enum(TICKET_STATUSES)
export type TicketStatus = z.infer<typeof ticketStatusSchema>

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  NEW: 'Новые',
  IN_PROGRESS: 'В работе',
  DONE: 'Проверено',
}

/** От самого важного к наименее важному. */
export const TICKET_PRIORITIES = ['HIGH', 'MEDIUM', 'LOW'] as const
export const ticketPrioritySchema = z.enum(TICKET_PRIORITIES)
export type TicketPriority = z.infer<typeof ticketPrioritySchema>

export const TICKET_PRIORITY_LABELS: Record<TicketPriority, string> = {
  HIGH: 'Высокий',
  MEDIUM: 'Средний',
  LOW: 'Низкий',
}

const wellStatusSchema = z.enum(['GREEN', 'YELLOW', 'RED'])

export const ticketSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  status: ticketStatusSchema,
  priority: ticketPrioritySchema,
  assignee: z.string(),
  well: z.object({ id: z.number(), number: z.string(), status: wellStatusSchema }),
  commentCount: z.number(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  resolvedAt: z.iso.datetime().nullable(),
})
export type Ticket = z.infer<typeof ticketSchema>
export const ticketListSchema = z.array(ticketSchema)

export const commentSchema = z.object({
  id: z.number(),
  author: z.string(),
  text: z.string(),
  createdAt: z.iso.datetime(),
})
export type Comment = z.infer<typeof commentSchema>

export const ticketDetailsSchema = ticketSchema.extend({ comments: z.array(commentSchema) })
export type TicketDetails = z.infer<typeof ticketDetailsSchema>

export type TicketPatch = Partial<Pick<Ticket, 'title' | 'description' | 'status' | 'priority' | 'assignee'>>

export const ticketFormSchema = z.object({
  wellId: z.coerce.number<string | number>().int().positive('Выберите скважину'),
  title: z
    .string()
    .trim()
    .min(3, 'Название — не короче 3 символов')
    .max(120, 'Название — не длиннее 120 символов'),
  description: z.string().trim().max(2000, 'Описание — не длиннее 2000 символов'),
  priority: ticketPrioritySchema,
  assignee: z.string().trim().max(60, 'Имя исполнителя — не длиннее 60 символов'),
})
export type TicketFormInput = z.input<typeof ticketFormSchema>
export type TicketForm = z.output<typeof ticketFormSchema>

export const commentFormSchema = z.object({
  author: z.string().trim().min(2, 'Имя — не короче 2 символов').max(60, 'Имя — не длиннее 60 символов'),
  text: z.string().trim().min(1, 'Введите комментарий').max(1000, 'Комментарий — не длиннее 1000 символов'),
})
export type CommentFormInput = z.input<typeof commentFormSchema>

/**
 * Раскладывает заявки по колонкам доски.
 * Внутри колонки сначала важные, среди одинаковых — недавно изменённые.
 */
export function groupTicketsByStatus(tickets: Ticket[]): Record<TicketStatus, Ticket[]> {
  const columns: Record<TicketStatus, Ticket[]> = { NEW: [], IN_PROGRESS: [], DONE: [] }
  for (const ticket of tickets) columns[ticket.status].push(ticket)

  const priorityRank = (priority: TicketPriority) => TICKET_PRIORITIES.indexOf(priority)
  for (const status of TICKET_STATUSES) {
    columns[status].sort(
      (a, b) => priorityRank(a.priority) - priorityRank(b.priority) || b.updatedAt.localeCompare(a.updatedAt),
    )
  }
  return columns
}

/** Соседняя колонка для кнопок «влево / вправо» на карточке. */
export function neighbourStatus(status: TicketStatus, direction: -1 | 1): TicketStatus | null {
  return TICKET_STATUSES[TICKET_STATUSES.indexOf(status) + direction] ?? null
}

export const boardFiltersSchema = z.object({
  search: z.string().trim().max(50).catch(''),
  priority: ticketPrioritySchema.optional().catch(undefined),
})
export type BoardFilters = z.output<typeof boardFiltersSchema>
