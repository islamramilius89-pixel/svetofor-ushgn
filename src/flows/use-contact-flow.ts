import { useState } from 'react'
import type { ContactFormField, ContactFormInput } from '@/layers/domain/messages/message'
import {
  useClearMessagesMutation,
  useDeleteMessageMutation,
  useMessagesQuery,
  useSendMessageMutation,
} from '@/interactions/messages'
import { ContactValidationError } from '@/layers/use-cases/messages/send-contact-message'

const EMPTY_FORM: ContactFormInput = { name: '', email: '', text: '' }

/** Экран контактов: форма, список сообщений и действия над ним. */
export function useContactFlow() {
  const [form, setForm] = useState<ContactFormInput>(EMPTY_FORM)

  const messagesQuery = useMessagesQuery()
  const sendMutation = useSendMessageMutation()
  const deleteMutation = useDeleteMessageMutation()
  const clearMutation = useClearMessagesMutation()

  const validationError =
    sendMutation.error instanceof ContactValidationError ? sendMutation.error : null

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
    fieldErrors: validationError?.fieldErrors ?? {},
    sendError: sendMutation.error && !validationError ? sendMutation.error.message : null,
    isSending: sendMutation.isPending,
    isSent: sendMutation.isSuccess,

    messages: messagesQuery.data ?? [],
    isLoadingMessages: messagesQuery.isPending,
    messagesError: messagesQuery.error?.message ?? null,
    retryMessages: () => void messagesQuery.refetch(),

    removeMessage: (id: string) => deleteMutation.mutate(id),
    removingId: deleteMutation.isPending ? deleteMutation.variables : undefined,
    clearMessages: () => clearMutation.mutate(),
    isClearing: clearMutation.isPending,
    actionError: deleteMutation.error?.message ?? clearMutation.error?.message ?? null,
  }
}

export type ContactFlow = ReturnType<typeof useContactFlow>
