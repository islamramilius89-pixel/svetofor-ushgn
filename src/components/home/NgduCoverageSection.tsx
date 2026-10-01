import type { NgduCoverage } from '@/layers/domain/monitoring/monitoring'

type NgduCoverageSectionProps = {
  items: NgduCoverage[]
  range: { min: number; max: number }
}

export function NgduCoverageSection({ items, range }: NgduCoverageSectionProps) {
  return (
    <section className="w-full px-6 sm:px-16 md:px-20 bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-gray-800">🗺️ Охват по НГДУ (%)</h2>
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {items.map((item) => (
              <div
                key={item.name}
                className="flex flex-col items-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg"
              >
                <p className="font-bold text-gray-800 mb-4 text-lg">{item.name}</p>
                <div
                  className="w-20 h-40 bg-gray-300 rounded-lg flex items-end overflow-hidden"
                  role="img"
                  aria-label={`${item.name}: ${item.percent}%`}
                >
                  <div
                    className="w-full rounded-lg bg-gradient-to-t from-blue-500 to-blue-400"
                    style={{ height: `${item.percent}%` }}
                  />
                </div>
                <div className="mt-3 font-bold text-2xl text-gray-800">{item.percent}%</div>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-8 text-base">
            Разброс небольшой ({range.min}–{range.max}%), дело не в конкретном цехе, а в самом пороге
          </p>
        </div>
      </div>
    </section>
  )
}
