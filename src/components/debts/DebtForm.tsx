import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { debtSchema, type DebtInput } from '@/lib/validation'

interface DebtFormProps {
  defaultValues?: Partial<DebtInput>
  onSubmit: (data: DebtInput) => void
  onCancel?: () => void
  isLoading?: boolean
}

export function DebtForm({ defaultValues, onSubmit, onCancel, isLoading }: DebtFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DebtInput>({
    resolver: zodResolver(debtSchema),
    defaultValues: {
      name: '',
      balance: 0,
      interestRate: 0,
      minimumPayment: 0,
      ...defaultValues,
    },
  })

  const processSubmit = (data: DebtInput) => {
    // Convert dollars to cents for storage
    onSubmit({
      ...data,
      balance: Math.round(data.balance * 100),
      minimumPayment: Math.round(data.minimumPayment * 100),
      interestRate: data.interestRate / 100, // Convert percentage to decimal
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{defaultValues ? 'Edit Debt' : 'Add New Debt'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(processSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g., Chase Visa"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="balance">Current Balance ($)</Label>
            <Input
              id="balance"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              {...register('balance', { valueAsNumber: true })}
            />
            {errors.balance && (
              <p className="text-sm text-red-500">{errors.balance.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="interestRate">Interest Rate (%)</Label>
            <Input
              id="interestRate"
              type="number"
              step="0.01"
              min="0"
              max="100"
              placeholder="18.99"
              {...register('interestRate', { valueAsNumber: true })}
            />
            {errors.interestRate && (
              <p className="text-sm text-red-500">{errors.interestRate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="minimumPayment">Minimum Payment ($)</Label>
            <Input
              id="minimumPayment"
              type="number"
              step="0.01"
              min="0"
              placeholder="25.00"
              {...register('minimumPayment', { valueAsNumber: true })}
            />
            {errors.minimumPayment && (
              <p className="text-sm text-red-500">{errors.minimumPayment.message}</p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Saving...' : defaultValues ? 'Update' : 'Add Debt'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
