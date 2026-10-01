import { formatNumber } from '@/common/format'
import type { MonitoringOverview } from '@/layers/use-cases/monitoring/get-monitoring-overview'

type Metric = {
  value: string
  label: string
  note: string
  cardClassName: string
  valueClassName: string
}

export function MetricCards({ overview }: { overview: MonitoringOverview }) {
  const metrics: Metric[] = [
    {
      value: formatNumber(overview.totalWells),
      label: 'скважин в мониторинге',
      note: '📍 Все НГДУ Татнефти',
      cardClassName: 'from-blue-50 to-blue-100 border-blue-600',
      valueClassName: 'text-blue-600',
    },
    {
      value: formatNumber(overview.wellsWithDeviations),
      label: 'выявлено отклонений',
      note: `${overview.deviationShare}% от общего фонда`,
      cardClassName: 'from-yellow-50 to-yellow-100 border-yellow-500',
      valueClassName: 'text-yellow-600',
    },
    {
      value: formatNumber(overview.totalDowntime),
      label: 'простоев обнаружено',
      note: overview.faultSummaries.map((group) => `${group.downtimeCount} ${group.shortTitle}`).join(' + '),
      cardClassName: 'from-red-50 to-red-100 border-red-600',
      valueClassName: 'text-red-600',
    },
    {
      value: `${overview.completeness.current}%`,
      label: 'текущая полнота',
      note: `Цель: ≥ ${overview.completeness.target}%`,
      cardClassName: 'from-green-50 to-green-100 border-green-600',
      valueClassName: 'text-green-600',
    },
  ]

  return (
    <section className="w-full px-6 sm:px-16 md:px-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-gray-800">📊 Ключевые метрики</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className={`bg-gradient-to-br p-8 rounded-2xl shadow-xl hover:shadow-2xl transition border-l-4 hover:scale-105 duration-300 text-center ${metric.cardClassName}`}
            >
              <div className={`text-5xl font-bold mb-2 ${metric.valueClassName}`}>{metric.value}</div>
              <p className="text-gray-700 font-medium">{metric.label}</p>
              <p className="text-sm text-gray-600 mt-2">{metric.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
