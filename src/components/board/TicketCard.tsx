import Link from 'next/link'
import { neighbourStatus, TICKET_STATUS_LABELS, type Ticket, type TicketStatus } from '@/layers/domain/tickets/ticket'
import { PriorityBadge } from '@/components/tickets/TicketBadges'
import { wellStatusStyles } from '@/components/wells/WellStatusBadge'

type TicketCardProps = {
  ticket: Ticket
  compact: boolean
  isDragged: boolean
  onDragStart: () => void
  onDragEnd: () => void
  onMove: (status: TicketStatus) => void
}

export function TicketCard({ ticket, compact, isDragged, onDragStart, onDragEnd, onMove }: TicketCardProps) {
  const previous = neighbourStatus(ticket.status, -1)
  const next = neighbourStatus(ticket.status, 1)

  return (
    <li
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData('text/plain', String(ticket.id))
        event.dataTransfer.effectAllowed = 'move'
        onDragStart()
      }}
      onDragEnd={onDragEnd}
      className={`bg-white rounded-lg shadow p-4 border-l-4 cursor-grab active:cursor-grabbing transition ${
        isDragged ? 'opacity-40' : 'hover:shadow-md'
      } ${ticket.priority === 'HIGH' ? 'border-red-500' : ticket.priority === 'MEDIUM' ? 'border-orange-400' : 'border-gray-300'}`}
    >
      <div className="flex items-start justify-between gap-2">
        <Link href={`/tickets/${ticket.id}`} className="font-semibold text-gray-800 hover:text-blue-700 hover:underline">
          {ticket.title}
        </Link>
        <PriorityBadge priority={ticket.priority} />
      </div>

      {!compact && ticket.description && (
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{ticket.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-sm text-gray-600">
        <Link href={`/wells/${ticket.well.id}`} className="inline-flex items-center gap-1 hover:underline">
          <span className={`h-2 w-2 rounded-full ${wellStatusStyles[ticket.well.status].dot}`} aria-hidden="true" />
          Скв. № {ticket.well.number}
        </Link>
        <span>{ticket.assignee || 'Без исполнителя'}</span>
        {ticket.commentCount > 0 && <span>💬 {ticket.commentCount}</span>}
      </div>

      {/* Кнопки — для тех, кто не может перетаскивать: клавиатура, телефон. */}
      <div className="flex justify-between mt-3">
        {previous ? (
          <MoveButton onClick={() => onMove(previous)} label={`← ${TICKET_STATUS_LABELS[previous]}`} />
        ) : (
          <span />
        )}
        {next && <MoveButton onClick={() => onMove(next)} label={`${TICKET_STATUS_LABELS[next]} →`} />}
      </div>
    </li>
  )
}

function MoveButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Перенести в «${label.replace(/[←→]/g, '').trim()}»`}
      className="text-xs font-semibold text-blue-700 hover:bg-blue-50 rounded px-2 py-1"
    >
      {label}
    </button>
  )
}
