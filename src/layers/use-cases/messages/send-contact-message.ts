import {
  validateContactForm,
  type ContactFieldErrors,
  type ContactFormInput,
  type Message,
} from '@/layers/domain/messages/message'
import { ApiError } from '@/layers/infrastructure/http/http-client'
import { createMessage } from '@/layers/infrastructure/messages/messages-api'

export class ContactValidationError extends Error {
  constructor(readonly fieldErrors: ContactFieldErrors) {
    super('Форма заполнена с ошибками')
    this.name = 'ContactValidationError'
  }
}

/**
 * Отправка формы обратной связи: сначала проверка в браузере (без лишнего запроса),
 * затем отправка. Ошибки проверки от сервера приводятся к тому же виду.
 */
export async function sendContactMessage(input: ContactFormInput): Promise<Message> {
  const validation = validateContactForm(input)
  if (!validation.success) throw new ContactValidationError(validation.fieldErrors)

  try {
    return await createMessage(validation.data)
  } catch (error) {
    if (error instanceof ApiError && error.status === 400 && error.fieldErrors) {
      throw new ContactValidationError(error.fieldErrors)
    }
    throw error
  }
}
