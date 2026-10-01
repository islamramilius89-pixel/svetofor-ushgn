import {
  messageListSchema,
  messageSchema,
  type ContactForm,
  type Message,
} from '@/layers/domain/messages/message'
import { requestJson, requestVoid } from '@/layers/infrastructure/http/http-client'

export function fetchMessages(): Promise<Message[]> {
  return requestJson('/messages', messageListSchema)
}

export function createMessage(form: ContactForm): Promise<Message> {
  return requestJson('/messages', messageSchema, {
    method: 'POST',
    body: JSON.stringify(form),
  })
}

export function deleteMessage(id: string): Promise<void> {
  return requestVoid(`/messages/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export function deleteAllMessages(): Promise<void> {
  return requestVoid('/messages', { method: 'DELETE' })
}
