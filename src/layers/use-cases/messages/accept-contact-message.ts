import {
  validateContactForm,
  type ContactFieldErrors,
  type Message,
} from '@/layers/domain/messages/message'
import { messageRepository } from '@/layers/infrastructure/messages/message-repository'

export type AcceptContactMessageResult =
  | { ok: true; message: Message }
  | { ok: false; fieldErrors: ContactFieldErrors }

/** Приём сообщения на сервере: данные от клиента не считаются проверенными, правило применяется повторно. */
export function acceptContactMessage(input: unknown): AcceptContactMessageResult {
  const validation = validateContactForm(input)
  if (!validation.success) return { ok: false, fieldErrors: validation.fieldErrors }

  return { ok: true, message: messageRepository.add(validation.data) }
}
