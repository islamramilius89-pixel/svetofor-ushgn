import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_COOKIE } from '@/layers/domain/auth/auth'

/**
 * Быстрая проверка до отрисовки: без cookie администратора в админку не пускаем, отправляем на вход.
 * Это не защита данных — настоящие права проверяет API на каждом запросе.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  if (pathname === '/admin/login' || request.cookies.has(ADMIN_COOKIE)) return NextResponse.next()

  const loginUrl = new URL('/admin/login', request.url)
  loginUrl.searchParams.set('next', pathname + search)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/admin/:path*'],
}
