import type { Metadata } from 'next'
import { AdminTicketsScreen } from '@/components/admin/AdminTicketsScreen'

export const metadata: Metadata = { title: 'Заявки — админ-панель' }

export default function AdminTicketsPage() {
  return <AdminTicketsScreen />
}
