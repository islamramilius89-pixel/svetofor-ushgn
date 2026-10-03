'use client'

import Link from 'next/link'
import type { FormEvent } from 'react'
import { formatDateTime } from '@/common/format'
import { Button } from '@/common/ui/Button'
import { Card } from '@/common/ui/Card'
import { FormError, TextAreaField, TextField } from '@/common/ui/FormFields'
import { ErrorState, LoadingState } from '@/common/ui/QueryState'
import { useTicketFlow } from '@/flows/use-ticket-flow'
import {
  TICKET_PRIORITIES,
  TICKET_PRIORITY_LABELS,
  TICKET_STATUSES,
  TICKET_STATUS_LABELS,
  type TicketPriority,
  type TicketStatus,
} from '@/layers/domain/tickets/ticket'
import { WellStatusBadge } from '@/components/wells/WellStatusBadge'

const selectClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-blue-600'

export function TicketDetailsScreen({ id }: { id: number }) {
  const flow = useTicketFlow(id)

  if (flow.isLoading) return <LoadingState text="Загружаем заявку…" />
  if (flow.error || !flow.ticket) return <ErrorState message={flow.error ?? 'Заявка не найдена'} onRetry={flow.retry} />

  const { ticket } = flow

  function handleComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    flow.submitComment()
  }

  return (
    <>
      <div>
        <Link href="/board" className="text-blue-700 hover:underline">
          ← К доске заявок
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold mt-2">{ticket.title}</h1>
        <p className="text-gray-500 mt-1">
          Заявка № {ticket.id} · создана {formatDateTime(ticket.createdAt)}
          {ticket.resolvedAt && ` · закрыта ${formatDateTime(ticket.resolvedAt)}`}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <Card title="Описание">
            <p className="text-gray-700 whitespace-pre-line">{ticket.description || 'Описание не заполнено.'}</p>
          </Card>

          <Card title={`Комментарии (${ticket.comments.length})`}>
            {ticket.comments.length === 0 ? (
              <p className="text-gray-500 mb-6">Комментариев пока нет.</p>
            ) : (
              <ul className="space-y-4 mb-6">
                {ticket.comments.map((comment) => (
                  <li key={comment.id} className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-600">
                    <p className="font-semibold">
                      {comment.author}{' '}
                      <span className="font-normal text-sm text-gray-500">{formatDateTime(comment.createdAt)}</span>
                    </p>
                    <p className="text-gray-700 mt-1 whitespace-pre-line break-words">{comment.text}</p>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={handleComment} noValidate className="space-y-3">
              <TextField
                label="Ваше имя"
                value={flow.comment.author}
                onChange={(event) => flow.setAuthor(event.target.value)}
                error={flow.commentErrors.author}
                hint="Запомним для следующих комментариев"
              />
              <TextAreaField
                label="Комментарий"
                value={flow.comment.text}
                onChange={(event) => flow.setText(event.target.value)}
                error={flow.commentErrors.text}
                rows={3}
              />
              <FormError message={flow.commentError} />
              <Button type="submit" disabled={flow.isCommenting}>
                {flow.isCommenting ? 'Отправляем…' : 'Добавить комментарий'}
              </Button>
            </form>
          </Card>
        </div>

        <Card title="Параметры">
          <div className="space-y-4">
            <div>
              <span className="block text-sm font-semibold text-gray-700 mb-1">Скважина</span>
              <Link href={`/wells/${ticket.well.id}`} className="flex items-center gap-2 text-blue-700 hover:underline">
                № {ticket.well.number} <WellStatusBadge status={ticket.well.status} />
              </Link>
            </div>
            <label className="block">
              <span className="block text-sm font-semibold text-gray-700 mb-1">Статус</span>
              <select
                value={ticket.status}
                onChange={(event) => flow.update({ status: event.target.value as TicketStatus })}
                className={selectClass}
              >
                {TICKET_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {TICKET_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="block text-sm font-semibold text-gray-700 mb-1">Приоритет</span>
              <select
                value={ticket.priority}
                onChange={(event) => flow.update({ priority: event.target.value as TicketPriority })}
                className={selectClass}
              >
                {TICKET_PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {TICKET_PRIORITY_LABELS[priority]}
                  </option>
                ))}
              </select>
            </label>
            <AssigneeEditor
              key={ticket.assignee}
              initial={ticket.assignee}
              onSave={(assignee) => flow.update({ assignee })}
            />
            <FormError message={flow.updateError} />
          </div>
        </Card>
      </div>
    </>
  )
}

/** Поле исполнителя сохраняется по кнопке или Enter, а не на каждую букву. */
function AssigneeEditor({ initial, onSave }: { initial: string; onSave: (value: string) => void }) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const value = String(new FormData(event.currentTarget).get('assignee') ?? '').trim()
        if (value !== initial) onSave(value)
      }}
    >
      <label className="block">
        <span className="block text-sm font-semibold text-gray-700 mb-1">Исполнитель</span>
        <div className="flex gap-2">
          <input name="assignee" defaultValue={initial} maxLength={60} placeholder="Не назначен" className={selectClass} />
          <Button type="submit" variant="secondary" size="sm">
            OK
          </Button>
        </div>
      </label>
    </form>
  )
}
