import 'server-only'

import { adminSessionSchema, type AdminSession } from '@/layers/domain/auth/auth'
import { statsSchema, type Stats } from '@/layers/domain/stats/stats'
import { ApiError } from '@/layers/infrastructure/http/http-client'
import { serverRequestJson } from '@/layers/infrastructure/http/server-api'

/** Сводка для главной и админки. Если API недоступен — null, страница покажет заглушку. */
export async function fetchStats(): Promise<Stats | null> {
  try {
    return await serverRequestJson('/stats', statsSchema)
  } catch {
    return null
  }
}

/** Текущий администратор или null. Права проверяет сервер API по cookie, а не наличие cookie само по себе. */
export async function fetchAdminSession(): Promise<AdminSession | null> {
  try {
    return await serverRequestJson('/auth/me', adminSessionSchema, { asAdmin: true })
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null
    throw error
  }
}
