import {
  messageListSchema,
  messageSchema,
  type ContactForm,
  type Message,
} from '@/layers/domain/messages/message'
import { jsonBody, requestJson, requestVoid } from '@/layers/infrastructure/http/http-client'

export function createMessage(form: ContactForm): Promise<Message> {
  return requestJson('/messages', messageSchema, jsonBody('POST', form))
}

/** Только для администратора: в сообщениях есть email отправителей. */
export function fetchMessages(): Promise<Message[]> {
  return requestJson('/messages', messageListSchema)
}

export function deleteMessage(id: number): Promise<void> {
  return requestVoid(`/messages/${id}`, { method: 'DELETE' })
}

export function deleteAllMessages(): Promise<void> {
  return requestVoid('/messages', { method: 'DELETE' })
}
