import { z } from 'zod';

export const wellStatusSchema = z.enum(['GREEN', 'YELLOW', 'RED']);

export const listWellsQuerySchema = z.object({
  search: z.string().trim().max(20).optional(),
  ngduId: z.coerce.number().int().positive().optional(),
  status: wellStatusSchema.optional(),
  /** Список id через запятую — для фильтра «Избранные». */
  ids: z
    .string()
    .optional()
    .transform((value) =>
      value
        ? value
            .split(',')
            .map(Number)
            .filter((id) => Number.isInteger(id) && id > 0)
        : undefined,
    ),
  sort: z.enum(['number', 'deviation']).default('deviation'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const wellInputSchema = z.object({
  number: z.string().trim().regex(/^\d{3,6}$/, 'Номер скважины — от 3 до 6 цифр'),
  ngduId: z.number({ error: 'Выберите НГДУ' }).int().positive('Выберите НГДУ'),
  deviation: z
    .number({ error: 'Введите отклонение' })
    .min(0, 'Отклонение не может быть меньше 0%')
    .max(100, 'Отклонение не может быть больше 100%'),
  note: z.string().trim().max(500, 'Заметка — не длиннее 500 символов').default(''),
});

export const updateWellSchema = wellInputSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, 'Нет изменений');

export type ListWellsQuery = z.output<typeof listWellsQuerySchema>;
export type WellInput = z.output<typeof wellInputSchema>;
export type UpdateWellInput = z.output<typeof updateWellSchema>;
