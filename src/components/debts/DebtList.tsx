import { DebtCard } from './DebtCard'
import { sortDebtsByMethod } from '@/lib/calculator'
import type { Debt, PayoffStrategy } from '@/lib/types'

interface DebtListProps {
  debts: Debt[]
  strategy: PayoffStrategy
  onEdit: (debt: Debt) => void
  onDelete: (id: string) => void
}

export function DebtList({ debts, strategy, onEdit, onDelete }: DebtListProps) {
  if (debts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No debts added yet.</p>
        <p className="text-gray-400 text-sm mt-1">Add your first debt to get started!</p>
      </div>
    )
  }

  const sortedDebts = sortDebtsByMethod(debts, strategy.method)
  const priorityDebtId = sortedDebts[0]?.id

  return (
    <div className="space-y-3">
      {sortedDebts.map((debt) => (
        <DebtCard
          key={debt.id}
          debt={debt}
          isPriority={debt.id === priorityDebtId}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
