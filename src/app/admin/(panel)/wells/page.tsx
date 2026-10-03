import type { Metadata } from 'next'
import { AdminWellsScreen } from '@/components/admin/AdminWellsScreen'

export const metadata: Metadata = { title: 'Скважины — админ-панель' }

export default function AdminWellsPage() {
  return <AdminWellsScreen />
}
