import { z } from '@/layers/domain/zod'

export const contactFormSchema = z.object({
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
})

/** То, что вводит пользователь (до очистки пробелов). */
export type ContactFormInput = z.input<typeof contactFormSchema>
/** Проверенные и очищенные данные формы. */
export type ContactForm = z.output<typeof contactFormSchema>
export type ContactFormField = keyof ContactFormInput

export const messageSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  text: z.string(),
  createdAt: z.iso.datetime(),
})

export const messageListSchema = z.array(messageSchema)

export type Message = z.infer<typeof messageSchema>
