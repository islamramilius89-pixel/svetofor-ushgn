import {
  TICKET_PRIORITY_LABELS,
  TICKET_STATUS_LABELS,
  type TicketPriority,
  type TicketStatus,
} from '@/layers/domain/tickets/ticket'

const priorityStyles: Record<TicketPriority, string> = {
  HIGH: 'bg-red-100 text-red-800',
  MEDIUM: 'bg-orange-100 text-orange-800',
  LOW: 'bg-gray-100 text-gray-700',
}

const statusStyles: Record<TicketStatus, string> = {
  NEW: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  DONE: 'bg-green-100 text-green-800',
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${priorityStyles[priority]}`}>
      {TICKET_PRIORITY_LABELS[priority]}
    </span>
  )
}

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${statusStyles[status]}`}>
      {TICKET_STATUS_LABELS[status]}
    </span>
  )
}
