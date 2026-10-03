import { Button } from './Button'

type PaginationProps = { page: number; pageSize: number; total: number; onChange: (page: number) => void }

export function Pagination({ page, pageSize, total, onChange }: PaginationProps) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  if (pages <= 1) return null

  return (
    <nav className="flex items-center justify-center gap-3" aria-label="Страницы">
      <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        ← Назад
      </Button>
      <span className="text-gray-600">
        Страница {page} из {pages}
      </span>
      <Button variant="secondary" size="sm" disabled={page >= pages} onClick={() => onChange(page + 1)}>
        Вперёд →
      </Button>
    </nav>
  )
}
