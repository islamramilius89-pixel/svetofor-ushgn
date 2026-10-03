import { useState } from 'react'
import { useAddCommentMutation, useTicketQuery, useUpdateTicketMutation } from '@/interactions/tickets'
import type { TicketPatch } from '@/layers/domain/tickets/ticket'
import { fieldErrorsOf, generalErrorOf } from '@/layers/use-cases/forms/submit-form'
import { usePreferencesStore } from '@/stores/preferences-store'

/** Страница заявки: данные, смена статуса/приоритета/исполнителя и комментарии. */
export function useTicketFlow(id: number) {
  const ticketQuery = useTicketQuery(id)
  const updateMutation = useUpdateTicketMutation()
  const commentMutation = useAddCommentMutation(id)

  const savedAuthor = usePreferencesStore((state) => state.authorName)
  const saveAuthor = usePreferencesStore((state) => state.setAuthorName)
  // Пока пользователь не менял поле «Имя», подставляем сохранённое имя.
  const [authorDraft, setAuthorDraft] = useState<string | null>(null)
  const [text, setText] = useState('')
  const author = authorDraft ?? savedAuthor

  function submitComment() {
    commentMutation.mutate(
      { author, text },
      {
        onSuccess: () => {
          setText('')
          saveAuthor(author.trim())
        },
      },
    )
  }

  return {
    ticket: ticketQuery.data,
    isLoading: ticketQuery.isPending,
    error: ticketQuery.error?.message ?? null,
    retry: () => void ticketQuery.refetch(),

    update: (patch: TicketPatch) => updateMutation.mutate({ id, patch }),
    updateError: updateMutation.error?.message ?? null,

    comment: { author, text },
    setAuthor: (value: string) => {
      setAuthorDraft(value)
      if (commentMutation.isError) commentMutation.reset()
    },
    setText: (value: string) => {
      setText(value)
      if (commentMutation.isError) commentMutation.reset()
    },
    submitComment,
    isCommenting: commentMutation.isPending,
    commentErrors: fieldErrorsOf(commentMutation.error),
    commentError: generalErrorOf(commentMutation.error),
  }
}
