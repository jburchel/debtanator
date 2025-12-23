import { Trash2, Pencil } from 'lucide-react'
import { Card, CardContent, Button } from '@/components/ui'
import { formatCurrency, formatPercent } from '@/lib/utils'
import type { Debt } from '@/lib/types'

interface DebtCardProps {
  debt: Debt
  isPriority?: boolean
  onEdit: (debt: Debt) => void
  onDelete: (id: string) => void
}

export function DebtCard({ debt, isPriority, onEdit, onDelete }: DebtCardProps) {
  return (
    <Card className={isPriority ? 'ring-2 ring-primary-500' : ''}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{debt.name}</h3>
              {isPriority && (
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                  Focus
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatCurrency(debt.balance)}
            </p>
            <div className="flex gap-4 mt-2 text-sm text-gray-600">
              <span>{formatPercent(debt.interestRate)} APR</span>
              <span>{formatCurrency(debt.minimumPayment)}/mo min</span>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(debt)}
              aria-label="Edit debt"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(debt.id)}
              aria-label="Delete debt"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
