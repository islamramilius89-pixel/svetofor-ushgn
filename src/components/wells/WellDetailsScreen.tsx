'use client'

import Link from 'next/link'
import { useState } from 'react'
import { formatDate, formatDateTime } from '@/common/format'
import { Button } from '@/common/ui/Button'
import { Card } from '@/common/ui/Card'
import { ProgressBar } from '@/common/ui/ProgressBar'
import { EmptyState, ErrorState, LoadingState } from '@/common/ui/QueryState'
import { useWellQuery } from '@/interactions/wells'
import { daysSince, STATUS_THRESHOLDS } from '@/layers/domain/wells/well'
import { CreateTicketDialog } from '@/components/tickets/CreateTicketDialog'
import { PriorityBadge, TicketStatusBadge } from '@/components/tickets/TicketBadges'
import { useFavoritesStore } from '@/stores/favorites-store'
import { FavoriteButton } from './FavoriteButton'
import { WellStatusBadge, wellStatusStyles } from './WellStatusBadge'

export function WellDetailsScreen({ id }: { id: number }) {
  const wellQuery = useWellQuery(id)
  const isFavorite = useFavoritesStore((state) => state.ids.includes(id))
  const toggleFavorite = useFavoritesStore((state) => state.toggle)
  const [isCreateOpen, setCreateOpen] = useState(false)

  if (wellQuery.isPending) return <LoadingState text="Загружаем скважину…" />
  if (wellQuery.error) return <ErrorState message={wellQuery.error.message} onRetry={() => void wellQuery.refetch()} />

  const well = wellQuery.data
  const days = daysSince(well.lastCheckAt)

  return (
    <>
      <div>
        <Link href="/wells" className="text-blue-700 hover:underline">
          ← Все скважины
        </Link>
        <div className="flex flex-wrap items-center gap-4 mt-2">
          <h1 className="text-4xl font-bold">Скважина № {well.number}</h1>
          <WellStatusBadge status={well.status} />
          <FavoriteButton active={isFavorite} label={`скважину ${well.number}`} onToggle={() => toggleFavorite(id)} />
        </div>
        <p className="text-gray-500 mt-1">{well.ngdu.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Отклонение тока">
          <p className="text-5xl font-bold tabular-nums">{well.deviation}%</p>
          <div className="mt-4">
            <ProgressBar
              value={Math.min(100, well.deviation * 2)}
              label="Отклонение тока от эталона"
              barClassName={wellStatusStyles[well.status].bar}
            />
            <p className="text-sm text-gray-500 mt-2">
              Жёлтый — от {STATUS_THRESHOLDS.yellow}%, красный — от {STATUS_THRESHOLDS.red}%
            </p>
          </div>
        </Card>
        <Card title="Последняя проверка">
          {well.lastCheckAt ? (
            <>
              <p className="text-2xl font-bold">{formatDate(well.lastCheckAt)}</p>
              <p className={`mt-2 ${days !== null && days > 30 ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                {days === 0 ? 'сегодня' : `${days} дн. назад`}
                {days !== null && days > 30 && ' — давно не проверялась'}
              </p>
            </>
          ) : (
            <p className="text-gray-500">Ещё не проверялась</p>
          )}
          <p className="text-sm text-gray-500 mt-4">Обновляется, когда заявку по скважине переводят в «Проверено».</p>
        </Card>
        <Card title="Заметка">
          <p className="text-gray-700 whitespace-pre-line">{well.note || 'Нет заметок.'}</p>
          <p className="text-sm text-gray-500 mt-4">Обновлено {formatDateTime(well.updatedAt)}</p>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold">Заявки по скважине ({well.tickets.length})</h2>
          <Button onClick={() => setCreateOpen(true)}>+ Создать заявку</Button>
        </div>
        {well.tickets.length === 0 ? (
          <EmptyState>Заявок нет. Если показания вызывают сомнения — создайте заявку на проверку.</EmptyState>
        ) : (
          <ul className="divide-y">
            {well.tickets.map((ticket) => (
              <li key={ticket.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
                <Link href={`/tickets/${ticket.id}`} className="font-semibold text-blue-700 hover:underline">
                  {ticket.title}
                </Link>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <PriorityBadge priority={ticket.priority} />
                  <TicketStatusBadge status={ticket.status} />
                  <span>{formatDate(ticket.createdAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <CreateTicketDialog open={isCreateOpen} onClose={() => setCreateOpen(false)} wellId={id} />
    </>
  )
}
