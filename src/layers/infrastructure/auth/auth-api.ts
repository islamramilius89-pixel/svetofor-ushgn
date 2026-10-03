import { adminSessionSchema } from '@/layers/domain/auth/auth'
import { jsonBody, requestJson, requestVoid } from '@/layers/infrastructure/http/http-client'

/** Сервер проверяет пароль и сам выставляет httpOnly-cookie — токен в JavaScript не попадает. */
export function login(credentials: { login: string; password: string }) {
  return requestJson('/auth/login', adminSessionSchema, jsonBody('POST', credentials))
}

export function logout() {
  return requestVoid('/auth/logout', { method: 'POST' })
}
