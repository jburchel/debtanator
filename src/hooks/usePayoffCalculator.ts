import { useMemo } from 'react'
import { useDebts } from './useDebts'
import { useStrategy } from './useStrategy'
import { calculatePayoff } from '@/lib/calculator'
import type { PayoffProjection } from '@/lib/types'

export function usePayoffCalculator(): {
  projection: PayoffProjection | null
  isLoading: boolean
} {
  const { data: debts, isLoading: debtsLoading } = useDebts()
  const { data: strategy, isLoading: strategyLoading } = useStrategy()

  const projection = useMemo(() => {
    if (!debts || !strategy) return null
    return calculatePayoff(debts, strategy)
  }, [debts, strategy])

  return {
    projection,
    isLoading: debtsLoading || strategyLoading,
  }
}
