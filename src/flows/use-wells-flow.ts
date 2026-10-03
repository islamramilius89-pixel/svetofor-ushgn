import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useNgdusQuery, useWellsQuery } from '@/interactions/wells'
import {
  WELLS_PAGE_SIZE,
  wellFiltersToQuery,
  type WellFilters,
} from '@/layers/domain/wells/well-filters'
import { useFavoritesStore } from '@/stores/favorites-store'
import { useStoreHydrated } from '@/stores/use-store-hydrated'
import { useDebouncedCallback } from './use-debounced-callback'

/**
 * Список скважин. Фильтры приходят из адреса страницы (их разобрал сервер),
 * а при изменении фильтра мы меняем адрес — и страница получает новые фильтры.
 */
export function useWellsFlow(filters: WellFilters) {
  const router = useRouter()
  const [isNavigating, startTransition] = useTransition()
  // Меняется только при сбросе фильтров: поле поиска очищается, но не теряет фокус, пока человек печатает.
  const [searchResetKey, setSearchResetKey] = useState(0)

  const favoriteIds = useFavoritesStore((state) => state.ids)
  const toggleFavorite = useFavoritesStore((state) => state.toggle)
  const favoritesReady = useStoreHydrated(useFavoritesStore)
  const noFavorites = filters.favorites && favoritesReady && favoriteIds.length === 0

  const wellsQuery = useWellsQuery(
    {
      search: filters.search || undefined,
      ngduId: filters.ngduId,
      status: filters.status,
      sort: filters.sort,
      page: filters.page,
      pageSize: WELLS_PAGE_SIZE,
      ids: filters.favorites ? favoriteIds : undefined,
    },
    { enabled: !filters.favorites || (favoritesReady && !noFavorites) },
  )
  const ngdusQuery = useNgdusQuery()

  function applyFilters(patch: Partial<WellFilters>) {
    // Любой новый фильтр начинает с первой страницы, если страница не указана явно.
    const query = wellFiltersToQuery({ ...filters, page: 1, ...patch })
    startTransition(() => router.replace(query ? `/wells?${query}` : '/wells', { scroll: false }))
  }

  const changeSearch = useDebouncedCallback((value: string) => applyFilters({ search: value.trim() }))

  return {
    filters,
    applyFilters,
    changeSearch,
    resetFilters: () => {
      setSearchResetKey((key) => key + 1)
      startTransition(() => router.replace('/wells', { scroll: false }))
    },
    searchResetKey,
    isNavigating: isNavigating || wellsQuery.isFetching,

    page: wellsQuery.data,
    isLoading: wellsQuery.isPending && !noFavorites,
    error: wellsQuery.error?.message ?? null,
    retry: () => void wellsQuery.refetch(),
    noFavorites,

    ngdus: ngdusQuery.data ?? [],
    favoriteIds,
    toggleFavorite,
  }
}
