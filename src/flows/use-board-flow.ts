import { useRouter } from 'next/navigation'
import { useMemo, useState, useTransition } from 'react'
import { useTicketsQuery, useUpdateTicketMutation } from '@/interactions/tickets'
import {
  groupTicketsByStatus,
  type BoardFilters,
  type TicketStatus,
} from '@/layers/domain/tickets/ticket'
import { usePreferencesStore } from '@/stores/preferences-store'
import { useDebouncedCallback } from './use-debounced-callback'

/** Доска заявок: колонки, перетаскивание, фильтры в адресе и окно создания заявки. */
export function useBoardFlow(filters: BoardFilters) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  const ticketsQuery = useTicketsQuery(filters)
  const updateMutation = useUpdateTicketMutation()
  const tickets = ticketsQuery.data
  const columns = useMemo(() => groupTicketsByStatus(tickets ?? []), [tickets])

  const compact = usePreferencesStore((state) => state.compactBoard)
  const toggleCompact = usePreferencesStore((state) => state.toggleCompactBoard)

  const [draggedId, setDraggedId] = useState<number | null>(null)
  const [isCreateOpen, setCreateOpen] = useState(false)

  function moveTicket(id: number, status: TicketStatus) {
    const ticket = tickets?.find((item) => item.id === id)
    if (!ticket || ticket.status === status) return
    updateMutation.mutate({ id, patch: { status } })
  }

  function applyFilters(patch: Partial<BoardFilters>) {
    const next = { ...filters, ...patch }
    const params = new URLSearchParams()
    if (next.search) params.set('search', next.search)
    if (next.priority) params.set('priority', next.priority)
    const query = params.toString()
    startTransition(() => router.replace(query ? `/board?${query}` : '/board', { scroll: false }))
  }

  const changeSearch = useDebouncedCallback((value: string) => applyFilters({ search: value.trim() }))

  return {
    filters,
    applyFilters,
    changeSearch,

    columns,
    total: tickets?.length ?? 0,
    isLoading: ticketsQuery.isPending,
    error: ticketsQuery.error?.message ?? null,
    retry: () => void ticketsQuery.refetch(),

    moveTicket,
    moveError: updateMutation.error?.message ?? null,
    draggedId,
    setDraggedId,

    compact,
    toggleCompact,

    isCreateOpen,
    openCreate: () => setCreateOpen(true),
    closeCreate: () => setCreateOpen(false),
  }
}

export type BoardFlow = ReturnType<typeof useBoardFlow>
