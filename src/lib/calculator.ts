import type { Debt, PayoffStrategy, PayoffProjection, MonthSnapshot, DebtSnapshot } from './types'

export function sortDebtsByMethod(debts: Debt[], method: 'snowball' | 'avalanche'): Debt[] {
  return [...debts].sort((a, b) => {
    if (method === 'snowball') {
      return a.balance - b.balance
    } else {
      return b.interestRate - a.interestRate
    }
  })
}

export function calculatePayoff(debts: Debt[], strategy: PayoffStrategy): PayoffProjection {
  if (debts.length === 0) {
    return {
      debtFreeDate: new Date(),
      totalInterestPaid: 0,
      totalPaid: 0,
      interestSaved: 0,
      monthlySchedule: [],
    }
  }

  const workingDebts = debts.map(d => ({
    ...d,
    workingBalance: d.balance,
  }))

  const monthlySchedule: MonthSnapshot[] = []
  let totalInterestPaid = 0
  let totalPaid = 0
  let currentDate = new Date()
  currentDate.setDate(1)

  const MAX_MONTHS = 360

  while (workingDebts.some(d => d.workingBalance > 0) && monthlySchedule.length < MAX_MONTHS) {
    currentDate = new Date(currentDate)
    currentDate.setMonth(currentDate.getMonth() + 1)

    const debtSnapshots: DebtSnapshot[] = []
    let availableExtra = strategy.extraPayment

    const sortedDebts = sortDebtsByMethod(
      workingDebts.filter(d => d.workingBalance > 0),
      strategy.method
    )

    for (const debt of workingDebts) {
      if (debt.workingBalance <= 0) {
        debtSnapshots.push({
          debtId: debt.id,
          balance: 0,
          payment: 0,
          interestPortion: 0,
          principalPortion: 0,
        })
        continue
      }

      const monthlyRate = debt.interestRate / 12
      const interestPortion = Math.round(debt.workingBalance * monthlyRate)

      let payment = Math.min(debt.minimumPayment, debt.workingBalance + interestPortion)

      if (sortedDebts[0]?.id === debt.id && availableExtra > 0) {
        const extraToApply = Math.min(availableExtra, debt.workingBalance + interestPortion - payment)
        payment += extraToApply
        availableExtra -= extraToApply
      }

      payment = Math.min(payment, debt.workingBalance + interestPortion)

      const principalPortion = payment - interestPortion
      debt.workingBalance = Math.max(0, debt.workingBalance - principalPortion)

      totalInterestPaid += interestPortion
      totalPaid += payment

      debtSnapshots.push({
        debtId: debt.id,
        balance: debt.workingBalance,
        payment,
        interestPortion,
        principalPortion,
      })
    }

    monthlySchedule.push({
      month: new Date(currentDate),
      debts: debtSnapshots,
      totalBalance: workingDebts.reduce((sum, d) => sum + d.workingBalance, 0),
    })
  }

  const minimumOnlyProjection = calculateMinimumOnlyInterest(debts)
  const interestSaved = minimumOnlyProjection - totalInterestPaid

  return {
    debtFreeDate: currentDate,
    totalInterestPaid,
    totalPaid,
    interestSaved: Math.max(0, interestSaved),
    monthlySchedule,
  }
}

function calculateMinimumOnlyInterest(debts: Debt[]): number {
  const workingDebts = debts.map(d => ({ ...d, workingBalance: d.balance }))
  let totalInterest = 0
  let months = 0
  const MAX_MONTHS = 360

  while (workingDebts.some(d => d.workingBalance > 0) && months < MAX_MONTHS) {
    months++
    for (const debt of workingDebts) {
      if (debt.workingBalance <= 0) continue

      const monthlyRate = debt.interestRate / 12
      const interest = Math.round(debt.workingBalance * monthlyRate)
      const payment = Math.min(debt.minimumPayment, debt.workingBalance + interest)
      const principal = payment - interest

      totalInterest += interest
      debt.workingBalance = Math.max(0, debt.workingBalance - principal)
    }
  }

  return totalInterest
}
