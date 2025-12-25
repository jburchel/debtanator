import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useEnvelopeBalances } from '@/hooks/use-allocations'
import { useSelectedBudgetPeriod } from '@/hooks/use-selected-period'
import { useUpdateBudgetPeriod } from '@/hooks/use-budget-periods'
import { Skeleton } from '@/components/ui/skeleton'
import { Pencil, AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function IncomeAllocationBar() {
  const { data: period, isLoading: periodLoading } = useSelectedBudgetPeriod()
  const { data: envelopes, isLoading: envelopesLoading } = useEnvelopeBalances(period?.id)
  const updateBudgetPeriod = useUpdateBudgetPeriod()

  const [editIncomeOpen, setEditIncomeOpen] = useState(false)
  const [incomeAmount, setIncomeAmount] = useState('')

  const isLoading = periodLoading || envelopesLoading

  if (isLoading) {
    return <Skeleton className="h-32" />
  }

  const totalIncome = Number(period?.total_income ?? 0)
  const totalAllocated = envelopes?.reduce((sum, e) => sum + e.allocated, 0) ?? 0
  const unallocated = totalIncome - totalAllocated
  const percentAllocated = totalIncome > 0 ? Math.min((totalAllocated / totalIncome) * 100, 100) : 0
  const isFullyAllocated = Math.abs(unallocated) < 0.01
  const isOverAllocated = unallocated < -0.01

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const handleSaveIncome = async () => {
    if (!period?.id) return
    await updateBudgetPeriod.mutateAsync({
      id: period.id,
      total_income: parseFloat(incomeAmount) || 0,
    })
    setEditIncomeOpen(false)
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Income Allocation</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIncomeAmount(String(totalIncome))
                setEditIncomeOpen(true)
              }}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Set Income
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {totalIncome === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <p>Set your monthly income to start budgeting</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-sm">
                <span>
                  {formatCurrency(totalAllocated)} of {formatCurrency(totalIncome)} allocated
                </span>
                <span
                  className={cn(
                    'flex items-center gap-1',
                    isFullyAllocated && 'text-green-500',
                    isOverAllocated && 'text-destructive'
                  )}
                >
                  {isFullyAllocated && <CheckCircle2 className="h-4 w-4" />}
                  {isOverAllocated && <AlertCircle className="h-4 w-4" />}
                  {isFullyAllocated
                    ? 'Fully allocated!'
                    : isOverAllocated
                    ? `Over by ${formatCurrency(Math.abs(unallocated))}`
                    : `${formatCurrency(unallocated)} left`}
                </span>
              </div>

              <Progress
                value={percentAllocated}
                className={cn(
                  'h-4',
                  isOverAllocated && '[&>div]:bg-destructive',
                  isFullyAllocated && '[&>div]:bg-green-500'
                )}
              />

              <div className="flex flex-wrap gap-2">
                {envelopes?.map((envelope) => {
                  const width = totalIncome > 0 ? (envelope.allocated / totalIncome) * 100 : 0
                  if (width < 1) return null
                  return (
                    <div
                      key={envelope.id}
                      className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded"
                    >
                      <span>{envelope.emoji}</span>
                      <span>{envelope.name}</span>
                      <span className="text-muted-foreground">
                        {formatCurrency(envelope.allocated)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={editIncomeOpen} onOpenChange={setEditIncomeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Monthly Income</DialogTitle>
            <DialogDescription>
              Enter your total income for this month. This helps you ensure every dollar is assigned
              to an envelope.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={incomeAmount}
                onChange={(e) => setIncomeAmount(e.target.value)}
                className="pl-7"
                placeholder="0.00"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditIncomeOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveIncome} disabled={updateBudgetPeriod.isPending}>
              {updateBudgetPeriod.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
