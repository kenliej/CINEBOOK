import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

export const AUTH_STORAGE_KEY = 'cinebook_session'

export type SessionUser = {
  id: number | string
  email: string
  first_name?: string
  last_name?: string
  name?: string
  role?: string
  avatar_url?: string
}

export type AuthSession = {
  token: string
  expiresAt: number
  user: SessionUser
}

function emitAuthChanged(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth:changed'))
  }
}

export function getAuthSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null

    const session = JSON.parse(raw) as Partial<AuthSession>
    if (!session?.token || typeof session.expiresAt !== 'number' || session.expiresAt <= Date.now()) {
      clearAuthSession()
      return null
    }

    return {
      token: session.token,
      expiresAt: session.expiresAt,
      user: session.user ?? {
        id: 'guest',
        email: '',
        name: 'Guest',
      },
    }
  } catch {
    clearAuthSession()
    return null
  }
}

export function isLoggedIn(): boolean {
  return Boolean(getAuthSession()?.token)
}

export function isAdmin(): boolean {
  const session = getAuthSession()
  const role = String(session?.user?.role ?? '').toLowerCase()
  return role === 'admin' || role === 'administrator'
}

export function saveAuthSession(session: Partial<AuthSession> & { token: string; user: SessionUser }): void {
  const normalizedSession: AuthSession = {
    token: session.token,
    expiresAt: typeof session.expiresAt === 'number' ? session.expiresAt : Date.now() + 1000 * 60 * 60 * 24 * 7,
    user: session.user,
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(normalizedSession))
  emitAuthChanged()
}

export function clearAuthSession(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY)
  emitAuthChanged()
}

export function getAuthHeaders(): Record<string, string> {
  const session = getAuthSession()
  return session?.token ? { Authorization: `Bearer ${session.token}` } : {}
}

export function useAuthState(): boolean {
  const [loggedIn, setLoggedIn] = useState<boolean>(() => isLoggedIn())

  useEffect(() => {
    const syncAuth = () => setLoggedIn(isLoggedIn())
    syncAuth()
    window.addEventListener('storage', syncAuth)
    window.addEventListener('auth:changed', syncAuth)

    return () => {
      window.removeEventListener('storage', syncAuth)
      window.removeEventListener('auth:changed', syncAuth)
    }
  }, [])

  return loggedIn
}

export function useAuthGuard({ redirectTo = '/auth' }: { redirectTo?: string } = {}) {
  const navigate = useNavigate()
  const isAuthenticated = useAuthState()

  const requireAuth = (onAllowed?: () => void) => {
    if (!isAuthenticated) {
      navigate(redirectTo, { replace: true })
      return false
    }

    onAllowed?.()
    return true
  }

  const redirectIfAuthenticated = () => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }

  return {
    isAuthenticated,
    requireAuth,
    redirectIfAuthenticated,
  }
}
