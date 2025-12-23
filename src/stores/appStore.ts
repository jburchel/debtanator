import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserPreferences } from '@/lib/types'

interface AppState {
  preferences: UserPreferences
  setPreferences: (preferences: Partial<UserPreferences>) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      preferences: {
        currency: 'USD',
        theme: 'system',
        payday: 1,
      },
      setPreferences: (newPrefs) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPrefs },
        })),
    }),
    {
      name: 'debtonator-preferences',
    }
  )
)
