import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { AdminNav } from '@/components/admin/AdminNav'
import { fetchAdminSession } from '@/layers/infrastructure/server/server-queries'

/**
 * Все страницы админки проверяют вход на сервере: спрашиваем у API, действителен ли токен.
 * proxy.ts только быстро перенаправляет тех, у кого cookie нет вовсе.
 */
export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const session = await fetchAdminSession()
  if (!session) redirect('/admin/login')

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
      <h1 className="text-4xl font-bold">Админ-панель</h1>
      <AdminNav login={session.login} />
      {children}
    </div>
  )
}
