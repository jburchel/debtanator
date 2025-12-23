import Dexie, { type Table } from 'dexie'
import type { Debt, PaymentLog, PayoffStrategy, UserPreferences } from './types'

export class DebtonatorDB extends Dexie {
  debts!: Table<Debt, string>
  paymentLogs!: Table<PaymentLog, string>
  settings!: Table<{ key: string; value: PayoffStrategy | UserPreferences }, string>

  constructor() {
    super('debtonator')
    this.version(1).stores({
      debts: 'id, name, createdAt',
      paymentLogs: 'id, debtId, date',
      settings: 'key',
    })
  }
}

export const db = new DebtonatorDB()
