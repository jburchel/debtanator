import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Info, TrendingUp, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, Input, Label, Switch } from '@/components/ui'
import { useStrategy, useUpdateStrategy } from '@/hooks'
import { formatCurrency, parseCurrencyInput } from '@/lib/utils'

export function Settings() {
  const { data: strategy, isLoading } = useStrategy()
  const updateStrategy = useUpdateStrategy()

  const [extraPaymentInput, setExtraPaymentInput] = useState('')

  useEffect(() => {
    if (strategy) {
      setExtraPaymentInput(
        strategy.extraPayment > 0
          ? (strategy.extraPayment / 100).toFixed(2)
          : ''
      )
    }
  }, [strategy])

  const handleMethodToggle = (checked: boolean) => {
    if (!strategy) return
    updateStrategy.mutate({
      ...strategy,
      method: checked ? 'avalanche' : 'snowball',
    })
  }

  const handleExtraPaymentBlur = () => {
    if (!strategy) return
    const cents = parseCurrencyInput(extraPaymentInput)
    if (cents !== strategy.extraPayment) {
      updateStrategy.mutate({
        ...strategy,
        extraPayment: cents,
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    )
  }

  const isAvalanche = strategy?.method === 'avalanche'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <SettingsIcon className="h-6 w-6" />
          Settings
        </h1>
        <p className="text-gray-600 mt-1">Configure your debt payoff strategy</p>
      </div>

      {/* Strategy Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            Payoff Method
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="method-toggle" className="text-base font-medium">
                {isAvalanche ? 'Avalanche Method' : 'Snowball Method'}
              </Label>
              <p className="text-sm text-gray-500">
                {isAvalanche
                  ? 'Pay highest interest rate first'
                  : 'Pay smallest balance first'}
              </p>
            </div>
            <Switch
              id="method-toggle"
              checked={isAvalanche}
              onCheckedChange={handleMethodToggle}
            />
          </div>

          {/* Method Explanation Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className={`p-4 rounded-lg border-2 transition-colors ${
              !isAvalanche
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-gray-200 bg-gray-50'
            }`}>
              <h4 className="font-semibold text-gray-900 mb-2">Snowball Method</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Pay smallest debt first</li>
                <li>• Quick wins for motivation</li>
                <li>• Psychologically rewarding</li>
                <li>• May pay more interest overall</li>
              </ul>
            </div>

            <div className={`p-4 rounded-lg border-2 transition-colors ${
              isAvalanche
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-gray-200 bg-gray-50'
            }`}>
              <h4 className="font-semibold text-gray-900 mb-2">Avalanche Method</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Pay highest interest first</li>
                <li>• Mathematically optimal</li>
                <li>• Save more on interest</li>
                <li>• Takes longer to see results</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Extra Payment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-500" />
            Extra Monthly Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="extra-payment">Amount (in addition to minimums)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <Input
                id="extra-payment"
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                className="pl-7"
                value={extraPaymentInput}
                onChange={(e) => setExtraPaymentInput(e.target.value)}
                onBlur={handleExtraPaymentBlur}
              />
            </div>
            <p className="text-sm text-gray-500">
              This amount will be applied to your focus debt each month
            </p>
          </div>

          {strategy && strategy.extraPayment > 0 && (
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
              <p className="text-emerald-800 font-medium">
                You're paying an extra {formatCurrency(strategy.extraPayment)} per month!
              </p>
              <p className="text-sm text-emerald-600 mt-1">
                This accelerates your debt payoff significantly.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">How the Debt Snowball/Avalanche Works</h4>
              <p className="text-sm text-gray-600">
                Both methods pay minimum payments on all debts, then apply any extra money
                to one "focus" debt. When that debt is paid off, its entire payment rolls
                into the next debt, creating a snowball effect that accelerates your payoff.
              </p>
              <p className="text-sm text-gray-600">
                The difference is which debt gets priority: snowball targets the smallest
                balance for quick wins, while avalanche targets the highest interest rate
                to minimize total interest paid.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
