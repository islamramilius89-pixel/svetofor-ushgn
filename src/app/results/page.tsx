import type { Metadata } from 'next'
import { PageShell } from '@/common/ui/PageShell'
import { ResultsScreen } from '@/components/results/ResultsScreen'
import { getMonitoringOverview } from '@/layers/use-cases/monitoring/get-monitoring-overview'

export const metadata: Metadata = { title: 'Результаты ОПИ' }

export default function ResultsPage() {
  return (
    <PageShell title="Результаты ОПИ">
      <ResultsScreen overview={getMonitoringOverview()} />
    </PageShell>
  )
}
