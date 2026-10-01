export type FaultGroupId = 'surface-drive' | 'downhole'

export type FaultGroup = {
  id: FaultGroupId
  /** Название группы простоев, например «Наземный привод». */
  title: string
  /** Короткое название для подписей. */
  shortTitle: string
  /** Как группа называется в оценке качества обнаружения. */
  detectionTitle: string
  /** Сколько простоев этого типа выявлено. */
  downtimeCount: number
  /** Какая доля неисправностей этого типа обнаруживается системой, %. */
  detectionRate: number
}

export type CompletenessProgress = {
  /** Полнота обнаружения до корректировки эталонов, %. */
  before: number
  /** Текущая полнота обнаружения, %. */
  current: number
  /** Целевая полнота, %. */
  target: number
  /** Когда планируется достичь цели. */
  targetDate: string
}

export type NgduCoverage = {
  name: string
  percent: number
}

export type MonitoringSnapshot = {
  totalWells: number
  wellsWithDeviations: number
  /** Доля эпизодов, не подтвердившихся при физической проверке, %. */
  falsePositiveRate: number
  faultGroups: FaultGroup[]
  completeness: CompletenessProgress
  ngduCoverage: NgduCoverage[]
}

export type DetectionQuality = 'good' | 'needs-work'

/** Порог, начиная с которого обнаружение считается хорошим, %. */
export const GOOD_DETECTION_THRESHOLD = 70

export function roundTo(value: number, digits = 1): number {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

export function percentOf(part: number, total: number): number {
  if (total <= 0) return 0
  return Math.round((part / total) * 100)
}

export function totalDowntime(groups: FaultGroup[]): number {
  return groups.reduce((sum, group) => sum + group.downtimeCount, 0)
}

export function completenessGain(progress: CompletenessProgress): number {
  return roundTo(progress.current - progress.before)
}

export function completenessGap(progress: CompletenessProgress): number {
  return Math.max(0, roundTo(progress.target - progress.current))
}

export function detectionQuality(rate: number): DetectionQuality {
  return rate >= GOOD_DETECTION_THRESHOLD ? 'good' : 'needs-work'
}

export function coverageRange(items: NgduCoverage[]): { min: number; max: number } {
  const percents = items.map((item) => item.percent)
  return { min: Math.min(...percents), max: Math.max(...percents) }
}
