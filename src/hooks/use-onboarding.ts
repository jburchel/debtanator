import { useEnvelopes } from './use-envelopes'
import { useSelectedBudgetPeriod } from './use-selected-period'
import { useHouseholdStore } from '@/stores/household-store'

export function useOnboarding() {
  const { household, loading: householdLoading } = useHouseholdStore()
  const { data: envelopes, isLoading: envelopesLoading } = useEnvelopes()
  const { data: period, isLoading: periodLoading } = useSelectedBudgetPeriod()

  const isLoading = householdLoading || envelopesLoading || periodLoading

  // User needs onboarding if they have no envelopes
  const needsOnboarding = !isLoading && household && (!envelopes || envelopes.length === 0)

  return {
    needsOnboarding,
    isLoading,
    hasEnvelopes: (envelopes?.length ?? 0) > 0,
    hasIncome: Number(period?.total_income ?? 0) > 0,
  }
}
