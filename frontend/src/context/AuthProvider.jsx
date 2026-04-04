import { useCallback, useMemo, useState } from 'react'
import { AuthContext } from './auth-context.js'

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
      return { token: data.token, user: data.user }
    }
  } catch {
    /* ignore */
  }
  return { token: null, user: null }
}

export function AuthProvider({ children }) {
  const [{ token, user }, setAuth] = useState(() => readStoredSession())

  const setSession = useCallback((nextToken, nextUser) => {
    setAuth({ token: nextToken, user: nextUser })
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: nextToken, user: nextUser }),
    )
  }, [])

  const logout = useCallback(() => {
    setAuth({ token: null, user: null })
    localStorage.removeItem(STORAGE_KEY)
  }, [])

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
