import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PasswordInput from '../components/PasswordInput.jsx'
import { useAuth } from '../context/useAuth.js'
import { apiJson, ApiError } from '../lib/api.js'

export default function Login() {
  const navigate = useNavigate()
  const { setSession } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await apiJson('/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      const user = { ...data.user, role: data.user.role || 'client' }
      setSession(data.token, user)
      const next =
        user.role === 'admin' ? '/admin/overview' : '/client/overview'
      navigate(next, { replace: true })
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Something went wrong'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 lg:hidden">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-orange-500/10 text-orange-600 ring-1 ring-orange-500/15">
            W
          </span>
          Wearify
        </div>
        <Link to="/" className="text-sm text-zinc-600 hover:text-zinc-900">
          Back to home
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900">
          Welcome back to Wearify
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Sign in to continue shopping with a clean, modern experience.
        </p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        {error ? (
          <p
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <div>
          <label
            className="text-xs font-semibold text-zinc-700"
            htmlFor="login-email"
          >
            Email
          </label>
          <input
            id="login-email"
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-500/10"
            placeholder="you@example.com"
          />
        </div>

        <PasswordInput
          id="login-password"
          label="Password"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            className="font-semibold text-orange-600 hover:text-orange-700"
          >
            Forgot password?
          </button>

          <label className="inline-flex items-center gap-3 text-xs font-semibold text-zinc-600">
            Remember sign in details
            <span className="relative inline-flex h-6 w-10 items-center rounded-full bg-orange-500/25 ring-1 ring-orange-500/20">
              <span className="inline-block h-5 w-5 translate-x-5 rounded-full bg-orange-500 shadow-sm" />
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30 disabled:pointer-events-none disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Log in'}
        </button>

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-zinc-200" />
          <span className="text-xs font-semibold text-zinc-400">OR</span>
          <span className="h-px flex-1 bg-zinc-200" />
        </div>

        <button
          type="button"
          className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/20"
        >
          <span className="grid h-6 w-6 place-items-center rounded-full bg-zinc-50">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path
                d="M21.35 11.1H12v2.98h5.35c-.23 1.35-1.57 3.97-5.35 3.97-3.22 0-5.84-2.66-5.84-5.95S8.78 6.15 12 6.15c1.83 0 3.06.78 3.76 1.45l2.56-2.46C16.74 3.64 14.6 2.6 12 2.6 6.92 2.6 2.8 6.72 2.8 11.1S6.92 19.6 12 19.6c6.04 0 8.01-4.24 8.01-6.44 0-.43-.05-.75-.12-1.06Z"
                fill="currentColor"
              />
            </svg>
          </span>
          Continue with Google
        </button>

        <p className="text-center text-sm text-zinc-600">
          Don’t have an account?{' '}
          <Link to="/register" className="font-semibold text-orange-600">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}
