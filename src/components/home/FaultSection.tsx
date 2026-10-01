import { ProgressBar } from '@/common/ui/ProgressBar'
import type { DetectionQuality, FaultGroupId } from '@/layers/domain/monitoring/monitoring'
import type { FaultGroupSummary } from '@/layers/use-cases/monitoring/get-monitoring-overview'

const groupColors: Record<FaultGroupId, { text: string; bar: string }> = {
  'surface-drive': { text: 'text-blue-600', bar: 'bg-blue-600' },
  downhole: { text: 'text-purple-600', bar: 'bg-purple-600' },
}

const qualityStyles: Record<DetectionQuality, { card: string; title: string; value: string; caption: string }> = {
  good: {
    card: 'from-blue-50 to-blue-100 border-blue-600',
    title: 'text-blue-800',
    value: 'text-blue-600',
    caption: 'Хорошо обнаруживается',
  },
  'needs-work': {
    card: 'from-orange-50 to-orange-100 border-orange-600',
    title: 'text-orange-800',
    value: 'text-orange-600',
    caption: 'Требует доработки',
  },
}

export function FaultSection({ summaries }: { summaries: FaultGroupSummary[] }) {
  return (
    <section className="w-full px-6 sm:px-16 md:px-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-gray-800">
          🔧 Типы выявленных неисправностей
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-bold mb-8 text-center text-gray-800">Распределение по типам</h3>
            <div className="space-y-6">
              {summaries.map((group) => (
                <div key={group.id} className="flex flex-col items-center">
                  <span className={`font-bold mb-2 text-lg ${groupColors[group.id].text}`}>{group.title}</span>
                  <ProgressBar value={group.share} label={group.title} barClassName={groupColors[group.id].bar} />
                  <span className="font-bold text-gray-800 mt-2">
                    {group.downtimeCount} ({group.share}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-bold mb-8 text-center text-gray-800">Эффективность по типам</h3>
            <div className="space-y-4">
              {summaries.map((group) => {
                const style = qualityStyles[group.quality]
                return (
                  <div
                    key={group.id}
                    className={`p-6 bg-gradient-to-r rounded-lg border-l-4 text-center ${style.card}`}
                  >
                    <p className={`font-bold mb-2 ${style.title}`}>{group.detectionTitle}</p>
                    <p className={`text-3xl font-bold ${style.value}`}>{group.detectionRate}%</p>
                    <p className="text-sm text-gray-700 mt-2">{style.caption}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
