import { formatDateTime } from '@/common/format'
import { Card } from '@/common/ui/Card'
import type { ContactFlow } from '@/flows/use-contact-flow'

export function MessageList({ flow }: { flow: ContactFlow }) {
  const title = flow.messages.length > 0 ? `Полученные сообщения (${flow.messages.length})` : 'Полученные сообщения'

  return (
    <Card title={title}>
      <MessageListBody flow={flow} />
    </Card>
  )
}

function MessageListBody({ flow }: { flow: ContactFlow }) {
  if (flow.isLoadingMessages) {
    return <p className="text-gray-500">Загружаем сообщения…</p>
  }

  if (flow.messagesError) {
    return (
      <div role="alert" className="space-y-3">
        <p className="text-red-600">Не удалось загрузить сообщения: {flow.messagesError}</p>
        <button
          type="button"
          onClick={flow.retryMessages}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Повторить
        </button>
      </div>
    )
  }

  if (flow.messages.length === 0) {
    return <p className="text-gray-500">Пока нет сообщений. Отправьте первое через форму выше.</p>
  }

  return (
    <>
      <ul className="space-y-4">
        {flow.messages.map((message) => (
          <li key={message.id} className="bg-gray-50 p-4 rounded border-l-4 border-blue-600">
            <div className="flex justify-between items-start gap-4">
              <div className="min-w-0">
                <p className="font-bold text-gray-800">
                  {message.name} <span className="font-normal text-gray-500">({message.email})</span>
                </p>
                <p className="text-gray-700 mt-1 whitespace-pre-line break-words">{message.text}</p>
                <p className="text-sm text-gray-500 mt-2">{formatDateTime(message.createdAt)}</p>
              </div>
              <button
                type="button"
                onClick={() => flow.removeMessage(message.id)}
                disabled={flow.removingId === message.id}
                aria-label={`Удалить сообщение от ${message.name}`}
                className="text-red-600 hover:text-red-800 font-bold disabled:opacity-50"
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>

      {flow.actionError && (
        <p role="alert" className="text-red-600 mt-4">
          {flow.actionError}
        </p>
      )}

      <button
        type="button"
        onClick={flow.clearMessages}
        disabled={flow.isClearing}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition disabled:opacity-60"
      >
        Очистить все сообщения
      </button>
    </>
  )
}
