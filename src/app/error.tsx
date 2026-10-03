'use client'

import { PageShell } from '@/common/ui/PageShell'
import { Button } from '@/common/ui/Button'

/** Показывается, если страница не смогла загрузиться — например, сервер API выключен. */
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <PageShell title="Не удалось загрузить страницу">
      <p className="text-gray-700">Возможно, сервер API недоступен. Проверьте, что бэкенд запущен, и попробуйте ещё раз.</p>
      <Button onClick={reset}>Попробовать снова</Button>
    </PageShell>
  )
}
