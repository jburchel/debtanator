export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      households: {
        Row: {
          id: string
          name: string
          owner_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          owner_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          owner_id?: string
          created_at?: string
        }
      }
      household_members: {
        Row: {
          id: string
          household_id: string
          user_id: string | null
          role: 'admin' | 'member'
          invited_email: string | null
          status: 'pending' | 'accepted'
          joined_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          household_id: string
          user_id?: string | null
          role?: 'admin' | 'member'
          invited_email?: string | null
          status?: 'pending' | 'accepted'
          joined_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          user_id?: string | null
          role?: 'admin' | 'member'
          invited_email?: string | null
          status?: 'pending' | 'accepted'
          joined_at?: string | null
          created_at?: string
        }
      }
      budget_periods: {
        Row: {
          id: string
          household_id: string
          year: number
          month: number
          total_income: number
          created_at: string
        }
        Insert: {
          id?: string
          household_id: string
          year: number
          month: number
          total_income?: number
          created_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          year?: number
          month?: number
          total_income?: number
          created_at?: string
        }
      }
      envelopes: {
        Row: {
          id: string
          household_id: string
          name: string
          emoji: string | null
          color: string | null
          sort_order: number
          is_archived: boolean
          created_at: string
        }
        Insert: {
          id?: string
          household_id: string
          name: string
          emoji?: string | null
          color?: string | null
          sort_order?: number
          is_archived?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          name?: string
          emoji?: string | null
          color?: string | null
          sort_order?: number
          is_archived?: boolean
          created_at?: string
        }
      }
      envelope_allocations: {
        Row: {
          id: string
          envelope_id: string
          budget_period_id: string
          allocated_amount: number
          rollover_amount: number
          created_at: string
        }
        Insert: {
          id?: string
          envelope_id: string
          budget_period_id: string
          allocated_amount?: number
          rollover_amount?: number
          created_at?: string
        }
        Update: {
          id?: string
          envelope_id?: string
          budget_period_id?: string
          allocated_amount?: number
          rollover_amount?: number
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          household_id: string
          envelope_id: string | null
          amount: number
          description: string | null
          merchant: string | null
          date: string
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          household_id: string
          envelope_id?: string | null
          amount: number
          description?: string | null
          merchant?: string | null
          date?: string
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          envelope_id?: string | null
          amount?: number
          description?: string | null
          merchant?: string | null
          date?: string
          created_by?: string | null
          created_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          theme: 'light' | 'dark' | 'system'
          language: string
          currency: string
          onboarding_completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          theme?: 'light' | 'dark' | 'system'
          language?: string
          currency?: string
          onboarding_completed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          theme?: 'light' | 'dark' | 'system'
          language?: string
          currency?: string
          onboarding_completed?: boolean
          created_at?: string
        }
      }
    }
  }
}

// Convenience types
export type Household = Database['public']['Tables']['households']['Row']
export type HouseholdMember = Database['public']['Tables']['household_members']['Row']
export type BudgetPeriod = Database['public']['Tables']['budget_periods']['Row']
export type Envelope = Database['public']['Tables']['envelopes']['Row']
export type EnvelopeAllocation = Database['public']['Tables']['envelope_allocations']['Row']
export type Transaction = Database['public']['Tables']['transactions']['Row']
export type UserPreferences = Database['public']['Tables']['user_preferences']['Row']
