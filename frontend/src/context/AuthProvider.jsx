import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './auth-context.js'
import { apiJson, ApiError } from '../lib/api.js'

const STORAGE_KEY = 'wearify_auth'

function readStoredSession() {
  if (typeof window === 'undefined') {
    return { token: null, user: null }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { token: null, user: null }
    const data = JSON.parse(raw)
    if (data?.token && data?.user) {
      return {
        token: data.token,
        user: { ...data.user, role: data.user.role || 'client' },
      }
    }
  } catch {
    /* ignore */
  }
  return { token: null, user: null }
}

export function AuthProvider({ children }) {
  const [{ token, user }, setAuth] = useState(() => readStoredSession())

  const setSession = useCallback((nextToken, nextUser) => {
    const user = nextUser
      ? { ...nextUser, role: nextUser.role || 'client' }
      : null
    setAuth({ token: nextToken, user })
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: nextToken, user }),
    )
  }, [])

  const logout = useCallback(() => {
    setAuth({ token: null, user: null })
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  useEffect(() => {
    if (!token) return
    let cancelled = false
    ;(async () => {
      try {
        const data = await apiJson('/auth/me', { token })
        if (cancelled || !data?.user) return
        setSession(token, {
          ...data.user,
          role: data.user.role || 'client',
        })
      } catch (err) {
        if (cancelled) return
        if (err instanceof ApiError && err.status === 401) {
          logout()
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [token, setSession, logout])

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      setSession,
      logout,
    }),
    [token, user, setSession, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
