import { useSyncExternalStore } from 'react'

type PersistApi = {
  /** На сервере localStorage нет, и Zustand не создаёт persist — поэтому поле может отсутствовать. */
  persist?: {
    hasHydrated: () => boolean
    onFinishHydration: (listener: () => void) => () => void
  }
}

const noop = () => {}

/** true, когда сохранённые в localStorage данные уже загружены в хранилище. На сервере всегда false. */
export function useStoreHydrated(store: PersistApi): boolean {
  return useSyncExternalStore(
    (listener) => store.persist?.onFinishHydration(listener) ?? noop,
    () => store.persist?.hasHydrated() ?? false,
    () => false,
  )
}
