import type { ReactNode } from 'react'
import { Button } from './Button'

export function LoadingState({ text = 'Загружаем…' }: { text?: string }) {
  return (
    <p role="status" className="text-gray-500 py-6 text-center">
      {text}
    </p>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="py-6 text-center space-y-3">
      <p className="text-red-600">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Повторить
        </Button>
      )}
    </div>
  )
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="py-8 text-center text-gray-500">{children}</div>
}
