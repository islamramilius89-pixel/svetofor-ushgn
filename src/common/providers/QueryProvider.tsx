'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { StoreHydrator } from './StoreHydrator'

export function QueryProvider({ children }: { children: ReactNode }) {
  // Клиент создаётся один раз на вкладку и не делится между пользователями на сервере.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: 1 },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <StoreHydrator />
      {children}
    </QueryClientProvider>
  )
}
