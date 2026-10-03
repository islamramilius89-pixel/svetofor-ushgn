import { z } from 'zod';

export const ticketStatusSchema = z.enum(['NEW', 'IN_PROGRESS', 'DONE']);
export const ticketPrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH']);

const title = z
  .string()
  .trim()
  .min(3, 'Название — не короче 3 символов')
  .max(120, 'Название — не длиннее 120 символов');
const description = z.string().trim().max(2000, 'Описание — не длиннее 2000 символов');
const assignee = z.string().trim().max(60, 'Имя исполнителя — не длиннее 60 символов');

export const listTicketsQuerySchema = z.object({
  wellId: z.coerce.number().int().positive().optional(),
  priority: ticketPrioritySchema.optional(),
  search: z.string().trim().max(50).optional(),
});

export const createTicketSchema = z.object({
  wellId: z.number({ error: 'Выберите скважину' }).int().positive('Выберите скважину'),
  title,
  description: description.default(''),
  priority: ticketPrioritySchema.default('MEDIUM'),
  assignee: assignee.default(''),
});

export const updateTicketSchema = z
  .object({ title, description, status: ticketStatusSchema, priority: ticketPrioritySchema, assignee })
  .partial()
  .refine((value) => Object.keys(value).length > 0, 'Нет изменений');

export const createCommentSchema = z.object({
  author: z.string().trim().min(2, 'Имя — не короче 2 символов').max(60, 'Имя — не длиннее 60 символов'),
  text: z.string().trim().min(1, 'Введите комментарий').max(1000, 'Комментарий — не длиннее 1000 символов'),
});

export type ListTicketsQuery = z.output<typeof listTicketsQuerySchema>;
export type CreateTicketInput = z.output<typeof createTicketSchema>;
export type UpdateTicketInput = z.output<typeof updateTicketSchema>;
export type CreateCommentInput = z.output<typeof createCommentSchema>;
