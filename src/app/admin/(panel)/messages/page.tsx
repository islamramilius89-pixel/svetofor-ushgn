import type { Metadata } from 'next'
import { AdminMessagesScreen } from '@/components/admin/AdminMessagesScreen'

export const metadata: Metadata = { title: 'Сообщения — админ-панель' }

export default function AdminMessagesPage() {
  return <AdminMessagesScreen />
}
