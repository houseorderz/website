import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PasswordInput from '../components/PasswordInput.jsx'
import { useAuth } from '../context/useAuth.js'
import { apiJson, ApiError } from '../lib/api.js'

export default function Register() {
  const navigate = useNavigate()
  const { setSession } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await apiJson('/auth/register', {
        method: 'POST',
        body: { name, email, password },
      })
      const user = { ...data.user, role: data.user.role || 'client' }
      setSession(data.token, user)
      navigate('/client/overview', { replace: true })
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
          Create your Wearify account
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Join to save favorites and enjoy a faster checkout.
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
            htmlFor="register-name"
          >
            Name
          </label>
          <input
            id="register-name"
            name="name"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-500/10"
            placeholder="Your name"
          />
        </div>
        <div>
          <label
            className="text-xs font-semibold text-zinc-700"
            htmlFor="register-email"
          >
            Email
          </label>
          <input
            id="register-email"
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
          id="register-password"
          label="Password"
          name="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30 disabled:pointer-events-none disabled:opacity-60"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>

        <p className="text-center text-sm text-zinc-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-orange-600">
            Log in
          </Link>
        </p>
      </form>
    </div>
  )
}
