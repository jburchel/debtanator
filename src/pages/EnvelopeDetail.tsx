import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEnvelopes, useDeleteEnvelope } from '@/hooks/use-envelopes'
import { useEnvelopeBalances } from '@/hooks/use-allocations'
import { useUpsertAllocation } from '@/hooks/use-allocations'
import { useSelectedBudgetPeriod } from '@/hooks/use-selected-period'
import { TransactionList } from '@/components/transactions/TransactionList'
import { TransactionModal } from '@/components/transactions/TransactionModal'
import { BudgetPeriodSelector } from '@/components/budget/BudgetPeriodSelector'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function EnvelopeDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: envelopes, isLoading: envelopesLoading } = useEnvelopes()
  const { data: period } = useSelectedBudgetPeriod()
  const { data: balances, isLoading: balancesLoading } = useEnvelopeBalances(period?.id)
  const deleteEnvelope = useDeleteEnvelope()
  const upsertAllocation = useUpsertAllocation()

  const [transactionModalOpen, setTransactionModalOpen] = useState(false)
  const [editAllocationOpen, setEditAllocationOpen] = useState(false)
  const [allocationAmount, setAllocationAmount] = useState('')
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  const envelope = envelopes?.find((e) => e.id === id)
  const balance = balances?.find((b) => b.id === id)
  const isLoading = envelopesLoading || balancesLoading

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-8 w-48" />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 space-y-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-64" />
        </main>
      </div>
    )
  }

  if (!envelope) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Envelope not found</p>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const percentSpent = balance?.allocated
    ? Math.min((balance.spent / balance.allocated) * 100, 100)
    : 0
  const isOverspent = (balance?.available ?? 0) < 0

  const handleSaveAllocation = async () => {
    if (!period?.id || !id) return
    await upsertAllocation.mutateAsync({
      envelope_id: id,
      budget_period_id: period.id,
      allocated_amount: parseFloat(allocationAmount) || 0,
    })
    setEditAllocationOpen(false)
  }

  const handleDelete = async () => {
    await deleteEnvelope.mutateAsync(id!)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{envelope.emoji}</span>
              <h1 className="text-xl font-bold">{envelope.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BudgetPeriodSelector />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteConfirmOpen(true)}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Budget</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setAllocationAmount(String(balance?.allocated || 0))
                  setEditAllocationOpen(true)
                }}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline justify-between">
              <span
                className={cn(
                  'text-3xl font-bold',
                  isOverspent ? 'text-destructive' : 'text-foreground'
                )}
              >
                {formatCurrency(balance?.available ?? 0)}
              </span>
              <span className="text-muted-foreground">available</span>
            </div>

            <Progress
              value={percentSpent}
              className={cn('h-3', isOverspent && '[&>div]:bg-destructive')}
            />

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Budgeted</p>
                <p className="font-semibold">{formatCurrency(balance?.allocated ?? 0)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Spent</p>
                <p className="font-semibold text-destructive">
                  {formatCurrency(balance?.spent ?? 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rollover</p>
                <p className="font-semibold">{formatCurrency(balance?.rollover ?? 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Transactions</h2>
            <Button onClick={() => setTransactionModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
          <TransactionList envelopeId={id} />
        </div>
      </main>

      <TransactionModal
        open={transactionModalOpen}
        onOpenChange={setTransactionModalOpen}
        defaultEnvelopeId={id}
      />

      <Dialog open={editAllocationOpen} onOpenChange={setEditAllocationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Budget Allocation</DialogTitle>
            <DialogDescription>
              Set the monthly budget for {envelope.emoji} {envelope.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="allocation">Monthly Budget</Label>
            <div className="relative mt-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="allocation"
                type="number"
                step="0.01"
                min="0"
                value={allocationAmount}
                onChange={(e) => setAllocationAmount(e.target.value)}
                className="pl-7"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditAllocationOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAllocation} disabled={upsertAllocation.isPending}>
              {upsertAllocation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Envelope?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{envelope.name}"? This action cannot be undone.
              Transactions in this envelope will be kept but unassigned.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteEnvelope.isPending}
            >
              {deleteEnvelope.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
