import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface EnvelopeCardProps {
  name: string
  emoji?: string | null
  color?: string | null
  allocated: number
  spent: number
  available: number
  onClick?: () => void
}

export function EnvelopeCard({
  name,
  emoji,
  allocated,
  spent,
  available,
  onClick,
}: EnvelopeCardProps) {
  const percentSpent = allocated > 0 ? Math.min((spent / allocated) * 100, 100) : 0
  const isOverspent = available < 0

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        isOverspent && 'border-destructive'
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          {emoji && <span>{emoji}</span>}
          <span className="truncate">{name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span
            className={cn(
              'text-2xl font-bold',
              isOverspent ? 'text-destructive' : 'text-foreground'
            )}
          >
            {formatCurrency(available)}
          </span>
          <span className="text-sm text-muted-foreground">available</span>
        </div>

        <Progress
          value={percentSpent}
          className={cn('h-2', isOverspent && '[&>div]:bg-destructive')}
        />

        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{formatCurrency(spent)} spent</span>
          <span>{formatCurrency(allocated)} budgeted</span>
        </div>
      </CardContent>
    </Card>
  )
}
