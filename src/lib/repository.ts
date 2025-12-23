import { db } from './db'
import type { Debt, PayoffStrategy, UserPreferences } from './types'

const DEFAULT_STRATEGY: PayoffStrategy = {
  method: 'avalanche',
  extraPayment: 0,
}

const DEFAULT_PREFERENCES: UserPreferences = {
  currency: 'USD',
  theme: 'system',
  payday: 1,
}

export const debtRepository = {
  async getAll(): Promise<Debt[]> {
    return db.debts.toArray()
  },

  async getById(id: string): Promise<Debt | undefined> {
    return db.debts.get(id)
  },

  async create(debt: Omit<Debt, 'id' | 'createdAt' | 'updatedAt'>): Promise<Debt> {
    const now = new Date()
    const newDebt: Debt = {
      ...debt,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }
    await db.debts.add(newDebt)
    return newDebt
  },

  async update(id: string, updates: Partial<Omit<Debt, 'id' | 'createdAt'>>): Promise<void> {
    await db.debts.update(id, { ...updates, updatedAt: new Date() })
  },

  async delete(id: string): Promise<void> {
    await db.debts.delete(id)
  },
}

export const settingsRepository = {
  async getStrategy(): Promise<PayoffStrategy> {
    const record = await db.settings.get('strategy')
    return (record?.value as PayoffStrategy) ?? DEFAULT_STRATEGY
  },

  async setStrategy(strategy: PayoffStrategy): Promise<void> {
    await db.settings.put({ key: 'strategy', value: strategy })
  },

  async getPreferences(): Promise<UserPreferences> {
    const record = await db.settings.get('preferences')
    return (record?.value as UserPreferences) ?? DEFAULT_PREFERENCES
  },

  async setPreferences(preferences: UserPreferences): Promise<void> {
    await db.settings.put({ key: 'preferences', value: preferences })
  },
}
