import { contactFormSchema, type ContactFormInput } from '@/layers/domain/messages/message'
import { createMessage } from '@/layers/infrastructure/messages/messages-api'
import { submitForm } from '@/layers/use-cases/forms/submit-form'

export function sendContactMessage(input: ContactFormInput) {
  return submitForm(contactFormSchema, input, createMessage)
}
