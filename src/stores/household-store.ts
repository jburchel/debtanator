import { create } from 'zustand'
import type { Database } from '@/types/database'

type Household = Database['public']['Tables']['households']['Row']

interface HouseholdState {
  household: Household | null
  loading: boolean
  setHousehold: (household: Household | null) => void
  setLoading: (loading: boolean) => void
}

export const useHouseholdStore = create<HouseholdState>((set) => ({
  household: null,
  loading: true,
  setHousehold: (household) => set({ household, loading: false }),
  setLoading: (loading) => set({ loading }),
}))
