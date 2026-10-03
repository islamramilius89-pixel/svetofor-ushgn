import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type FavoritesState = {
  ids: number[]
  toggle: (id: number) => void
  clear: () => void
}

/**
 * Избранные скважины — личный выбор пользователя в этом браузере.
 * Это состояние интерфейса, а не данные сервера, поэтому оно в Zustand и сохраняется в localStorage.
 */
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) =>
        set((state) => ({
          ids: state.ids.includes(id) ? state.ids.filter((item) => item !== id) : [...state.ids, id],
        })),
      clear: () => set({ ids: [] }),
    }),
    {
      name: 'svetofor-favorites',
      storage: createJSONStorage(() => localStorage),
      // Восстанавливаем после первой отрисовки, чтобы HTML с сервера и в браузере совпал.
      skipHydration: true,
    },
  ),
)
