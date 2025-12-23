import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui'
import { DebtForm, DebtList } from '@/components/debts'
import { useDebts, useCreateDebt, useUpdateDebt, useDeleteDebt, useStrategy } from '@/hooks'
import type { Debt } from '@/lib/types'
import type { DebtInput } from '@/lib/validation'

export function Debts() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null)

  const { data: debts = [], isLoading: debtsLoading } = useDebts()
  const { data: strategy } = useStrategy()
  const createDebt = useCreateDebt()
  const updateDebt = useUpdateDebt()
  const deleteDebt = useDeleteDebt()

  const handleCreate = async (data: DebtInput) => {
    await createDebt.mutateAsync(data)
    setIsFormOpen(false)
  }

  const handleUpdate = async (data: DebtInput) => {
    if (!editingDebt) return
    await updateDebt.mutateAsync({ id: editingDebt.id, data })
    setEditingDebt(null)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this debt?')) {
      await deleteDebt.mutateAsync(id)
    }
  }

  const handleEdit = (debt: Debt) => {
    setEditingDebt(debt)
  }

  if (debtsLoading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Your Debts</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Debt
        </Button>
      </div>

      {strategy && (
        <DebtList
          debts={debts}
          strategy={strategy}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Add Debt Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Debt</DialogTitle>
          </DialogHeader>
          <DebtForm
            onSubmit={handleCreate}
            onCancel={() => setIsFormOpen(false)}
            isLoading={createDebt.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Debt Dialog */}
      <Dialog open={!!editingDebt} onOpenChange={() => setEditingDebt(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Debt</DialogTitle>
          </DialogHeader>
          {editingDebt && (
            <DebtForm
              defaultValues={{
                name: editingDebt.name,
                balance: editingDebt.balance / 100,
                interestRate: editingDebt.interestRate * 100,
                minimumPayment: editingDebt.minimumPayment / 100,
              }}
              onSubmit={handleUpdate}
              onCancel={() => setEditingDebt(null)}
              isLoading={updateDebt.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
