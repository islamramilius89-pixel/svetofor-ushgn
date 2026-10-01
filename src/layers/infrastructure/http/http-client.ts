import { z } from 'zod'

const API_BASE_URL = '/api'

const errorBodySchema = z.object({
  error: z.string(),
  fieldErrors: z.record(z.string(), z.string()).optional(),
})

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly fieldErrors?: Record<string, string>,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function send(path: string, init?: RequestInit): Promise<Response> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      },
    })
  } catch {
    throw new ApiError('Нет связи с сервером. Проверьте подключение.', 0)
  }

  if (!response.ok) {
    const body = errorBodySchema.safeParse(await response.json().catch(() => null))
    throw new ApiError(
      body.success ? body.data.error : `Ошибка сервера (${response.status})`,
      response.status,
      body.success ? body.data.fieldErrors : undefined,
    )
  }

  return response
}

/** Запрос с JSON-ответом. Ответ сервера проверяется схемой: в приложение попадают только данные ожидаемого формата. */
export async function requestJson<T>(path: string, schema: z.ZodType<T>, init?: RequestInit): Promise<T> {
  const response = await send(path, init)
  const parsed = schema.safeParse(await response.json().catch(() => null))
  if (!parsed.success) {
    throw new ApiError('Сервер вернул данные в неожиданном формате', response.status)
  }
  return parsed.data
}

/** Запрос без тела ответа (например, удаление). */
export async function requestVoid(path: string, init?: RequestInit): Promise<void> {
  await send(path, init)
}
