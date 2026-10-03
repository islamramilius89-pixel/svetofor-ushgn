import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { PageShell } from '@/common/ui/PageShell'
import { AdminLoginScreen } from '@/components/admin/AdminLoginScreen'
import { safeAdminRedirect } from '@/layers/domain/auth/auth'
import { fetchAdminSession } from '@/layers/infrastructure/server/server-queries'

export const metadata: Metadata = { title: 'Вход в админ-панель' }

export default async function AdminLoginPage({ searchParams }: PageProps<'/admin/login'>) {
  const next = (await searchParams).next
  const nextPath = typeof next === 'string' ? next : undefined
  // Уже вошли — сразу в админку.
  const session = await fetchAdminSession().catch(() => null)
  if (session) redirect(safeAdminRedirect(nextPath))

  return (
    <PageShell title="Админ-панель">
      <AdminLoginScreen next={nextPath} />
    </PageShell>
  )
}
