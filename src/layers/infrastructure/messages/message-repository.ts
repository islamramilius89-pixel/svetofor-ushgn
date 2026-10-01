import type { ContactForm, Message } from '@/layers/domain/messages/message'

/**
 * Серверное хранилище сообщений в памяти процесса: данные живут, пока запущен сервер,
 * и переживают обновление страницы. В реальном проекте здесь была бы база данных.
 * Массив лежит в globalThis, чтобы не сбрасываться при горячей перезагрузке в режиме разработки.
 */
const storage = globalThis as typeof globalThis & { __svetoforMessages?: Message[] }

function messages(): Message[] {
  storage.__svetoforMessages ??= []
  return storage.__svetoforMessages
}

export const messageRepository = {
  list(): Message[] {
    return [...messages()]
  },

  add(form: ContactForm): Message {
    const message: Message = {
      id: crypto.randomUUID(),
      ...form,
      createdAt: new Date().toISOString(),
    }
    messages().push(message)
    return message
  },

  remove(id: string): boolean {
    const list = messages()
    const index = list.findIndex((message) => message.id === id)
    if (index === -1) return false
    list.splice(index, 1)
    return true
  },

  clear(): void {
    messages().length = 0
  },
}
