import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type PreferencesState = {
  /** Имя, которым подписываются комментарии. Запоминается после первого комментария. */
  authorName: string
  /** Компактный вид доски: карточки без описания. */
  compactBoard: boolean
  setAuthorName: (name: string) => void
  toggleCompactBoard: () => void
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      authorName: '',
      compactBoard: false,
      setAuthorName: (authorName) => set({ authorName }),
      toggleCompactBoard: () => set((state) => ({ compactBoard: !state.compactBoard })),
    }),
    {
      name: 'svetofor-preferences',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
)
