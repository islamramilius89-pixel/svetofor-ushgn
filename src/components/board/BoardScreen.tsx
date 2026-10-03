'use client'

import { useState } from 'react'
import { Button } from '@/common/ui/Button'
import { ErrorState, LoadingState } from '@/common/ui/QueryState'
import { useBoardFlow, type BoardFlow } from '@/flows/use-board-flow'
import {
  TICKET_PRIORITIES,
  TICKET_PRIORITY_LABELS,
  TICKET_STATUSES,
  TICKET_STATUS_LABELS,
  type BoardFilters,
  type TicketPriority,
  type TicketStatus,
} from '@/layers/domain/tickets/ticket'
import { CreateTicketDialog } from '@/components/tickets/CreateTicketDialog'
import { TicketCard } from './TicketCard'

const columnStyles: Record<TicketStatus, string> = {
  NEW: 'border-blue-500',
  IN_PROGRESS: 'border-purple-500',
  DONE: 'border-green-500',
}

const controlClass = 'px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-blue-600'

export function BoardScreen({ filters }: { filters: BoardFilters }) {
  const flow = useBoardFlow(filters)

  return (
    <>
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex-1 min-w-48">
          <span className="block text-sm font-semibold text-gray-700 mb-1">Поиск</span>
          <input
            type="search"
            defaultValue={filters.search}
            onChange={(event) => flow.changeSearch(event.target.value)}
            placeholder="Название, исполнитель или номер скважины"
            className={`${controlClass} w-full`}
          />
        </label>
        <label>
          <span className="block text-sm font-semibold text-gray-700 mb-1">Приоритет</span>
          <select
            value={filters.priority ?? ''}
            onChange={(event) =>
              flow.applyFilters({ priority: (event.target.value || undefined) as TicketPriority | undefined })
            }
            className={controlClass}
          >
            <option value="">Любой</option>
            {TICKET_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {TICKET_PRIORITY_LABELS[priority]}
              </option>
            ))}
          </select>
        </label>
        <Button variant="secondary" onClick={flow.toggleCompact} aria-pressed={flow.compact}>
          {flow.compact ? 'Подробный вид' : 'Компактный вид'}
        </Button>
        <Button onClick={flow.openCreate}>+ Новая заявка</Button>
      </div>

      {flow.moveError && (
        <p role="alert" className="text-red-600">
          Не удалось перенести заявку: {flow.moveError}. Карточка возвращена на место.
        </p>
      )}

      {flow.isLoading ? (
        <LoadingState text="Загружаем заявки…" />
      ) : flow.error ? (
        <ErrorState message={flow.error} onRetry={flow.retry} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {TICKET_STATUSES.map((status) => (
            <BoardColumn key={status} status={status} flow={flow} />
          ))}
        </div>
      )}

      <CreateTicketDialog open={flow.isCreateOpen} onClose={flow.closeCreate} />
    </>
  )
}

function BoardColumn({ status, flow }: { status: TicketStatus; flow: BoardFlow }) {
  const [isOver, setIsOver] = useState(false)
  const tickets = flow.columns[status]

  return (
    <section
      aria-label={TICKET_STATUS_LABELS[status]}
      onDragOver={(event) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
        if (!isOver) setIsOver(true)
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsOver(false)
      }}
      onDrop={(event) => {
        event.preventDefault()
        setIsOver(false)
        const id = Number(event.dataTransfer.getData('text/plain'))
        if (id) flow.moveTicket(id, status)
      }}
      className={`rounded-xl bg-gray-100 p-4 border-t-4 min-h-48 transition ${columnStyles[status]} ${
        isOver ? 'ring-2 ring-blue-400 bg-blue-50' : ''
      }`}
    >
      <h2 className="font-bold text-lg mb-4 flex items-center justify-between">
        {TICKET_STATUS_LABELS[status]}
        <span className="rounded-full bg-white px-2.5 py-0.5 text-sm text-gray-600">{tickets.length}</span>
      </h2>
      {tickets.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-6">Перетащите сюда карточку</p>
      ) : (
        <ul className="space-y-3">
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              compact={flow.compact}
              isDragged={flow.draggedId === ticket.id}
              onDragStart={() => flow.setDraggedId(ticket.id)}
              onDragEnd={() => flow.setDraggedId(null)}
              onMove={(next) => flow.moveTicket(ticket.id, next)}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
