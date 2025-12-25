import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useHouseholdStore } from '@/stores/household-store'

export function useRealtimeSubscriptions() {
  const queryClient = useQueryClient()
  const { household } = useHouseholdStore()

  useEffect(() => {
    if (!household) return

    // Subscribe to transactions changes
    const transactionsChannel = supabase
      .channel('transactions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `household_id=eq.${household.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['transactions', household.id] })
          queryClient.invalidateQueries({ queryKey: ['envelope-balances', household.id] })
        }
      )
      .subscribe()

    // Subscribe to envelopes changes
    const envelopesChannel = supabase
      .channel('envelopes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'envelopes',
          filter: `household_id=eq.${household.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['envelopes', household.id] })
          queryClient.invalidateQueries({ queryKey: ['envelope-balances', household.id] })
        }
      )
      .subscribe()

    // Subscribe to allocations changes
    const allocationsChannel = supabase
      .channel('allocations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'envelope_allocations',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['allocations'] })
          queryClient.invalidateQueries({ queryKey: ['envelope-balances', household.id] })
        }
      )
      .subscribe()

    // Subscribe to budget periods changes
    const periodsChannel = supabase
      .channel('periods-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'budget_periods',
          filter: `household_id=eq.${household.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['budget-periods', household.id] })
          queryClient.invalidateQueries({ queryKey: ['budget-period', household.id] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(transactionsChannel)
      supabase.removeChannel(envelopesChannel)
      supabase.removeChannel(allocationsChannel)
      supabase.removeChannel(periodsChannel)
    }
  }, [household, queryClient])
}
