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

/** Превращает ответ с ошибкой в ApiError с понятным текстом. Используется и в браузере, и на сервере. */
export async function toApiError(response: Response): Promise<ApiError> {
  const body = errorBodySchema.safeParse(await response.json().catch(() => null))
  return new ApiError(
    body.success ? body.data.error : `Ошибка сервера (${response.status})`,
    response.status,
    body.success ? body.data.fieldErrors : undefined,
  )
}

/** Проверяет JSON-ответ схемой: в приложение попадают только данные ожидаемого формата. */
export async function parseJson<T>(response: Response, schema: z.ZodType<T>): Promise<T> {
  const parsed = schema.safeParse(await response.json().catch(() => null))
  if (!parsed.success) {
    throw new ApiError('Сервер вернул данные в неожиданном формате', response.status)
  }
  return parsed.data
}

/** Собирает строку запроса, пропуская пустые значения. */
export function toQueryString(params: Record<string, string | number | undefined | null>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') search.set(key, String(value))
  }
  const query = search.toString()
  return query ? `?${query}` : ''
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

  if (!response.ok) throw await toApiError(response)
  return response
}

export async function requestJson<T>(path: string, schema: z.ZodType<T>, init?: RequestInit): Promise<T> {
  return parseJson(await send(path, init), schema)
}

/** Запрос без тела ответа (например, удаление). */
export async function requestVoid(path: string, init?: RequestInit): Promise<void> {
  await send(path, init)
}

export const jsonBody = (method: 'POST' | 'PATCH', body: unknown): RequestInit => ({
  method,
  body: JSON.stringify(body),
})
