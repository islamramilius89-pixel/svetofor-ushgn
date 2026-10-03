import {
  commentSchema,
  ticketDetailsSchema,
  ticketListSchema,
  ticketSchema,
  type BoardFilters,
  type TicketForm,
  type TicketPatch,
} from '@/layers/domain/tickets/ticket'
import { jsonBody, requestJson, requestVoid, toQueryString } from '@/layers/infrastructure/http/http-client'

export function fetchTickets(filters: Partial<BoardFilters> & { wellId?: number } = {}) {
  return requestJson(`/tickets${toQueryString(filters)}`, ticketListSchema)
}

export function fetchTicket(id: number) {
  return requestJson(`/tickets/${id}`, ticketDetailsSchema)
}

export function createTicket(form: TicketForm) {
  return requestJson('/tickets', ticketSchema, jsonBody('POST', form))
}

export function updateTicket(id: number, patch: TicketPatch) {
  return requestJson(`/tickets/${id}`, ticketSchema, jsonBody('PATCH', patch))
}

export function deleteTicket(id: number) {
  return requestVoid(`/tickets/${id}`, { method: 'DELETE' })
}

export function addComment(ticketId: number, comment: { author: string; text: string }) {
  return requestJson(`/tickets/${ticketId}/comments`, commentSchema, jsonBody('POST', comment))
}
