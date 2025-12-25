import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useCreateEnvelope } from '@/hooks/use-envelopes'
import { useGetOrCreateBudgetPeriod, useUpdateBudgetPeriod } from '@/hooks/use-budget-periods'
import { useUpsertAllocation } from '@/hooks/use-allocations'
import { Check, ArrowRight, ArrowLeft } from 'lucide-react'

const ENVELOPE_TEMPLATES = [
  { name: 'Housing', emoji: '🏠', suggested: 30 },
  { name: 'Groceries', emoji: '🛒', suggested: 15 },
  { name: 'Transportation', emoji: '🚗', suggested: 10 },
  { name: 'Utilities', emoji: '💡', suggested: 5 },
  { name: 'Healthcare', emoji: '💊', suggested: 5 },
  { name: 'Entertainment', emoji: '🎮', suggested: 5 },
  { name: 'Dining Out', emoji: '🍔', suggested: 5 },
  { name: 'Savings', emoji: '💰', suggested: 10 },
  { name: 'Clothing', emoji: '👕', suggested: 5 },
  { name: 'Personal Care', emoji: '💄', suggested: 3 },
  { name: 'Gifts', emoji: '🎁', suggested: 2 },
  { name: 'Miscellaneous', emoji: '📦', suggested: 5 },
]

type Step = 'welcome' | 'income' | 'envelopes' | 'allocate' | 'complete'

export function Onboarding() {
  const navigate = useNavigate()
  const createEnvelope = useCreateEnvelope()
  const getOrCreatePeriod = useGetOrCreateBudgetPeriod()
  const updateBudgetPeriod = useUpdateBudgetPeriod()
  const upsertAllocation = useUpsertAllocation()

  const [step, setStep] = useState<Step>('welcome')
  const [income, setIncome] = useState('')
  const [selectedTemplates, setSelectedTemplates] = useState<Set<string>>(new Set())
  const [allocations, setAllocations] = useState<Record<string, string>>({})
  const [createdEnvelopeIds, setCreatedEnvelopeIds] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const steps: Step[] = ['welcome', 'income', 'envelopes', 'allocate', 'complete']
  const currentStepIndex = steps.indexOf(step)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const toggleTemplate = (name: string) => {
    const newSelected = new Set(selectedTemplates)
    if (newSelected.has(name)) {
      newSelected.delete(name)
    } else {
      newSelected.add(name)
    }
    setSelectedTemplates(newSelected)
  }

  const handleCreateEnvelopes = async () => {
    setIsSubmitting(true)
    const ids: Record<string, string> = {}

    for (const name of selectedTemplates) {
      const template = ENVELOPE_TEMPLATES.find((t) => t.name === name)
      if (template) {
        const result = await createEnvelope.mutateAsync({
          name: template.name,
          emoji: template.emoji,
        })
        ids[name] = result.id

        // Pre-fill allocation based on income percentage
        const incomeNum = parseFloat(income) || 0
        const suggestedAmount = Math.round((template.suggested / 100) * incomeNum)
        setAllocations((prev) => ({ ...prev, [name]: String(suggestedAmount) }))
      }
    }

    setCreatedEnvelopeIds(ids)
    setIsSubmitting(false)
    setStep('allocate')
  }

  const handleSaveAllocations = async () => {
    setIsSubmitting(true)

    const now = new Date()
    const period = await getOrCreatePeriod.mutateAsync({
      year: now.getFullYear(),
      month: now.getMonth() + 1,
    })

    // Save income
    const incomeNum = parseFloat(income) || 0
    if (incomeNum > 0) {
      await updateBudgetPeriod.mutateAsync({
        id: period.id,
        total_income: incomeNum,
      })
    }

    // Save allocations
    for (const [name, amount] of Object.entries(allocations)) {
      const envelopeId = createdEnvelopeIds[name]
      if (envelopeId && amount) {
        await upsertAllocation.mutateAsync({
          envelope_id: envelopeId,
          budget_period_id: period.id,
          allocated_amount: parseFloat(amount) || 0,
        })
      }
    }

    setIsSubmitting(false)
    setStep('complete')
  }

  const totalAllocated = Object.values(allocations).reduce(
    (sum, val) => sum + (parseFloat(val) || 0),
    0
  )
  const incomeNum = parseFloat(income) || 0
  const remaining = incomeNum - totalAllocated

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <Progress value={progress} className="mb-4" />
          {step === 'welcome' && (
            <>
              <CardTitle className="text-2xl">Welcome to Envelope Budget! 👋</CardTitle>
              <CardDescription>
                Let's set up your budget in just a few steps. We'll help you organize your money
                using the envelope method.
              </CardDescription>
            </>
          )}
          {step === 'income' && (
            <>
              <CardTitle>What's your monthly income?</CardTitle>
              <CardDescription>
                Enter your total take-home pay for the month. This helps us suggest envelope
                allocations.
              </CardDescription>
            </>
          )}
          {step === 'envelopes' && (
            <>
              <CardTitle>Choose your envelopes</CardTitle>
              <CardDescription>
                Select the categories you want to budget for. You can add more later.
              </CardDescription>
            </>
          )}
          {step === 'allocate' && (
            <>
              <CardTitle>Allocate your budget</CardTitle>
              <CardDescription>
                Assign money to each envelope. We've suggested amounts based on common budgeting
                guidelines.
              </CardDescription>
            </>
          )}
          {step === 'complete' && (
            <>
              <CardTitle className="text-2xl">You're all set! 🎉</CardTitle>
              <CardDescription>
                Your budget is ready. Start tracking your expenses and watch your financial goals
                come to life.
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent>
          {step === 'welcome' && (
            <div className="space-y-4 text-center py-8">
              <div className="text-6xl">💰</div>
              <p className="text-muted-foreground">
                The envelope method helps you give every dollar a job, so you always know where
                your money is going.
              </p>
            </div>
          )}

          {step === 'income' && (
            <div className="space-y-4 py-4">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">
                  $
                </span>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="pl-8 text-2xl h-14"
                  placeholder="0.00"
                  autoFocus
                />
              </div>
            </div>
          )}

          {step === 'envelopes' && (
            <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto py-2">
              {ENVELOPE_TEMPLATES.map((template) => (
                <button
                  key={template.name}
                  onClick={() => toggleTemplate(template.name)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    selectedTemplates.has(template.name)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{template.emoji}</span>
                    <span className="font-medium">{template.name}</span>
                    {selectedTemplates.has(template.name) && (
                      <Check className="h-4 w-4 ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === 'allocate' && (
            <div className="space-y-4 py-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Income: {formatCurrency(incomeNum)}</span>
                <span className={remaining < 0 ? 'text-destructive' : ''}>
                  Remaining: {formatCurrency(remaining)}
                </span>
              </div>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {Array.from(selectedTemplates).map((name) => {
                  const template = ENVELOPE_TEMPLATES.find((t) => t.name === name)
                  return (
                    <div key={name} className="flex items-center gap-3">
                      <span className="text-xl">{template?.emoji}</span>
                      <Label className="flex-1">{name}</Label>
                      <div className="relative w-28">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                          $
                        </span>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={allocations[name] || ''}
                          onChange={(e) =>
                            setAllocations((prev) => ({ ...prev, [name]: e.target.value }))
                          }
                          className="pl-6 text-right"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {step === 'complete' && (
            <div className="space-y-4 text-center py-8">
              <div className="text-6xl">✨</div>
              <div className="space-y-2">
                <p className="font-medium">Your budget summary:</p>
                <p className="text-muted-foreground">
                  {selectedTemplates.size} envelopes • {formatCurrency(totalAllocated)} allocated
                </p>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          {step !== 'welcome' && step !== 'complete' && (
            <Button
              variant="outline"
              onClick={() => setStep(steps[currentStepIndex - 1])}
              disabled={isSubmitting}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          {step === 'welcome' && <div />}

          {step === 'welcome' && (
            <Button onClick={() => setStep('income')}>
              Get Started
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}

          {step === 'income' && (
            <Button onClick={() => setStep('envelopes')} disabled={!income}>
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}

          {step === 'envelopes' && (
            <Button
              onClick={handleCreateEnvelopes}
              disabled={selectedTemplates.size === 0 || isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Continue'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}

          {step === 'allocate' && (
            <Button onClick={handleSaveAllocations} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Complete Setup'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}

          {step === 'complete' && (
            <Button onClick={() => navigate('/')} className="w-full">
              Go to Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
