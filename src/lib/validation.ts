import { z } from 'zod'

export const debtSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  balance: z.number().min(1, 'Balance must be at least $0.01'),
  interestRate: z.number().min(0, 'Interest rate cannot be negative').max(1, 'Interest rate cannot exceed 100%'),
  minimumPayment: z.number().min(0, 'Minimum payment cannot be negative'),
  category: z.string().optional(),
  color: z.string().optional(),
})

export const payoffStrategySchema = z.object({
  method: z.enum(['snowball', 'avalanche']),
  extraPayment: z.number().min(0),
})

export const userPreferencesSchema = z.object({
  currency: z.string().default('USD'),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  payday: z.number().min(1).max(28).default(1),
})

export type DebtInput = z.infer<typeof debtSchema>
export type PayoffStrategyInput = z.infer<typeof payoffStrategySchema>
export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>
