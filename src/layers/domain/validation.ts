import { z } from './zod'

export type FieldErrors = Record<string, string>

export type Validation<T> = { success: true; data: T } | { success: false; fieldErrors: FieldErrors }

/** Проверяет данные по схеме и возвращает либо очищенные данные, либо первую ошибку для каждого поля. */
export function validate<S extends z.ZodType>(schema: S, input: unknown): Validation<z.output<S>> {
  const result = schema.safeParse(input)
  if (result.success) return { success: true, data: result.data }

  const fieldErrors: FieldErrors = {}
  for (const issue of result.error.issues) {
    const field = issue.path.join('.') || 'form'
    fieldErrors[field] ??= issue.message
  }
  return { success: false, fieldErrors }
}

/** id из адреса страницы (/wells/42) — положительное целое, иначе null. */
export function parseRouteId(value: string): number | null {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}
