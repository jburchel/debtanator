import { Card, CardContent } from '@/components/ui/card'
import { useEnvelopeBalances } from '@/hooks/use-allocations'
import { useSelectedBudgetPeriod } from '@/hooks/use-selected-period'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react'

export function BudgetSummary() {
  const { data: period, isLoading: periodLoading } = useSelectedBudgetPeriod()
  const { data: envelopes, isLoading: envelopesLoading } = useEnvelopeBalances(period?.id)

  const isLoading = periodLoading || envelopesLoading

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    )
  }

  const totalBudgeted = envelopes?.reduce((sum, e) => sum + e.allocated, 0) ?? 0
  const totalSpent = envelopes?.reduce((sum, e) => sum + e.spent, 0) ?? 0
  const totalAvailable = envelopes?.reduce((sum, e) => sum + e.available, 0) ?? 0

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Budgeted</p>
              <p className="text-2xl font-bold">{formatCurrency(totalBudgeted)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <TrendingDown className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Spent</p>
              <p className="text-2xl font-bold text-destructive">{formatCurrency(totalSpent)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${totalAvailable >= 0 ? 'bg-green-500/10' : 'bg-destructive/10'}`}>
              <TrendingUp className={`h-5 w-5 ${totalAvailable >= 0 ? 'text-green-500' : 'text-destructive'}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available</p>
              <p className={`text-2xl font-bold ${totalAvailable >= 0 ? 'text-green-500' : 'text-destructive'}`}>
                {formatCurrency(totalAvailable)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
