'use client'

import Link from 'next/link'
import { useState } from 'react'
import { formatDate } from '@/common/format'
import { Button } from '@/common/ui/Button'
import { Card } from '@/common/ui/Card'
import { EmptyState, ErrorState, LoadingState } from '@/common/ui/QueryState'
import { useDeleteTicketMutation, useTicketsQuery } from '@/interactions/tickets'
import { PriorityBadge, TicketStatusBadge } from '@/components/tickets/TicketBadges'

export function AdminTicketsScreen() {
  const ticketsQuery = useTicketsQuery({})
  const deleteMutation = useDeleteTicketMutation()
  const [confirmId, setConfirmId] = useState<number | null>(null)

  if (ticketsQuery.isPending) return <LoadingState />
  if (ticketsQuery.error) {
    return <ErrorState message={ticketsQuery.error.message} onRetry={() => void ticketsQuery.refetch()} />
  }
  if (ticketsQuery.data.length === 0) return <EmptyState>Заявок нет.</EmptyState>

  return (
    <Card>
      {deleteMutation.error && (
        <p role="alert" className="text-red-600 mb-4">
          {deleteMutation.error.message}
        </p>
      )}
      <ul className="divide-y">
        {ticketsQuery.data.map((ticket) => (
          <li key={ticket.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <Link href={`/tickets/${ticket.id}`} className="font-semibold text-blue-700 hover:underline">
                {ticket.title}
              </Link>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500">
                <span>Скв. № {ticket.well.number}</span>
                <PriorityBadge priority={ticket.priority} />
                <TicketStatusBadge status={ticket.status} />
                <span>{formatDate(ticket.createdAt)}</span>
              </div>
            </div>
            {confirmId === ticket.id ? (
              <span className="inline-flex items-center gap-2">
                <span className="text-sm text-red-700">Удалить заявку?</span>
                <Button
                  variant="danger"
                  size="sm"
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(ticket.id, { onSuccess: () => setConfirmId(null) })}
                >
                  Да
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setConfirmId(null)}>
                  Нет
                </Button>
              </span>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setConfirmId(ticket.id)}>
                Удалить
              </Button>
            )}
          </li>
        ))}
      </ul>
    </Card>
  )
}
