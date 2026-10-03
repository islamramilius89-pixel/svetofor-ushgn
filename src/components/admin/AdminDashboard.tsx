import Link from 'next/link'
import { Card } from '@/common/ui/Card'
import { TICKET_STATUSES, TICKET_STATUS_LABELS } from '@/layers/domain/tickets/ticket'
import type { Stats } from '@/layers/domain/stats/stats'
import { WELL_STATUSES } from '@/layers/domain/wells/well'
import { WellStatusBadge } from '@/components/wells/WellStatusBadge'

export function AdminDashboard({ stats }: { stats: Stats | null }) {
  if (!stats) {
    return <Card title="Обзор">Не удалось получить сводку: сервер API недоступен.</Card>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title={`Скважины: ${stats.wells.total}`}>
        <ul className="space-y-3">
          {WELL_STATUSES.map((status) => (
            <li key={status} className="flex items-center justify-between">
              <WellStatusBadge status={status} />
              <span className="text-2xl font-bold tabular-nums">{stats.wells.byStatus[status]}</span>
            </li>
          ))}
        </ul>
        <Link href="/admin/wells" className="inline-block mt-6 text-blue-700 font-semibold hover:underline">
          Управлять скважинами →
        </Link>
      </Card>
      <Card title={`Заявки: ${stats.tickets.total}`}>
        <ul className="space-y-3">
          {TICKET_STATUSES.map((status) => (
            <li key={status} className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">{TICKET_STATUS_LABELS[status]}</span>
              <span className="text-2xl font-bold tabular-nums">{stats.tickets.byStatus[status]}</span>
            </li>
          ))}
        </ul>
        <Link href="/admin/tickets" className="inline-block mt-6 text-blue-700 font-semibold hover:underline">
          Управлять заявками →
        </Link>
      </Card>
    </div>
  )
}
