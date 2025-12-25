import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

type Household = Database['public']['Tables']['households']['Row']

export async function getUserHousehold(userId: string): Promise<Household | null> {
  // First check if user owns a household
  const { data: ownedHousehold } = await supabase
    .from('households')
    .select('*')
    .eq('owner_id', userId)
    .single()

  if (ownedHousehold) return ownedHousehold

  // Check if user is a member of a household
  const { data: membership } = await supabase
    .from('household_members')
    .select('household_id, households(*)')
    .eq('user_id', userId)
    .eq('status', 'accepted')
    .single()

  if (membership?.households) {
    return membership.households as unknown as Household
  }

  return null
}

export async function createHousehold(userId: string, name: string): Promise<Household> {
  const { data, error } = await supabase
    .from('households')
    .insert({ name, owner_id: userId })
    .select()
    .single()

  if (error) throw error

  // Add owner as admin member
  await supabase.from('household_members').insert({
    household_id: data.id,
    user_id: userId,
    role: 'admin',
    status: 'accepted',
    joined_at: new Date().toISOString(),
  })

  return data
}

export async function getOrCreateHousehold(userId: string, email: string): Promise<Household> {
  const existing = await getUserHousehold(userId)
  if (existing) return existing

  // Create a default household for new users
  const name = `${email.split('@')[0]}'s Budget`
  return createHousehold(userId, name)
}
