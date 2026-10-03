import {
  ngduListSchema,
  wellDetailsSchema,
  wellPageSchema,
  wellSchema,
  type WellForm,
  type WellStatus,
} from '@/layers/domain/wells/well'
import { jsonBody, requestJson, requestVoid, toQueryString } from '@/layers/infrastructure/http/http-client'

export type WellListParams = {
  search?: string
  ngduId?: number
  status?: WellStatus
  ids?: number[]
  sort?: 'deviation' | 'number'
  page?: number
  pageSize?: number
}

export function fetchWells(params: WellListParams) {
  const query = toQueryString({ ...params, ids: params.ids?.join(',') })
  return requestJson(`/wells${query}`, wellPageSchema)
}

export function fetchWell(id: number) {
  return requestJson(`/wells/${id}`, wellDetailsSchema)
}

export function fetchNgdus() {
  return requestJson('/ngdus', ngduListSchema)
}

export function createWell(form: WellForm) {
  return requestJson('/wells', wellSchema, jsonBody('POST', form))
}

export function updateWell(id: number, form: Partial<WellForm>) {
  return requestJson(`/wells/${id}`, wellSchema, jsonBody('PATCH', form))
}

export function deleteWell(id: number) {
  return requestVoid(`/wells/${id}`, { method: 'DELETE' })
}
