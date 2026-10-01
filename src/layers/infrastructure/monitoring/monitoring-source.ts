import type { MonitoringSnapshot } from '@/layers/domain/monitoring/monitoring'

/**
 * Данные опытно-промышленной эксплуатации из презентации проекта.
 * Сейчас это статический источник; при появлении API здесь будет запрос к нему,
 * а остальной код не изменится.
 */
const snapshot: MonitoringSnapshot = {
  totalWells: 2494,
  wellsWithDeviations: 1570,
  falsePositiveRate: 11.4,
  faultGroups: [
    {
      id: 'surface-drive',
      title: 'Наземный привод',
      shortTitle: 'привод',
      detectionTitle: 'Механика привода',
      downtimeCount: 398,
      detectionRate: 78.3,
    },
    {
      id: 'downhole',
      title: 'ГНО и технология',
      shortTitle: 'ГНО',
      detectionTitle: 'Скважинное оборудование',
      downtimeCount: 445,
      detectionRate: 48.1,
    },
  ],
  completeness: {
    before: 61.7,
    current: 63.9,
    target: 90,
    targetDate: 'концу октября 2026',
  },
  ngduCoverage: [
    { name: 'НГДУ №1', percent: 67 },
    { name: 'НГДУ №2', percent: 63 },
    { name: 'НГДУ №3', percent: 69 },
    { name: 'НГДУ №4', percent: 65 },
    { name: 'НГДУ №5', percent: 54 },
    { name: 'НГДУ №6', percent: 62 },
  ],
}

export function loadMonitoringSnapshot(): MonitoringSnapshot {
  return snapshot
}
