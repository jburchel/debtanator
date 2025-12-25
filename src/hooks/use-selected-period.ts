import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useHouseholdStore } from '@/stores/household-store'
import { usePeriodStore } from '@/stores/period-store'
import type { Database } from '@/types/database'

type BudgetPeriod = Database['public']['Tables']['budget_periods']['Row']

export function useSelectedBudgetPeriod() {
  const { household } = useHouseholdStore()
  const { year, month } = usePeriodStore()

  return useQuery({
    queryKey: ['budget-period', household?.id, year, month],
    queryFn: async () => {
      if (!household) return null
      const { data, error } = await supabase
        .from('budget_periods')
        .select('*')
        .eq('household_id', household.id)
        .eq('year', year)
        .eq('month', month)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data as BudgetPeriod | null
    },
    enabled: !!household,
  })
}
