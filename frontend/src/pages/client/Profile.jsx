import { useEffect, useState } from 'react'
import DashboardPage from '../../components/DashboardPage.jsx'
import PasswordInput from '../../components/PasswordInput.jsx'
import { useAuth } from '../../context/useAuth.js'
import { apiJson, ApiError } from '../../lib/api.js'

const inputClass =
  'mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-500/10'

export default function ClientProfile() {
  const { user, token, setSession } = useAuth()
  const [name, setName] = useState(() => user?.name ?? '')

  useEffect(() => {
    if (user?.name != null) setName(user.name)
  }, [user?.id, user?.name])

  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setMessage('')
    setError('')

    const nameTrimmed = name.trim()
    const nameChanged = nameTrimmed !== (user?.name ?? '').trim()
    const wantsPassword =
      password.length > 0 ||
      confirmPassword.length > 0 ||
      currentPassword.length > 0

    if (wantsPassword) {
      if (!currentPassword) {
        setError('Enter your current password to set a new one.')
        return
      }
      if (password.length < 8) {
        setError('New password must be at least 8 characters.')
        return
      }
      if (password !== confirmPassword) {
        setError('New password and confirmation do not match.')
        return
      }
    }

    if (!nameChanged && !wantsPassword) {
      setMessage('No changes to save.')
      return
    }

    if (wantsPassword && !password) {
      setError('Enter a new password or clear the current password field.')
      return
    }

    const body = {}
    if (nameChanged) {
      body.name = nameTrimmed
    }
    if (wantsPassword && password) {
      body.currentPassword = currentPassword
      body.newPassword = password
    }

    if (Object.keys(body).length === 0) {
      setMessage('No changes to save.')
      return
    }

    setLoading(true)
    try {
      const data = await apiJson('/auth/me', {
        method: 'PATCH',
        body,
        token,
      })
      if (data?.user) {
        setSession(token, {
          ...data.user,
          role: data.user.role || 'client',
        })
      }
      setCurrentPassword('')
      setPassword('')
      setConfirmPassword('')
      setMessage(
        wantsPassword && password
          ? 'Profile and password updated successfully.'
          : 'Profile updated successfully.',
      )
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not update profile.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardPage
      title="Profile"
      subtitle="Personal information and preferences."
    >
      <form className="max-w-lg space-y-5" onSubmit={onSubmit}>
        <div>
          <label
            className="text-xs font-semibold text-zinc-700"
            htmlFor="profile-name"
          >
            Full name
          </label>
          <input
            id="profile-name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label
            className="text-xs font-semibold text-zinc-700"
            htmlFor="profile-email"
          >
            Email
          </label>
          <input
            id="profile-email"
            name="email"
            type="email"
            autoComplete="email"
            value={user?.email ?? ''}
            readOnly
            disabled
            className={`${inputClass} cursor-not-allowed bg-zinc-50 text-zinc-600`}
          />
          <p className="mt-1 text-xs text-zinc-500">
            Email is tied to your account. Contact support to change it.
          </p>
        </div>

        <div className="border-t border-zinc-100 pt-5">
          <p className="text-sm font-semibold text-zinc-900">Change password</p>
          <p className="mt-1 text-xs text-zinc-500">
            Enter your current password, then a new password (at least 8
            characters). Leave all password fields blank to keep your current
            password.
          </p>
          <div className="mt-4 space-y-4">
            <PasswordInput
              id="profile-current-password"
              label="Current password"
              name="current-password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
            />
            <PasswordInput
              id="profile-password"
              label="New password"
              name="new-password"
              autoComplete="new-password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <PasswordInput
              id="profile-password-confirm"
              label="Confirm new password"
              name="confirm-password"
              autoComplete="new-password"
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
        </div>

        {error ? (
          <p
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        {message ? (
          <p
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
            role="status"
          >
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading || !token}
          className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30 disabled:pointer-events-none disabled:opacity-60"
        >
          {loading ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </DashboardPage>
  )
}
