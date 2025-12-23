import { Calendar, DollarSign, TrendingDown, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { ProgressRing, PayoffTimeline, StatCard } from '@/components/dashboard'
import { useDebts, usePayoffCalculator } from '@/hooks'
import { formatCurrency } from '@/lib/utils'

export function Dashboard() {
  const { data: debts = [] } = useDebts()
  const { projection, isLoading } = usePayoffCalculator()

  const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0)
  const totalMinimum = debts.reduce((sum, d) => sum + d.minimumPayment, 0)

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const monthsUntilFree = projection?.monthlySchedule.length ?? 0
  const yearsUntilFree = Math.floor(monthsUntilFree / 12)
  const remainingMonths = monthsUntilFree % 12

  const timeUntilFree =
    yearsUntilFree > 0
      ? `${yearsUntilFree}y ${remainingMonths}m`
      : `${remainingMonths} months`

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Track your journey to debt freedom</p>
      </div>

      {debts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No debts added yet.</p>
            <p className="text-gray-400 text-sm mt-1">
              Add your first debt to see your payoff projection!
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Progress Ring */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Total Debt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <span className="text-4xl font-bold text-gray-900">
                  {formatCurrency(totalDebt)}
                </span>
              </div>
              <ProgressRing totalDebt={totalDebt} paidOff={0} />
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              label="Debt Free Date"
              value={projection ? formatDate(projection.debtFreeDate) : '-'}
              sublabel={timeUntilFree}
              icon={Calendar}
            />
            <StatCard
              label="Monthly Payment"
              value={formatCurrency(totalMinimum + (projection ? 0 : 0))}
              sublabel="minimums only"
              icon={DollarSign}
            />
            <StatCard
              label="Interest Saved"
              value={formatCurrency(projection?.interestSaved ?? 0)}
              sublabel="vs minimum payments"
              icon={TrendingDown}
            />
            <StatCard
              label="Total Interest"
              value={formatCurrency(projection?.totalInterestPaid ?? 0)}
              sublabel="over payoff period"
              icon={Target}
            />
          </div>

          {/* Timeline Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Payoff Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <PayoffTimeline schedule={projection?.monthlySchedule ?? []} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
