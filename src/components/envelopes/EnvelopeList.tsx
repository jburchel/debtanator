import { useNavigate } from 'react-router-dom'
import { EnvelopeCard } from './EnvelopeCard'
import { CreateEnvelopeDialog } from './CreateEnvelopeDialog'
import { useEnvelopeBalances } from '@/hooks/use-allocations'
import { useSelectedBudgetPeriod } from '@/hooks/use-selected-period'
import { Skeleton } from '@/components/ui/skeleton'

export function EnvelopeList() {
  const navigate = useNavigate()
  const { data: period, isLoading: periodLoading } = useSelectedBudgetPeriod()
  const { data: envelopes, isLoading: envelopesLoading } = useEnvelopeBalances(period?.id)

  const isLoading = periodLoading || envelopesLoading

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[160px]" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {envelopes?.map((envelope) => (
        <EnvelopeCard
          key={envelope.id}
          name={envelope.name}
          emoji={envelope.emoji}
          color={envelope.color}
          allocated={envelope.allocated}
          spent={envelope.spent}
          available={envelope.available}
          onClick={() => navigate(`/envelopes/${envelope.id}`)}
        />
      ))}
      <CreateEnvelopeDialog />
    </div>
  )
}
