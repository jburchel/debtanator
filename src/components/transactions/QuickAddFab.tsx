import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { TransactionModal } from './TransactionModal'
import { Plus } from 'lucide-react'

export function QuickAddFab() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        size="lg"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">Add transaction</span>
      </Button>
      <TransactionModal open={open} onOpenChange={setOpen} />
    </>
  )
}
