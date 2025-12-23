import { describe, it, expect } from 'vitest'
import { calculatePayoff, sortDebtsByMethod } from './calculator'
import type { Debt, PayoffStrategy } from './types'

const createDebt = (overrides: Partial<Debt> = {}): Debt => ({
  id: crypto.randomUUID(),
  name: 'Test Debt',
  balance: 100000, // $1000
  interestRate: 0.18, // 18%
  minimumPayment: 5000, // $50
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

describe('sortDebtsByMethod', () => {
  it('sorts by balance ascending for snowball', () => {
    const debts = [
      createDebt({ name: 'Big', balance: 500000 }),
      createDebt({ name: 'Small', balance: 100000 }),
      createDebt({ name: 'Medium', balance: 250000 }),
    ]
    const sorted = sortDebtsByMethod(debts, 'snowball')
    expect(sorted.map(d => d.name)).toEqual(['Small', 'Medium', 'Big'])
  })

  it('sorts by interest rate descending for avalanche', () => {
    const debts = [
      createDebt({ name: 'Low', interestRate: 0.05 }),
      createDebt({ name: 'High', interestRate: 0.25 }),
      createDebt({ name: 'Medium', interestRate: 0.15 }),
    ]
    const sorted = sortDebtsByMethod(debts, 'avalanche')
    expect(sorted.map(d => d.name)).toEqual(['High', 'Medium', 'Low'])
  })
})

describe('calculatePayoff', () => {
  it('returns empty projection for no debts', () => {
    const result = calculatePayoff([], { method: 'avalanche', extraPayment: 0 })
    expect(result.totalInterestPaid).toBe(0)
    expect(result.monthlySchedule).toHaveLength(0)
  })

  it('calculates payoff for single debt', () => {
    const debts = [createDebt({ balance: 100000, interestRate: 0.12, minimumPayment: 5000 })]
    const strategy: PayoffStrategy = { method: 'avalanche', extraPayment: 0 }
    const result = calculatePayoff(debts, strategy)

    expect(result.debtFreeDate).toBeInstanceOf(Date)
    expect(result.totalPaid).toBeGreaterThan(100000)
    expect(result.monthlySchedule.length).toBeGreaterThan(0)
  })

  it('pays off faster with extra payment', () => {
    const debts = [createDebt({ balance: 100000, interestRate: 0.12, minimumPayment: 5000 })]

    const withoutExtra = calculatePayoff(debts, { method: 'avalanche', extraPayment: 0 })
    const withExtra = calculatePayoff(debts, { method: 'avalanche', extraPayment: 5000 })

    expect(withExtra.monthlySchedule.length).toBeLessThan(withoutExtra.monthlySchedule.length)
    expect(withExtra.totalInterestPaid).toBeLessThan(withoutExtra.totalInterestPaid)
  })

  it('snowball targets smallest balance first', () => {
    const debts = [
      createDebt({ id: 'big', name: 'Big', balance: 500000, minimumPayment: 5000 }),
      createDebt({ id: 'small', name: 'Small', balance: 100000, minimumPayment: 5000 }),
    ]
    const strategy: PayoffStrategy = { method: 'snowball', extraPayment: 10000 }
    const result = calculatePayoff(debts, strategy)

    const smallDebtPaidOffMonth = result.monthlySchedule.findIndex(
      month => month.debts.find(d => d.debtId === 'small')?.balance === 0
    )
    const bigDebtPaidOffMonth = result.monthlySchedule.findIndex(
      month => month.debts.find(d => d.debtId === 'big')?.balance === 0
    )
    expect(smallDebtPaidOffMonth).toBeLessThan(bigDebtPaidOffMonth)
  })

  it('avalanche targets highest rate first', () => {
    const debts = [
      createDebt({ id: 'low', name: 'Low Rate', balance: 100000, interestRate: 0.05, minimumPayment: 5000 }),
      createDebt({ id: 'high', name: 'High Rate', balance: 100000, interestRate: 0.25, minimumPayment: 5000 }),
    ]
    const strategy: PayoffStrategy = { method: 'avalanche', extraPayment: 10000 }
    const result = calculatePayoff(debts, strategy)

    const highRatePaidOff = result.monthlySchedule.findIndex(
      month => month.debts.find(d => d.debtId === 'high')?.balance === 0
    )
    const lowRatePaidOff = result.monthlySchedule.findIndex(
      month => month.debts.find(d => d.debtId === 'low')?.balance === 0
    )
    expect(highRatePaidOff).toBeLessThan(lowRatePaidOff)
  })
})
