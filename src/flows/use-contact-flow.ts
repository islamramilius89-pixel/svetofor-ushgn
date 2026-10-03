import { useState } from 'react'
import { useSendMessageMutation } from '@/interactions/messages'
import type { ContactFormField, ContactFormInput } from '@/layers/domain/messages/message'
import { fieldErrorsOf, generalErrorOf } from '@/layers/use-cases/forms/submit-form'

const EMPTY_FORM: ContactFormInput = { name: '', email: '', text: '' }

/** Форма обратной связи. Сообщения читает только администратор в админ-панели. */
export function useContactFlow() {
  const [form, setForm] = useState<ContactFormInput>(EMPTY_FORM)
  const sendMutation = useSendMessageMutation()

  function updateField(field: ContactFormField, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
    // Пользователь начал исправлять форму: убираем старые ошибки и сообщение об успехе.
    if (!sendMutation.isIdle) sendMutation.reset()
  }

  function submit() {
    sendMutation.mutate(form, { onSuccess: () => setForm(EMPTY_FORM) })
  }

  return {
    form,
    updateField,
    submit,
    fieldErrors: fieldErrorsOf(sendMutation.error),
    sendError: generalErrorOf(sendMutation.error),
    isSending: sendMutation.isPending,
    isSent: sendMutation.isSuccess,
  }
}

export type ContactFlow = ReturnType<typeof useContactFlow>
