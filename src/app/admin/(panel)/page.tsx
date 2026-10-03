import type { Metadata } from 'next'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { fetchStats } from '@/layers/infrastructure/server/server-queries'

export const metadata: Metadata = { title: 'Админ-панель' }

export default async function AdminHomePage() {
  return <AdminDashboard stats={await fetchStats()} />
}
