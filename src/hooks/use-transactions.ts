import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useHouseholdStore } from '@/stores/household-store'
import { useAuthStore } from '@/stores/auth-store'
import type { Database } from '@/types/database'

type TransactionInsert = Database['public']['Tables']['transactions']['Insert']

interface TransactionFilters {
  envelopeId?: string
  startDate?: string
  endDate?: string
  limit?: number
}

export function useTransactions(filters: TransactionFilters = {}) {
  const { household } = useHouseholdStore()

  return useQuery({
    queryKey: ['transactions', household?.id, filters],
    queryFn: async () => {
      if (!household) return []

      let query = supabase
        .from('transactions')
        .select('*, envelopes(name, emoji, color)')
        .eq('household_id', household.id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })

      if (filters.envelopeId) {
        query = query.eq('envelope_id', filters.envelopeId)
      }
      if (filters.startDate) {
        query = query.gte('date', filters.startDate)
      }
      if (filters.endDate) {
        query = query.lte('date', filters.endDate)
      }
      if (filters.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    },
    enabled: !!household,
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()
  const { household } = useHouseholdStore()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async (transaction: Omit<TransactionInsert, 'household_id' | 'created_by'>) => {
      if (!household || !user) throw new Error('No household or user')
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          ...transaction,
          household_id: household.id,
          created_by: user.id,
        })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', household?.id] })
      queryClient.invalidateQueries({ queryKey: ['envelope-balances', household?.id] })
    },
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()
  const { household } = useHouseholdStore()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', household?.id] })
      queryClient.invalidateQueries({ queryKey: ['envelope-balances', household?.id] })
    },
  })
}
