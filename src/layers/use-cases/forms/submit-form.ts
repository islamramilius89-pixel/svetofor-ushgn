import { validate, type FieldErrors } from '@/layers/domain/validation'
import type { z } from '@/layers/domain/zod'
import { ApiError } from '@/layers/infrastructure/http/http-client'

/** Ошибка заполнения формы: тексты ошибок по полям. Экран показывает их под полями. */
export class FormValidationError extends Error {
  constructor(readonly fieldErrors: FieldErrors) {
    super('Форма заполнена с ошибками')
    this.name = 'FormValidationError'
  }
}

/**
 * Общий порядок отправки любой формы:
 * 1) проверить по схеме в браузере — без лишнего запроса;
 * 2) отправить очищенные данные;
 * 3) если сервер сам нашёл ошибки по полям (400 или 409), привести их к тому же виду.
 */
export async function submitForm<S extends z.ZodType, R>(
  schema: S,
  input: unknown,
  send: (data: z.output<S>) => Promise<R>,
): Promise<R> {
  const validation = validate(schema, input)
  if (!validation.success) throw new FormValidationError(validation.fieldErrors)

  try {
    return await send(validation.data)
  } catch (error) {
    if (error instanceof ApiError && error.fieldErrors && (error.status === 400 || error.status === 409)) {
      throw new FormValidationError(error.fieldErrors)
    }
    throw error
  }
}

/** Ошибки по полям из ошибки мутации (или пустой объект). */
export function fieldErrorsOf(error: unknown): FieldErrors {
  return error instanceof FormValidationError ? error.fieldErrors : {}
}

/** Общая ошибка (сеть, сервер), которую показываем над кнопкой. Ошибки полей сюда не попадают. */
export function generalErrorOf(error: unknown): string | null {
  if (!error || error instanceof FormValidationError) return null
  return error instanceof Error ? error.message : 'Что-то пошло не так'
}
