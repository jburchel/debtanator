import { useTransactions } from '@/hooks/use-transactions'
import { useDeleteTransaction } from '@/hooks/use-transactions'
import { useAuthStore } from '@/stores/auth-store'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { Trash2, User } from 'lucide-react'

interface TransactionListProps {
  envelopeId?: string
  limit?: number
}

export function TransactionList({ envelopeId, limit }: TransactionListProps) {
  const { user } = useAuthStore()
  const { data: transactions, isLoading } = useTransactions({ envelopeId, limit })
  const deleteTransaction = useDeleteTransaction()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    )
  }

  if (!transactions?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No transactions yet
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="flex items-center justify-between p-3 rounded-lg border bg-card"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {tx.envelopes && (
                <span className="text-sm">{tx.envelopes.emoji}</span>
              )}
              <span className="font-medium truncate">
                {tx.merchant || tx.description || 'Transaction'}
              </span>
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              {format(new Date(tx.date), 'MMM d, yyyy')}
              {tx.description && tx.merchant && (
                <span>• {tx.description}</span>
              )}
              {tx.created_by && tx.created_by !== user?.id && (
                <span className="inline-flex items-center gap-0.5 ml-1 text-xs bg-muted px-1.5 py-0.5 rounded">
                  <User className="h-3 w-3" />
                  Family
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-destructive">
              -{formatCurrency(tx.amount)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => deleteTransaction.mutate(tx.id)}
              disabled={deleteTransaction.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
