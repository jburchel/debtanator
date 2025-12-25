import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from './auth-store'

describe('auth store', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, session: null, loading: true })
  })

  it('starts with loading true and no user', () => {
    const state = useAuthStore.getState()
    expect(state.loading).toBe(true)
    expect(state.user).toBeNull()
    expect(state.session).toBeNull()
  })

  it('setUser updates user and sets loading false', () => {
    const mockUser = { id: '123', email: 'test@example.com' }
    useAuthStore.getState().setUser(mockUser as any)

    const state = useAuthStore.getState()
    expect(state.user).toEqual(mockUser)
    expect(state.loading).toBe(false)
  })

  it('clearUser resets state', () => {
    useAuthStore.getState().setUser({ id: '123' } as any)
    useAuthStore.getState().clearUser()

    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.session).toBeNull()
    expect(state.loading).toBe(false)
  })
})
