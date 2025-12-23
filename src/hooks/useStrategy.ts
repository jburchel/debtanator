import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { settingsRepository } from '@/lib/repository'
import type { PayoffStrategy } from '@/lib/types'

export function useStrategy() {
  return useQuery({
    queryKey: ['strategy'],
    queryFn: () => settingsRepository.getStrategy(),
  })
}

export function useUpdateStrategy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (strategy: PayoffStrategy) => settingsRepository.setStrategy(strategy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategy'] })
    },
  })
}
