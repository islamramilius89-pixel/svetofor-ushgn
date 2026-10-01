import { formatNumber } from '@/common/format'
import { Card } from '@/common/ui/Card'
import { ProgressBar } from '@/common/ui/ProgressBar'
import type { FaultGroupId } from '@/layers/domain/monitoring/monitoring'
import type { MonitoringOverview } from '@/layers/use-cases/monitoring/get-monitoring-overview'

const roadmap = [
  {
    title: 'Сентябрь: Корректировка эталонов',
    text: 'Ручная корректировка ~1100 скважин для снижения ложных срабатываний',
    badgeClassName: 'bg-red-600',
  },
  {
    title: 'Октябрь: Разделение сигналов',
    text: 'Классификация отклонений по типам неисправностей',
    badgeClassName: 'bg-yellow-600',
  },
  {
    title: 'Далее: ML и оптимизация',
    text: 'Применение машинного обучения для автоматической классификации',
    badgeClassName: 'bg-green-600',
  },
]

const statColors: Record<FaultGroupId, string> = {
  'surface-drive': 'border-blue-600 text-blue-600',
  downhole: 'border-purple-600 text-purple-600',
}

export function ResultsScreen({ overview }: { overview: MonitoringOverview }) {
  const { completeness } = overview

  const findings = [
    {
      title: 'Охват фонда',
      text: `${formatNumber(overview.wellsWithDeviations)} из ${formatNumber(overview.totalWells)} скважин (${overview.deviationShare}%) имели отклонения, выявленные системой`,
      className: 'bg-blue-50 border-blue-600',
      titleClassName: 'text-blue-900',
    },
    {
      title: 'Ложные срабатывания',
      text: `${overview.falsePositiveRate}% эпизодов не подтвердились при физической проверке`,
      className: 'bg-yellow-50 border-yellow-600',
      titleClassName: 'text-yellow-900',
    },
    {
      title: 'Эффективность',
      text: `Рост полноты обнаружения с ${completeness.before}% до ${completeness.current}% после корректировки эталонов. До цели осталось ${overview.completenessGap}%`,
      className: 'bg-green-50 border-green-600',
      titleClassName: 'text-green-900',
    },
  ]

  return (
    <>
      <Card title="Прогресс полноты обнаружения">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span>Текущая полнота</span>
              <span className="font-bold">{completeness.current}%</span>
            </div>
            <ProgressBar value={completeness.current} label="Текущая полнота" barClassName="bg-yellow-500" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span>Целевая полнота</span>
              <span className="font-bold">≥ {completeness.target}%</span>
            </div>
            <ProgressBar value={completeness.target} label="Целевая полнота" barClassName="bg-green-600" />
          </div>
        </div>
      </Card>

      <Card title="Статистика обходов">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {overview.faultSummaries.map((group) => (
            <div key={group.id} className={`border-l-4 pl-4 ${statColors[group.id]}`}>
              <h3 className="font-bold text-gray-700">{group.title}</h3>
              <p className="text-3xl font-bold mt-2">{group.downtimeCount}</p>
              <p className="text-gray-600">выявленных простоев</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Ключевые находки">
        <div className="space-y-4">
          {findings.map((finding) => (
            <div key={finding.title} className={`p-4 rounded border-l-4 ${finding.className}`}>
              <h3 className={`font-bold ${finding.titleClassName}`}>{finding.title}</h3>
              <p className="text-gray-700">{finding.text}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Дорожная карта развития">
        <ol className="space-y-4">
          {roadmap.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <div
                className={`text-white rounded-full w-10 h-10 flex items-center justify-center shrink-0 font-bold ${step.badgeClassName}`}
              >
                {index + 1}
              </div>
              <div>
                <h3 className="font-bold">{step.title}</h3>
                <p className="text-gray-600">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>
    </>
  )
}
