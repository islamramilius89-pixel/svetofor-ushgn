import type { Stats } from '@/layers/domain/stats/stats'
import type { MonitoringOverview } from '@/layers/use-cases/monitoring/get-monitoring-overview'
import { CallToActionSection } from './CallToActionSection'
import { CompletenessSection } from './CompletenessSection'
import { FaultSection } from './FaultSection'
import { FeaturesSection } from './FeaturesSection'
import { HeroSection } from './HeroSection'
import { LiveStatusSection } from './LiveStatusSection'
import { MetricCards } from './MetricCards'
import { NgduCoverageSection } from './NgduCoverageSection'

export function HomeScreen({ overview, stats }: { overview: MonitoringOverview; stats: Stats | null }) {
  return (
    <div className="w-full space-y-16 pb-16">
      <HeroSection />
      <LiveStatusSection stats={stats} />
      <MetricCards overview={overview} />
      <CompletenessSection progress={overview.completeness} gain={overview.completenessGain} />
      <FaultSection summaries={overview.faultSummaries} />
      <NgduCoverageSection items={overview.ngduCoverage} range={overview.coverageRange} />
      <FeaturesSection />
      <CallToActionSection />
    </div>
  )
}
