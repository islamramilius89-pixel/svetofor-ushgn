import 'server-only'

import { cookies } from 'next/headers'
import type { z } from 'zod'
import { ADMIN_COOKIE } from '@/layers/domain/auth/auth'
import { ApiError, parseJson, toApiError } from './http-client'

/** На сервере нет «текущего сайта», поэтому обращаемся к бэкенду по полному адресу. */
const API_URL = process.env.API_URL ?? 'http://localhost:4000'

type ServerRequestOptions = {
  /** Переслать cookie администратора — для страниц админки. */
  asAdmin?: boolean
}

/** Запрос к API из серверного компонента. Данные всегда свежие, без кеша. */
export async function serverRequestJson<T>(
  path: string,
  schema: z.ZodType<T>,
  { asAdmin = false }: ServerRequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (asAdmin) {
    const token = (await cookies()).get(ADMIN_COOKIE)?.value
    if (token) headers.Cookie = `${ADMIN_COOKIE}=${token}`
  }

  let response: Response
  try {
    response = await fetch(`${API_URL}/api${path}`, { headers, cache: 'no-store' })
  } catch {
    throw new ApiError('Сервер API недоступен', 0)
  }

  if (!response.ok) throw await toApiError(response)
  return parseJson(response, schema)
}
