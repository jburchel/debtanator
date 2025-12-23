import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { debtRepository } from '@/lib/repository'
import type { DebtInput } from '@/lib/validation'

export function useDebts() {
  return useQuery({
    queryKey: ['debts'],
    queryFn: () => debtRepository.getAll(),
  })
}

export function useDebt(id: string) {
  return useQuery({
    queryKey: ['debts', id],
    queryFn: () => debtRepository.getById(id),
    enabled: !!id,
  })
}

export function useCreateDebt() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: DebtInput) => debtRepository.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] })
    },
  })
}

export function useUpdateDebt() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DebtInput> }) =>
      debtRepository.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] })
    },
  })
}

export function useDeleteDebt() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => debtRepository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] })
    },
  })
}
