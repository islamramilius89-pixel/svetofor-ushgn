import type { Metadata } from 'next'
import { PageShell } from '@/common/ui/PageShell'
import { BoardScreen } from '@/components/board/BoardScreen'
import { boardFiltersSchema } from '@/layers/domain/tickets/ticket'

export const metadata: Metadata = { title: 'Доска заявок' }

export default async function BoardPage({ searchParams }: PageProps<'/board'>) {
  const params = await searchParams
  const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)
  const filters = boardFiltersSchema.parse({ search: first(params.search) ?? '', priority: first(params.priority) })

  return (
    <PageShell title="Доска заявок">
      <BoardScreen filters={filters} />
    </PageShell>
  )
}
