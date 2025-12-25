import { create } from 'zustand'

interface PeriodState {
  year: number
  month: number
  setYearMonth: (year: number, month: number) => void
  goToPreviousMonth: () => void
  goToNextMonth: () => void
  goToCurrentMonth: () => void
}

const now = new Date()

export const usePeriodStore = create<PeriodState>((set) => ({
  year: now.getFullYear(),
  month: now.getMonth() + 1,
  setYearMonth: (year, month) => set({ year, month }),
  goToPreviousMonth: () =>
    set((state) => {
      if (state.month === 1) {
        return { year: state.year - 1, month: 12 }
      }
      return { month: state.month - 1 }
    }),
  goToNextMonth: () =>
    set((state) => {
      if (state.month === 12) {
        return { year: state.year + 1, month: 1 }
      }
      return { month: state.month + 1 }
    }),
  goToCurrentMonth: () =>
    set({
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
    }),
}))
