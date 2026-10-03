import { useState } from 'react'
import { useCreateTicketMutation } from '@/interactions/tickets'
import { useWellsQuery } from '@/interactions/wells'
import type { Ticket, TicketFormInput } from '@/layers/domain/tickets/ticket'
import { fieldErrorsOf, generalErrorOf } from '@/layers/use-cases/forms/submit-form'

type Options = {
  /** Если заявка создаётся со страницы скважины — скважина уже выбрана. */
  wellId?: number
  onCreated?: (ticket: Ticket) => void
}

const emptyForm = (wellId?: number): TicketFormInput => ({
  wellId: wellId ?? '',
  title: '',
  description: '',
  priority: 'MEDIUM',
  assignee: '',
})

export function useCreateTicketFlow({ wellId, onCreated }: Options = {}) {
  const [form, setForm] = useState<TicketFormInput>(() => emptyForm(wellId))
  const mutation = useCreateTicketMutation()
  // Список скважин для выбора нужен, только если скважина не задана заранее.
  const wellsQuery = useWellsQuery({ sort: 'deviation', pageSize: 100 }, { enabled: wellId === undefined })

  function updateField<K extends keyof TicketFormInput>(field: K, value: TicketFormInput[K]) {
    setForm((current) => ({ ...current, [field]: value }))
    if (mutation.isError) mutation.reset()
  }

  function submit() {
    mutation.mutate(form, {
      onSuccess: (ticket) => {
        setForm(emptyForm(wellId))
        onCreated?.(ticket)
      },
    })
  }

  return {
    form,
    updateField,
    submit,
    isSaving: mutation.isPending,
    fieldErrors: fieldErrorsOf(mutation.error),
    error: generalErrorOf(mutation.error),
    wellOptions: wellsQuery.data?.items ?? [],
    wellFixed: wellId !== undefined,
  }
}

export type CreateTicketFlow = ReturnType<typeof useCreateTicketFlow>
