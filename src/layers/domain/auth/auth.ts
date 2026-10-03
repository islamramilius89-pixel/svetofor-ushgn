import { z } from '@/layers/domain/zod'

/** Имя cookie с токеном администратора (выставляет сервер, httpOnly). */
export const ADMIN_COOKIE = 'svetofor_admin'

export const loginFormSchema = z.object({
  login: z.string().trim().min(1, 'Введите логин').max(50),
  password: z.string().min(1, 'Введите пароль').max(200),
})
export type LoginFormInput = z.input<typeof loginFormSchema>

export const adminSessionSchema = z.object({ login: z.string() })
export type AdminSession = z.infer<typeof adminSessionSchema>

/** Куда вернуть после входа: только внутренние адреса админки, чтобы ссылкой нельзя было увести на чужой сайт. */
export function safeAdminRedirect(next: string | null | undefined): string {
  return next && next.startsWith('/admin') && !next.startsWith('//') ? next : '/admin'
}
