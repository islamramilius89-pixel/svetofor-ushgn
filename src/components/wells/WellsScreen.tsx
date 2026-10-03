'use client'

import Link from 'next/link'
import { formatDate } from '@/common/format'
import { Button } from '@/common/ui/Button'
import { Card } from '@/common/ui/Card'
import { Pagination } from '@/common/ui/Pagination'
import { ProgressBar } from '@/common/ui/ProgressBar'
import { EmptyState, ErrorState, LoadingState } from '@/common/ui/QueryState'
import { useWellsFlow } from '@/flows/use-wells-flow'
import { WELL_STATUSES, WELL_STATUS_LABELS } from '@/layers/domain/wells/well'
import { WELL_SORTS, WELL_SORT_LABELS, WELLS_PAGE_SIZE, type WellFilters } from '@/layers/domain/wells/well-filters'
import { FavoriteButton } from './FavoriteButton'
import { StatusLegend } from './StatusLegend'
import { WellStatusBadge, wellStatusStyles } from './WellStatusBadge'

const selectClass = 'px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-blue-600'

export function WellsScreen({ filters }: { filters: WellFilters }) {
  const flow = useWellsFlow(filters)

  return (
    <>
      <Card>
        <div className="flex flex-wrap items-end gap-4">
          <label className="flex-1 min-w-48">
            <span className="block text-sm font-semibold text-gray-700 mb-1">Номер скважины</span>
            <input
              key={flow.searchResetKey}
              type="search"
              defaultValue={filters.search}
              onChange={(event) => flow.changeSearch(event.target.value)}
              placeholder="Например, 3532"
              inputMode="numeric"
              className={`${selectClass} w-full`}
            />
          </label>
          <label>
            <span className="block text-sm font-semibold text-gray-700 mb-1">НГДУ</span>
            <select
              value={filters.ngduId ?? ''}
              onChange={(event) => flow.applyFilters({ ngduId: event.target.value ? Number(event.target.value) : undefined })}
              className={selectClass}
            >
              <option value="">Все</option>
              {flow.ngdus.map((ngdu) => (
                <option key={ngdu.id} value={ngdu.id}>
                  {ngdu.name} ({ngdu.wellCount})
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="block text-sm font-semibold text-gray-700 mb-1">Сортировка</span>
            <select
              value={filters.sort}
              onChange={(event) => flow.applyFilters({ sort: event.target.value as WellFilters['sort'] })}
              className={selectClass}
            >
              {WELL_SORTS.map((sort) => (
                <option key={sort} value={sort}>
                  {WELL_SORT_LABELS[sort]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-4" role="group" aria-label="Статус">
          <FilterChip active={!filters.status} onClick={() => flow.applyFilters({ status: undefined })}>
            Все статусы
          </FilterChip>
          {WELL_STATUSES.map((status) => (
            <FilterChip key={status} active={filters.status === status} onClick={() => flow.applyFilters({ status })}>
              <span className={`h-2.5 w-2.5 rounded-full ${wellStatusStyles[status].dot}`} aria-hidden="true" />
              {WELL_STATUS_LABELS[status]}
            </FilterChip>
          ))}
          <FilterChip active={filters.favorites} onClick={() => flow.applyFilters({ favorites: !filters.favorites })}>
            ★ Избранные ({flow.favoriteIds.length})
          </FilterChip>
          <Button variant="ghost" size="sm" onClick={flow.resetFilters}>
            Сбросить
          </Button>
        </div>
      </Card>

      <StatusLegend />

      <Card>
        <WellList flow={flow} />
      </Card>
    </>
  )
}

function WellList({ flow }: { flow: ReturnType<typeof useWellsFlow> }) {
  if (flow.noFavorites) {
    return <EmptyState>В избранном пока пусто. Нажмите ☆ рядом со скважиной, чтобы добавить её.</EmptyState>
  }
  if (flow.isLoading) return <LoadingState text="Загружаем скважины…" />
  if (flow.error) return <ErrorState message={flow.error} onRetry={flow.retry} />
  if (!flow.page || flow.page.items.length === 0) {
    return <EmptyState>По этим фильтрам скважин нет.</EmptyState>
  }

  return (
    <div className={`space-y-4 transition-opacity ${flow.isNavigating ? 'opacity-60' : ''}`}>
      <p className="text-gray-600" aria-live="polite">
        Найдено: {flow.page.total}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-sm text-gray-500 border-b">
            <tr>
              <th className="py-2 pr-2 w-8">
                <span className="sr-only">Избранное</span>
              </th>
              <th className="py-2 pr-4">Скважина</th>
              <th className="py-2 pr-4">Статус</th>
              <th className="py-2 pr-4 min-w-40">Отклонение</th>
              <th className="py-2 pr-4 hidden md:table-cell">Последняя проверка</th>
              <th className="py-2 hidden sm:table-cell">Заявки</th>
            </tr>
          </thead>
          <tbody>
            {flow.page.items.map((well) => (
              <tr key={well.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="py-3 pr-2">
                  <FavoriteButton
                    active={flow.favoriteIds.includes(well.id)}
                    label={`скважину ${well.number}`}
                    onToggle={() => flow.toggleFavorite(well.id)}
                  />
                </td>
                <td className="py-3 pr-4">
                  <Link href={`/wells/${well.id}`} className="font-bold text-blue-700 hover:underline">
                    № {well.number}
                  </Link>
                  <div className="text-sm text-gray-500">{well.ngdu.name}</div>
                </td>
                <td className="py-3 pr-4">
                  <WellStatusBadge status={well.status} />
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <ProgressBar
                      value={Math.min(100, well.deviation * 2)}
                      label={`Отклонение ${well.deviation}%`}
                      barClassName={wellStatusStyles[well.status].bar}
                      sizeClassName="h-2"
                    />
                    <span className="font-semibold tabular-nums w-14 text-right">{well.deviation}%</span>
                  </div>
                </td>
                <td className="py-3 pr-4 hidden md:table-cell text-gray-600">
                  {well.lastCheckAt ? formatDate(well.lastCheckAt) : 'не проверялась'}
                </td>
                <td className="py-3 hidden sm:table-cell">
                  {well.openTickets > 0 ? (
                    <span className="rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-sm font-semibold">
                      {well.openTickets} открыт.
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        page={flow.page.page}
        pageSize={WELLS_PAGE_SIZE}
        total={flow.page.total}
        onChange={(page) => flow.applyFilters({ page })}
      />
    </div>
  )
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold transition ${
        active ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400'
      }`}
    >
      {children}
    </button>
  )
}
