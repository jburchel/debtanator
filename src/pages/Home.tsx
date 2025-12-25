import { useAuthStore } from '@/stores/auth-store'
import { useHouseholdStore } from '@/stores/household-store'
import { EnvelopeList } from '@/components/envelopes/EnvelopeList'
import { BudgetPeriodSelector } from '@/components/budget/BudgetPeriodSelector'
import { BudgetSummary } from '@/components/dashboard/BudgetSummary'
import { IncomeAllocationBar } from '@/components/dashboard/IncomeAllocationBar'
import { QuickAddFab } from '@/components/transactions/QuickAddFab'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { LogOut } from 'lucide-react'

export function Home() {
  const { user } = useAuthStore()
  const { household, loading } = useHouseholdStore()

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{household?.name ?? 'Envelope Budget'}</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <BudgetPeriodSelector />
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 pb-24 space-y-8">
        <BudgetSummary />

        <IncomeAllocationBar />

        <div>
          <div className="mb-4">
            <h2 className="text-xl font-bold">Envelopes</h2>
            <p className="text-sm text-muted-foreground">Click an envelope to view details</p>
          </div>
          <EnvelopeList />
        </div>
      </main>

      <QuickAddFab />
    </div>
  )
}
