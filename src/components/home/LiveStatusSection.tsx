import Link from 'next/link'
import type { Stats } from '@/layers/domain/stats/stats'
import { WELL_STATUSES, WELL_STATUS_LABELS } from '@/layers/domain/wells/well'
import { wellStatusStyles } from '@/components/wells/WellStatusBadge'

/** Живые данные из базы: сколько скважин каждого цвета и сколько заявок в работе. */
export function LiveStatusSection({ stats }: { stats: Stats | null }) {
  return (
    <section className="w-full px-6 sm:px-16 md:px-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center text-gray-800">🚦 Светофор сейчас</h2>
        <p className="text-center text-gray-600 mb-10">Данные из базы приложения — меняются вместе с работой на доске заявок</p>
        {stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WELL_STATUSES.map((status) => (
              <Link
                key={status}
                href={`/wells?status=${status}`}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition text-center"
              >
                <span className={`inline-block h-6 w-6 rounded-full mb-3 ${wellStatusStyles[status].dot}`} aria-hidden="true" />
                <div className="text-4xl font-bold tabular-nums">{stats.wells.byStatus[status]}</div>
                <p className="text-gray-600 mt-1">{WELL_STATUS_LABELS[status]}</p>
              </Link>
            ))}
            <Link href="/board" className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg hover:bg-blue-700 transition text-center">
              <div className="text-4xl font-bold tabular-nums mt-9">
                {stats.tickets.byStatus.NEW + stats.tickets.byStatus.IN_PROGRESS}
              </div>
              <p className="opacity-90 mt-1">открытых заявок →</p>
            </Link>
          </div>
        ) : (
          <p className="text-center text-gray-500 bg-white rounded-2xl shadow p-8">
            Сервер API недоступен. Запустите бэкенд, чтобы увидеть текущее состояние скважин.
          </p>
        )}
      </div>
    </section>
  )
}
