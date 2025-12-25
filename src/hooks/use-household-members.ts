import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useHouseholdStore } from '@/stores/household-store'

export function useHouseholdMembers() {
  const { household } = useHouseholdStore()

  return useQuery({
    queryKey: ['household-members', household?.id],
    queryFn: async () => {
      if (!household) return []
      const { data, error } = await supabase
        .from('household_members')
        .select('*')
        .eq('household_id', household.id)
      if (error) throw error
      return data
    },
    enabled: !!household,
  })
}

export function useInviteMember() {
  const queryClient = useQueryClient()
  const { household } = useHouseholdStore()

  return useMutation({
    mutationFn: async (email: string) => {
      if (!household) throw new Error('No household')

      // Check if already invited or member
      const { data: existing } = await supabase
        .from('household_members')
        .select('id')
        .eq('household_id', household.id)
        .eq('invited_email', email.toLowerCase())
        .single()

      if (existing) throw new Error('This email has already been invited')

      const { data, error } = await supabase
        .from('household_members')
        .insert({
          household_id: household.id,
          invited_email: email.toLowerCase(),
          role: 'member',
          status: 'pending',
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['household-members', household?.id] })
    },
  })
}

export function useRemoveMember() {
  const queryClient = useQueryClient()
  const { household } = useHouseholdStore()

  return useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase
        .from('household_members')
        .delete()
        .eq('id', memberId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['household-members', household?.id] })
    },
  })
}
