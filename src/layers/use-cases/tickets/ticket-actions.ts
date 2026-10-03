import {
  commentFormSchema,
  ticketFormSchema,
  type CommentFormInput,
  type TicketFormInput,
} from '@/layers/domain/tickets/ticket'
import { addComment, createTicket } from '@/layers/infrastructure/tickets/tickets-api'
import { submitForm } from '@/layers/use-cases/forms/submit-form'

export function createTicketFromForm(input: TicketFormInput) {
  return submitForm(ticketFormSchema, input, createTicket)
}

export function addTicketComment(ticketId: number, input: CommentFormInput) {
  return submitForm(commentFormSchema, input, (comment) => addComment(ticketId, comment))
}
