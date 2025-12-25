import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useHouseholdStore } from '@/stores/household-store'

export function useAllocations(budgetPeriodId: string | undefined) {
  return useQuery({
    queryKey: ['allocations', budgetPeriodId],
    queryFn: async () => {
      if (!budgetPeriodId) return []
      const { data, error } = await supabase
        .from('envelope_allocations')
        .select('*, envelopes(name, emoji, color)')
        .eq('budget_period_id', budgetPeriodId)
      if (error) throw error
      return data
    },
    enabled: !!budgetPeriodId,
  })
}

export function useUpsertAllocation() {
  const queryClient = useQueryClient()
  const { household } = useHouseholdStore()

  return useMutation({
    mutationFn: async ({
      envelope_id,
      budget_period_id,
      allocated_amount,
    }: {
      envelope_id: string
      budget_period_id: string
      allocated_amount: number
    }) => {
      // Check if allocation exists
      const { data: existing } = await supabase
        .from('envelope_allocations')
        .select('id')
        .eq('envelope_id', envelope_id)
        .eq('budget_period_id', budget_period_id)
        .single()

      if (existing) {
        const { data, error } = await supabase
          .from('envelope_allocations')
          .update({ allocated_amount })
          .eq('id', existing.id)
          .select()
          .single()
        if (error) throw error
        return data
      } else {
        const { data, error } = await supabase
          .from('envelope_allocations')
          .insert({ envelope_id, budget_period_id, allocated_amount })
          .select()
          .single()
        if (error) throw error
        return data
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['allocations', variables.budget_period_id] })
      queryClient.invalidateQueries({ queryKey: ['envelope-balances', household?.id] })
    },
  })
}

// Calculate envelope balances (allocated - spent)
export function useEnvelopeBalances(budgetPeriodId: string | undefined) {
  const { household } = useHouseholdStore()

  return useQuery({
    queryKey: ['envelope-balances', household?.id, budgetPeriodId],
    queryFn: async () => {
      if (!household || !budgetPeriodId) return []

      // Get allocations for this period
      const { data: allocations, error: allocError } = await supabase
        .from('envelope_allocations')
        .select('envelope_id, allocated_amount, rollover_amount')
        .eq('budget_period_id', budgetPeriodId)

      if (allocError) throw allocError

      // Get all envelopes
      const { data: envelopes, error: envError } = await supabase
        .from('envelopes')
        .select('*')
        .eq('household_id', household.id)
        .eq('is_archived', false)
        .order('sort_order')

      if (envError) throw envError

      // Get period info for date range
      const { data: period } = await supabase
        .from('budget_periods')
        .select('year, month')
        .eq('id', budgetPeriodId)
        .single()

      if (!period) return []

      const startDate = `${period.year}-${String(period.month).padStart(2, '0')}-01`
      const endDate = new Date(period.year, period.month, 0).toISOString().split('T')[0]

      // Get transactions for this period
      const { data: transactions, error: txError } = await supabase
        .from('transactions')
        .select('envelope_id, amount')
        .eq('household_id', household.id)
        .gte('date', startDate)
        .lte('date', endDate)

      if (txError) throw txError

      // Calculate spent per envelope
      const spentByEnvelope = transactions?.reduce((acc, tx) => {
        if (tx.envelope_id) {
          acc[tx.envelope_id] = (acc[tx.envelope_id] || 0) + Number(tx.amount)
        }
        return acc
      }, {} as Record<string, number>) || {}

      // Build balance info for each envelope
      return envelopes.map((envelope) => {
        const allocation = allocations?.find((a) => a.envelope_id === envelope.id)
        const allocated = Number(allocation?.allocated_amount || 0)
        const rollover = Number(allocation?.rollover_amount || 0)
        const spent = spentByEnvelope[envelope.id] || 0
        const available = allocated + rollover - spent

        return {
          ...envelope,
          allocated,
          rollover,
          spent,
          available,
        }
      })
    },
    enabled: !!household && !!budgetPeriodId,
  })
}
