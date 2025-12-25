import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useHouseholdStore } from '@/stores/household-store'
import type { Database } from '@/types/database'

type BudgetPeriod = Database['public']['Tables']['budget_periods']['Row']

export function useBudgetPeriods() {
  const { household } = useHouseholdStore()

  return useQuery({
    queryKey: ['budget-periods', household?.id],
    queryFn: async () => {
      if (!household) return []
      const { data, error } = await supabase
        .from('budget_periods')
        .select('*')
        .eq('household_id', household.id)
        .order('year', { ascending: false })
        .order('month', { ascending: false })
      if (error) throw error
      return data as BudgetPeriod[]
    },
    enabled: !!household,
  })
}

export function useCurrentBudgetPeriod() {
  const { household } = useHouseholdStore()
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1

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

      if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows
      return data as BudgetPeriod | null
    },
    enabled: !!household,
  })
}

export function useGetOrCreateBudgetPeriod() {
  const queryClient = useQueryClient()
  const { household } = useHouseholdStore()

  return useMutation({
    mutationFn: async ({ year, month }: { year: number; month: number }) => {
      if (!household) throw new Error('No household')

      // Try to get existing
      const { data: existing } = await supabase
        .from('budget_periods')
        .select('*')
        .eq('household_id', household.id)
        .eq('year', year)
        .eq('month', month)
        .single()

      if (existing) return existing as BudgetPeriod

      // Create new
      const { data, error } = await supabase
        .from('budget_periods')
        .insert({ household_id: household.id, year, month })
        .select()
        .single()

      if (error) throw error
      return data as BudgetPeriod
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-periods', household?.id] })
    },
  })
}

export function useUpdateBudgetPeriod() {
  const queryClient = useQueryClient()
  const { household } = useHouseholdStore()

  return useMutation({
    mutationFn: async ({
      id,
      total_income,
    }: {
      id: string
      total_income: number
    }) => {
      const { data, error } = await supabase
        .from('budget_periods')
        .update({ total_income })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-periods', household?.id] })
      queryClient.invalidateQueries({ queryKey: ['budget-period', household?.id] })
    },
  })
}
