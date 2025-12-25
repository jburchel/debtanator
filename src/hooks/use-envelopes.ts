import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useHouseholdStore } from '@/stores/household-store'
import type { Database } from '@/types/database'

type Envelope = Database['public']['Tables']['envelopes']['Row']
type EnvelopeInsert = Database['public']['Tables']['envelopes']['Insert']
type EnvelopeUpdate = Database['public']['Tables']['envelopes']['Update']

export function useEnvelopes() {
  const { household } = useHouseholdStore()

  return useQuery({
    queryKey: ['envelopes', household?.id],
    queryFn: async () => {
      if (!household) return []
      const { data, error } = await supabase
        .from('envelopes')
        .select('*')
        .eq('household_id', household.id)
        .eq('is_archived', false)
        .order('sort_order')
      if (error) throw error
      return data as Envelope[]
    },
    enabled: !!household,
  })
}

export function useCreateEnvelope() {
  const queryClient = useQueryClient()
  const { household } = useHouseholdStore()

  return useMutation({
    mutationFn: async (envelope: Omit<EnvelopeInsert, 'household_id'>) => {
      if (!household) throw new Error('No household')
      const { data, error } = await supabase
        .from('envelopes')
        .insert({ ...envelope, household_id: household.id })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['envelopes', household?.id] })
    },
  })
}

export function useUpdateEnvelope() {
  const queryClient = useQueryClient()
  const { household } = useHouseholdStore()

  return useMutation({
    mutationFn: async ({ id, ...update }: EnvelopeUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('envelopes')
        .update(update)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['envelopes', household?.id] })
    },
  })
}

export function useDeleteEnvelope() {
  const queryClient = useQueryClient()
  const { household } = useHouseholdStore()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('envelopes')
        .update({ is_archived: true })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['envelopes', household?.id] })
    },
  })
}
