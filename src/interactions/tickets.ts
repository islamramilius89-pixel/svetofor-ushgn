import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  BoardFilters,
  CommentFormInput,
  Ticket,
  TicketDetails,
  TicketPatch,
} from '@/layers/domain/tickets/ticket'
import {
  deleteTicket,
  fetchTicket,
  fetchTickets,
  updateTicket,
} from '@/layers/infrastructure/tickets/tickets-api'
import { addTicketComment, createTicketFromForm } from '@/layers/use-cases/tickets/ticket-actions'
import { wellKeys } from './wells'

export const ticketKeys = {
  all: ['tickets'] as const,
  lists: ['tickets', 'list'] as const,
  list: (filters: Partial<BoardFilters>) => ['tickets', 'list', filters] as const,
  detail: (id: number) => ['tickets', 'detail', id] as const,
}

export function useTicketsQuery(filters: Partial<BoardFilters>) {
  return useQuery({ queryKey: ticketKeys.list(filters), queryFn: () => fetchTickets(filters) })
}

export function useTicketQuery(id: number) {
  return useQuery({ queryKey: ticketKeys.detail(id), queryFn: () => fetchTicket(id) })
}

export function useCreateTicketMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTicketFromForm,
    onSuccess: (ticket) => {
      void queryClient.invalidateQueries({ queryKey: ticketKeys.lists })
      void queryClient.invalidateQueries({ queryKey: wellKeys.detail(ticket.well.id) })
      void queryClient.invalidateQueries({ queryKey: wellKeys.all })
    },
  })
}

type UpdateVariables = { id: number; patch: TicketPatch }
type Snapshot = { lists: [readonly unknown[], Ticket[] | undefined][]; detail: TicketDetails | undefined }

/**
 * Оптимистичное обновление: карточка переезжает в другую колонку сразу, не дожидаясь сервера.
 * Если сервер ответил ошибкой — возвращаем всё как было.
 */
export function useUpdateTicketMutation() {
  const queryClient = useQueryClient()
  return useMutation<Ticket, Error, UpdateVariables, Snapshot>({
    mutationFn: ({ id, patch }) => updateTicket(id, patch),
    onMutate: async ({ id, patch }) => {
      await queryClient.cancelQueries({ queryKey: ticketKeys.all })
      const snapshot: Snapshot = {
        lists: queryClient.getQueriesData<Ticket[]>({ queryKey: ticketKeys.lists }),
        detail: queryClient.getQueryData<TicketDetails>(ticketKeys.detail(id)),
      }

      queryClient.setQueriesData<Ticket[]>({ queryKey: ticketKeys.lists }, (tickets) =>
        tickets?.map((ticket) =>
          ticket.id === id ? { ...ticket, ...patch, updatedAt: new Date().toISOString() } : ticket,
        ),
      )
      queryClient.setQueryData<TicketDetails>(ticketKeys.detail(id), (ticket) =>
        ticket ? { ...ticket, ...patch } : ticket,
      )
      return snapshot
    },
    onError: (_error, { id }, snapshot) => {
      if (!snapshot) return
      for (const [key, data] of snapshot.lists) queryClient.setQueryData(key, data)
      queryClient.setQueryData(ticketKeys.detail(id), snapshot.detail)
    },
    onSettled: (ticket, _error, { id }) => {
      void queryClient.invalidateQueries({ queryKey: ticketKeys.lists })
      void queryClient.invalidateQueries({ queryKey: ticketKeys.detail(id) })
      // Закрытие заявки меняет дату проверки скважины.
      if (ticket) void queryClient.invalidateQueries({ queryKey: wellKeys.detail(ticket.well.id) })
    },
  })
}

export function useDeleteTicketMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteTicket,
    onSuccess: (_result, id) => {
      queryClient.setQueriesData<Ticket[]>({ queryKey: ticketKeys.lists }, (tickets) =>
        tickets?.filter((ticket) => ticket.id !== id),
      )
      queryClient.removeQueries({ queryKey: ticketKeys.detail(id) })
      void queryClient.invalidateQueries({ queryKey: wellKeys.all })
    },
  })
}

export function useAddCommentMutation(ticketId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CommentFormInput) => addTicketComment(ticketId, input),
    onSuccess: (comment) => {
      queryClient.setQueryData<TicketDetails>(ticketKeys.detail(ticketId), (ticket) =>
        ticket
          ? { ...ticket, comments: [...ticket.comments, comment], commentCount: ticket.commentCount + 1 }
          : ticket,
      )
      void queryClient.invalidateQueries({ queryKey: ticketKeys.lists })
    },
  })
}
