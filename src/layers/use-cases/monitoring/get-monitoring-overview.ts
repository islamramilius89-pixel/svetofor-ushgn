import {
  completenessGain,
  completenessGap,
  coverageRange,
  detectionQuality,
  percentOf,
  totalDowntime,
  type DetectionQuality,
  type FaultGroup,
  type MonitoringSnapshot,
} from '@/layers/domain/monitoring/monitoring'
import { loadMonitoringSnapshot } from '@/layers/infrastructure/monitoring/monitoring-source'

export type FaultGroupSummary = FaultGroup & {
  /** Доля группы среди всех простоев, %. */
  share: number
  quality: DetectionQuality
}

export type MonitoringOverview = MonitoringSnapshot & {
  deviationShare: number
  totalDowntime: number
  faultSummaries: FaultGroupSummary[]
  completenessGain: number
  completenessGap: number
  coverageRange: { min: number; max: number }
}

/** Собирает данные мониторинга и рассчитывает показатели, которые выводят страницы. */
export function getMonitoringOverview(): MonitoringOverview {
  const snapshot = loadMonitoringSnapshot()
  const downtime = totalDowntime(snapshot.faultGroups)

  return {
    ...snapshot,
    deviationShare: percentOf(snapshot.wellsWithDeviations, snapshot.totalWells),
    totalDowntime: downtime,
    faultSummaries: snapshot.faultGroups.map((group) => ({
      ...group,
      share: percentOf(group.downtimeCount, downtime),
      quality: detectionQuality(group.detectionRate),
    })),
    completenessGain: completenessGain(snapshot.completeness),
    completenessGap: completenessGap(snapshot.completeness),
    coverageRange: coverageRange(snapshot.ngduCoverage),
  }
}
