import { ProgressBar } from '@/common/ui/ProgressBar'
import type { CompletenessProgress } from '@/layers/domain/monitoring/monitoring'

export function CompletenessSection({ progress, gain }: { progress: CompletenessProgress; gain: number }) {
  return (
    <section className="w-full px-6 sm:px-16 md:px-20 bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-gray-800">
          📈 Прогресс полноты обнаружения
        </h2>
        <div className="bg-white p-8 rounded-2xl shadow-xl space-y-8">
          <div>
            <div className="flex justify-between gap-4 mb-3">
              <span className="font-bold text-gray-700 text-lg">Полнота после корректировки эталонов</span>
              <span className="font-bold text-blue-600 text-lg">{progress.current}%</span>
            </div>
            <ProgressBar
              value={progress.current}
              label="Текущая полнота обнаружения"
              sizeClassName="h-6"
              barClassName="bg-gradient-to-r from-yellow-400 to-yellow-500"
            />
            <p className="text-center text-gray-600 mt-3">
              Было: {progress.before}% → Стало: {progress.current}% (+{gain}%)
            </p>
          </div>

          <div>
            <div className="flex justify-between gap-4 mb-3">
              <span className="font-bold text-gray-700 text-lg">Целевой ориентир</span>
              <span className="font-bold text-green-600 text-lg">≥ {progress.target}%</span>
            </div>
            <ProgressBar
              value={progress.target}
              label="Целевая полнота обнаружения"
              sizeClassName="h-6"
              barClassName="bg-gradient-to-r from-green-400 to-green-600"
            />
            <p className="text-center text-gray-600 mt-3">Ожидается достигнуть к {progress.targetDate}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
