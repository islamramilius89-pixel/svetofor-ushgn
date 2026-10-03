import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { WellFormInput } from '@/layers/domain/wells/well'
import {
  deleteWell,
  fetchNgdus,
  fetchWell,
  fetchWells,
  type WellListParams,
} from '@/layers/infrastructure/wells/wells-api'
import { saveWell } from '@/layers/use-cases/wells/save-well'

export const wellKeys = {
  all: ['wells'] as const,
  list: (params: WellListParams) => ['wells', 'list', params] as const,
  detail: (id: number) => ['wells', 'detail', id] as const,
  ngdus: ['ngdus'] as const,
}

export function useWellsQuery(params: WellListParams, { enabled = true } = {}) {
  return useQuery({
    queryKey: wellKeys.list(params),
    queryFn: () => fetchWells(params),
    // Пока грузится следующая страница, показываем предыдущую, а не пустой экран.
    placeholderData: keepPreviousData,
    enabled,
  })
}

export function useWellQuery(id: number) {
  return useQuery({ queryKey: wellKeys.detail(id), queryFn: () => fetchWell(id) })
}

export function useNgdusQuery() {
  return useQuery({ queryKey: wellKeys.ngdus, queryFn: fetchNgdus, staleTime: 5 * 60_000 })
}

export function useSaveWellMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ input, id }: { input: WellFormInput; id?: number }) => saveWell(input, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: wellKeys.all })
      void queryClient.invalidateQueries({ queryKey: wellKeys.ngdus })
    },
  })
}

export function useDeleteWellMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteWell,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: wellKeys.all })
      void queryClient.invalidateQueries({ queryKey: wellKeys.ngdus })
      // У удалённой скважины удалены и её заявки.
      void queryClient.invalidateQueries({ queryKey: ['tickets'] })
    },
  })
}
