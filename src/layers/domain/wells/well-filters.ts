import { z } from '@/layers/domain/zod'
import { wellStatusSchema } from './well'

export const WELL_SORTS = ['deviation', 'number'] as const
export const WELL_SORT_LABELS: Record<(typeof WELL_SORTS)[number], string> = {
  deviation: 'Сначала проблемные',
  number: 'По номеру',
}

export const WELLS_PAGE_SIZE = 15

/**
 * Фильтры списка скважин живут в адресной строке: их можно скопировать ссылкой
 * и они переживают обновление страницы. Неверные значения не ломают страницу — заменяются по умолчанию.
 */
export const wellFiltersSchema = z.object({
  search: z.string().trim().max(20).catch(''),
  ngduId: z.coerce.number().int().positive().optional().catch(undefined),
  status: wellStatusSchema.optional().catch(undefined),
  favorites: z.coerce.boolean().catch(false),
  sort: z.enum(WELL_SORTS).catch('deviation'),
  page: z.coerce.number().int().min(1).catch(1),
})
export type WellFilters = z.output<typeof wellFiltersSchema>

type SearchParams = Record<string, string | string[] | undefined>

/** Из параметров адреса (?status=RED&page=2) в объект фильтров. */
export function parseWellFilters(params: SearchParams): WellFilters {
  const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)
  return wellFiltersSchema.parse({
    search: first(params.search) ?? '',
    ngduId: first(params.ngdu),
    status: first(params.status),
    favorites: first(params.favorites) === '1',
    sort: first(params.sort),
    page: first(params.page),
  })
}

/** Обратно в строку адреса. Значения по умолчанию не пишем, чтобы ссылка была короткой. */
export function wellFiltersToQuery(filters: WellFilters): string {
  const params = new URLSearchParams()
  if (filters.search) params.set('search', filters.search)
  if (filters.ngduId) params.set('ngdu', String(filters.ngduId))
  if (filters.status) params.set('status', filters.status)
  if (filters.favorites) params.set('favorites', '1')
  if (filters.sort !== 'deviation') params.set('sort', filters.sort)
  if (filters.page > 1) params.set('page', String(filters.page))
  return params.toString()
}
