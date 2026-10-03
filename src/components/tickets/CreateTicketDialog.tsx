'use client'

import type { FormEvent } from 'react'
import { Button } from '@/common/ui/Button'
import { Dialog } from '@/common/ui/Dialog'
import { FormError, SelectField, TextAreaField, TextField } from '@/common/ui/FormFields'
import { useCreateTicketFlow } from '@/flows/use-create-ticket-flow'
import { TICKET_PRIORITIES, TICKET_PRIORITY_LABELS, type TicketPriority } from '@/layers/domain/tickets/ticket'
import { WELL_STATUS_LABELS } from '@/layers/domain/wells/well'

type CreateTicketDialogProps = { open: boolean; onClose: () => void; wellId?: number }

export function CreateTicketDialog({ open, onClose, wellId }: CreateTicketDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} title="Новая заявка на проверку">
      {/* Форма монтируется заново при каждом открытии — поля всегда чистые. */}
      <CreateTicketForm wellId={wellId} onDone={onClose} />
    </Dialog>
  )
}

function CreateTicketForm({ wellId, onDone }: { wellId?: number; onDone: () => void }) {
  const flow = useCreateTicketFlow({ wellId, onCreated: onDone })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    flow.submit()
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {!flow.wellFixed && (
        <SelectField
          label="Скважина"
          value={flow.form.wellId}
          onChange={(event) => flow.updateField('wellId', event.target.value)}
          error={flow.fieldErrors.wellId}
          options={[
            { value: '', label: 'Выберите скважину' },
            ...flow.wellOptions.map((well) => ({
              value: well.id,
              label: `№ ${well.number} — ${WELL_STATUS_LABELS[well.status].toLowerCase()}, ${well.deviation}%`,
            })),
          ]}
        />
      )}
      <TextField
        label="Что нужно сделать"
        value={flow.form.title}
        onChange={(event) => flow.updateField('title', event.target.value)}
        error={flow.fieldErrors.title}
        placeholder="Например, проверить балансировку станка-качалки"
        autoFocus
      />
      <TextAreaField
        label="Описание"
        value={flow.form.description}
        onChange={(event) => flow.updateField('description', event.target.value)}
        error={flow.fieldErrors.description}
        rows={3}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Приоритет"
          value={flow.form.priority}
          onChange={(event) => flow.updateField('priority', event.target.value as TicketPriority)}
          error={flow.fieldErrors.priority}
          options={TICKET_PRIORITIES.map((priority) => ({ value: priority, label: TICKET_PRIORITY_LABELS[priority] }))}
        />
        <TextField
          label="Исполнитель"
          value={flow.form.assignee}
          onChange={(event) => flow.updateField('assignee', event.target.value)}
          error={flow.fieldErrors.assignee}
          placeholder="Можно оставить пустым"
        />
      </div>
      <FormError message={flow.error} />
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onDone}>
          Отмена
        </Button>
        <Button type="submit" disabled={flow.isSaving}>
          {flow.isSaving ? 'Создаём…' : 'Создать заявку'}
        </Button>
      </div>
    </form>
  )
}
