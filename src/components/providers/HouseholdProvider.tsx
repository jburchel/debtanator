import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { useHouseholdStore } from '@/stores/household-store'
import { getOrCreateHousehold } from '@/services/household-service'

interface HouseholdProviderProps {
  children: React.ReactNode
}

export function HouseholdProvider({ children }: HouseholdProviderProps) {
  const { user, loading: authLoading } = useAuthStore()
  const { setHousehold, setLoading } = useHouseholdStore()

  useEffect(() => {
    async function initHousehold() {
      if (authLoading) return

      if (!user) {
        setHousehold(null)
        return
      }

      setLoading(true)
      try {
        const household = await getOrCreateHousehold(user.id, user.email ?? 'User')
        setHousehold(household)
      } catch (error) {
        console.error('Failed to initialize household:', error)
        setHousehold(null)
      }
    }

    initHousehold()
  }, [user, authLoading, setHousehold, setLoading])

  return <>{children}</>
}
