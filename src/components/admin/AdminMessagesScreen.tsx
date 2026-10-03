'use client'

import { useState } from 'react'
import { formatDateTime } from '@/common/format'
import { Button } from '@/common/ui/Button'
import { Card } from '@/common/ui/Card'
import { EmptyState, ErrorState, LoadingState } from '@/common/ui/QueryState'
import { useClearMessagesMutation, useDeleteMessageMutation, useMessagesQuery } from '@/interactions/messages'

export function AdminMessagesScreen() {
  const messagesQuery = useMessagesQuery()
  const deleteMutation = useDeleteMessageMutation()
  const clearMutation = useClearMessagesMutation()
  const [confirmClear, setConfirmClear] = useState(false)

  if (messagesQuery.isPending) return <LoadingState text="Загружаем сообщения…" />
  if (messagesQuery.error) {
    return <ErrorState message={messagesQuery.error.message} onRetry={() => void messagesQuery.refetch()} />
  }

  const messages = messagesQuery.data
  const actionError = deleteMutation.error?.message ?? clearMutation.error?.message

  return (
    <Card title={`Сообщения с формы обратной связи (${messages.length})`}>
      {messages.length === 0 ? (
        <EmptyState>Новых сообщений нет.</EmptyState>
      ) : (
        <>
          <ul className="space-y-4">
            {messages.map((message) => (
              <li key={message.id} className="bg-gray-50 p-4 rounded border-l-4 border-blue-600">
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <p className="font-bold text-gray-800">
                      {message.name}{' '}
                      <a href={`mailto:${message.email}`} className="font-normal text-blue-700 hover:underline">
                        {message.email}
                      </a>
                    </p>
                    <p className="text-gray-700 mt-1 whitespace-pre-line break-words">{message.text}</p>
                    <p className="text-sm text-gray-500 mt-2">{formatDateTime(message.createdAt)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(message.id)}
                    disabled={deleteMutation.isPending && deleteMutation.variables === message.id}
                    aria-label={`Удалить сообщение от ${message.name}`}
                    className="text-red-600 hover:text-red-800 font-bold disabled:opacity-50"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {actionError && (
            <p role="alert" className="text-red-600 mt-4">
              {actionError}
            </p>
          )}
          <div className="mt-6">
            {confirmClear ? (
              <span className="inline-flex items-center gap-2">
                <span className="text-red-700">Удалить все {messages.length} сообщ.?</span>
                <Button
                  variant="danger"
                  size="sm"
                  disabled={clearMutation.isPending}
                  onClick={() => clearMutation.mutate(undefined, { onSuccess: () => setConfirmClear(false) })}
                >
                  Да, удалить
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setConfirmClear(false)}>
                  Отмена
                </Button>
              </span>
            ) : (
              <Button variant="danger" onClick={() => setConfirmClear(true)}>
                Очистить все сообщения
              </Button>
            )}
          </div>
        </>
      )}
    </Card>
  )
}
