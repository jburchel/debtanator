export interface Debt {
  id: string
  name: string
  balance: number          // in cents
  interestRate: number     // decimal (0.185 = 18.5%)
  minimumPayment: number   // in cents
  category?: string
  color?: string
  createdAt: Date
  updatedAt: Date
}

export interface PayoffStrategy {
  method: 'snowball' | 'avalanche'
  extraPayment: number     // in cents
}

export interface PaymentLog {
  id: string
  debtId: string
  amount: number           // in cents
  date: Date
  note?: string
}

export interface UserPreferences {
  currency: string
  theme: 'light' | 'dark' | 'system'
  payday: number           // day of month 1-28
}

export interface MonthSnapshot {
  month: Date
  debts: DebtSnapshot[]
  totalBalance: number
}

export interface DebtSnapshot {
  debtId: string
  balance: number
  payment: number
  interestPortion: number
  principalPortion: number
}

export interface PayoffProjection {
  debtFreeDate: Date
  totalInterestPaid: number
  totalPaid: number
  interestSaved: number
  monthlySchedule: MonthSnapshot[]
}
