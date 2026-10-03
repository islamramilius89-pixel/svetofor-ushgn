import type { Metadata } from 'next'
import { PageShell } from '@/common/ui/PageShell'
import { WellsScreen } from '@/components/wells/WellsScreen'
import { parseWellFilters } from '@/layers/domain/wells/well-filters'

export const metadata: Metadata = { title: 'Скважины' }

export default async function WellsPage({ searchParams }: PageProps<'/wells'>) {
  // Фильтры читаются из адреса на сервере и передаются экрану готовым объектом.
  const filters = parseWellFilters(await searchParams)
  return (
    <PageShell title="Скважины">
      <WellsScreen filters={filters} />
    </PageShell>
  )
}
