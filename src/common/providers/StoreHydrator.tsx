'use client'

import { useEffect } from 'react'
import { useFavoritesStore } from '@/stores/favorites-store'
import { usePreferencesStore } from '@/stores/preferences-store'

/**
 * Сервер не знает, что лежит в localStorage. Поэтому сначала страница рисуется
 * со значениями по умолчанию (как на сервере), а сохранённые данные подставляются после.
 */
export function StoreHydrator() {
  useEffect(() => {
    void useFavoritesStore.persist.rehydrate()
    void usePreferencesStore.persist.rehydrate()
  }, [])
  return null
}
