import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { usePeriodStore } from '@/stores/period-store'
import { useGetOrCreateBudgetPeriod } from '@/hooks/use-budget-periods'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'

export function BudgetPeriodSelector() {
  const { year, month, goToPreviousMonth, goToNextMonth, goToCurrentMonth } = usePeriodStore()
  const getOrCreatePeriod = useGetOrCreateBudgetPeriod()

  const isCurrentMonth =
    year === new Date().getFullYear() && month === new Date().getMonth() + 1

  // Ensure budget period exists when month changes
  useEffect(() => {
    getOrCreatePeriod.mutate({ year, month })
  }, [year, month])

  const displayDate = new Date(year, month - 1)

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <button
        onClick={goToCurrentMonth}
        className="min-w-[140px] text-center font-semibold hover:underline"
        title={isCurrentMonth ? 'Current month' : 'Click to go to current month'}
      >
        {format(displayDate, 'MMMM yyyy')}
      </button>

      <Button variant="ghost" size="icon" onClick={goToNextMonth}>
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  )
}
