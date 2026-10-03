import { z } from 'zod';

export const contactMessageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Имя должно быть не короче 2 символов')
    .max(80, 'Имя должно быть не длиннее 80 символов'),
  email: z.string().trim().pipe(z.email('Введите корректный email')),
  text: z
    .string()
    .trim()
    .min(1, 'Введите сообщение')
    .max(2000, 'Сообщение должно быть не длиннее 2000 символов'),
});

export type ContactMessageInput = z.output<typeof contactMessageSchema>;
