import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Message } from '@/layers/domain/messages/message'
import {
  deleteAllMessages,
  deleteMessage,
  fetchMessages,
} from '@/layers/infrastructure/messages/messages-api'
import { sendContactMessage } from '@/layers/use-cases/messages/send-contact-message'

export const messageKeys = {
  list: ['messages', 'list'] as const,
}

export function useMessagesQuery() {
  return useQuery({
    queryKey: messageKeys.list,
    queryFn: fetchMessages,
  })
}

export function useSendMessageMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: sendContactMessage,
    // Добавляем ответ сервера в кеш вместо повторной загрузки всего списка.
    onSuccess: (message) => {
      queryClient.setQueryData<Message[]>(messageKeys.list, (current = []) => [...current, message])
    },
  })
}

export function useDeleteMessageMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteMessage,
    onSuccess: (_result, id) => {
      queryClient.setQueryData<Message[]>(messageKeys.list, (current = []) =>
        current.filter((message) => message.id !== id),
      )
    },
  })
}

export function useClearMessagesMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteAllMessages,
    onSuccess: () => {
      queryClient.setQueryData<Message[]>(messageKeys.list, [])
    },
  })
}
