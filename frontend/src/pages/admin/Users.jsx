import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'
import DashboardPage from '../../components/DashboardPage.jsx'
import PasswordInput from '../../components/PasswordInput.jsx'
import { useAuth } from '../../context/useAuth.js'
import { useToast } from '../../context/useToast.js'
import { apiJson, ApiError } from '../../lib/api.js'

function userInitials(name) {
  const t = name?.trim()
  if (!t) return '?'
  const parts = t.split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return t.slice(0, 2).toUpperCase()
}

function formatJoined(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function roleBadgeClass(role) {
  if (role === 'admin') {
    return 'bg-orange-50 text-orange-900 ring-1 ring-orange-200/80'
  }
  return 'bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200/80'
}

const inputClass =
  'mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-500/10'

export default function AdminUsers() {
  const { token, user: currentUser } = useAuth()
  const { showToast } = useToast()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [menuUserId, setMenuUserId] = useState(null)
  const menuRef = useRef(null)

  const [addOpen, setAddOpen] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const [addName, setAddName] = useState('')
  const [addEmail, setAddEmail] = useState('')
  const [addPassword, setAddPassword] = useState('')
  const [addRole, setAddRole] = useState('client')

  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editRole, setEditRole] = useState('client')

  const loadUsers = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setLoadError('')
    try {
      const data = await apiJson('/admin/users', { token })
      setUsers(Array.isArray(data.users) ? data.users : [])
    } catch (err) {
      setLoadError(
        err instanceof ApiError ? err.message : 'Could not load users.',
      )
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  useEffect(() => {
    if (!menuUserId) return
    function onDown(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuUserId(null)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [menuUserId])

  const filtered = useMemo(() => {
    let list = users
    if (filter === 'admin') list = list.filter((u) => u.role === 'admin')
    if (filter === 'client') list = list.filter((u) => u.role === 'client')
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q),
      )
    }
    return list
  }, [users, filter, search])

  function openAdd() {
    setFormError('')
    setAddName('')
    setAddEmail('')
    setAddPassword('')
    setAddRole('client')
    setAddOpen(true)
  }

  function openEdit(u) {
    setMenuUserId(null)
    setFormError('')
    setEditName(u.name)
    setEditEmail(u.email)
    setEditRole(u.role)
    setEditUser(u)
  }

  async function submitAdd(e) {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      await apiJson('/admin/users', {
        method: 'POST',
        token,
        body: {
          name: addName.trim(),
          email: addEmail.trim(),
          password: addPassword,
          role: addRole,
        },
      })
      setAddOpen(false)
      await loadUsers()
      showToast({ message: 'User created successfully.' })
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : 'Could not create user.',
      )
    } finally {
      setSaving(false)
    }
  }

  async function submitEdit(e) {
    e.preventDefault()
    if (!editUser) return
    setFormError('')
    setSaving(true)
    try {
      await apiJson(`/admin/users/${editUser.id}`, {
        method: 'PATCH',
        token,
        body: {
          name: editName.trim(),
          email: editEmail.trim(),
          role: editRole,
        },
      })
      setEditUser(null)
      await loadUsers()
      showToast({ message: 'User updated successfully.' })
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : 'Could not update user.',
      )
    } finally {
      setSaving(false)
    }
  }

  function requestDelete(u) {
    setMenuUserId(null)
    setDeleteTarget(u)
  }

  async function performDelete() {
    if (!token || !deleteTarget) return
    const name = deleteTarget.name
    const id = deleteTarget.id
    try {
      await apiJson(`/admin/users/${id}`, { method: 'DELETE', token })
      setDeleteTarget(null)
      await loadUsers()
      showToast({ message: `“${name}” has been removed.` })
    } catch (err) {
      showToast({
        variant: 'error',
        message:
          err instanceof ApiError ? err.message : 'Could not delete user.',
      })
    }
  }

  return (
    <DashboardPage title="Users" subtitle="Manage customer and staff accounts.">
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative inline-flex items-center gap-2">
              <span className="sr-only">Filter by role</span>
              <span className="pointer-events-none absolute start-3 text-zinc-400">
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none rounded-xl border border-zinc-200 bg-white py-2.5 ps-10 pe-8 text-sm font-medium text-zinc-900 shadow-sm outline-none ring-orange-500/20 focus:border-orange-300 focus:ring-2"
              >
                <option value="all">All users</option>
                <option value="admin">Admins</option>
                <option value="client">Clients</option>
              </select>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={openAdd}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30"
            >
              <span className="text-lg leading-none">+</span>
              Add User
            </button>
            <button
              type="button"
              title="Coming soon"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              Import / Export
            </button>
          </div>
        </div>

        <div className="relative">
          <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-zinc-400">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 ps-10 pe-4 text-sm text-zinc-900 outline-none ring-orange-500/20 focus:border-orange-300 focus:ring-2"
          />
        </div>

        {loading ? (
          <p className="py-12 text-center text-sm text-zinc-500">Loading users…</p>
        ) : loadError ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            {loadError}
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/90">
                  <th className="w-12 px-3 py-3">
                    <span className="sr-only">Select</span>
                    <input type="checkbox" disabled className="rounded border-zinc-300" aria-hidden="true" />
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    User
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Role
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Joined
                  </th>
                  <th className="w-14 px-4 py-3 text-end text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    <span className="inline-flex items-center justify-end gap-1">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                      </svg>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-zinc-100 transition hover:bg-zinc-50/80"
                  >
                    <td className="px-3 py-3 align-middle">
                      <input type="checkbox" disabled className="rounded border-zinc-300" aria-hidden="true" />
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-zinc-200 text-xs font-bold text-zinc-700">
                          {userInitials(u.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-zinc-900">{u.name}</p>
                          <p className="truncate text-xs text-zinc-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${roleBadgeClass(u.role)}`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-middle text-zinc-600">
                      {formatJoined(u.createdAt)}
                    </td>
                    <td className="relative px-4 py-3 text-end align-middle">
                      <div className="relative inline-block text-start" ref={menuUserId === u.id ? menuRef : null}>
                        <button
                          type="button"
                          aria-expanded={menuUserId === u.id}
                          aria-haspopup="menu"
                          aria-label={`Actions for ${u.name}`}
                          onClick={() =>
                            setMenuUserId((id) => (id === u.id ? null : u.id))
                          }
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
                        >
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                            <circle cx="12" cy="5" r="1.5" />
                            <circle cx="12" cy="12" r="1.5" />
                            <circle cx="12" cy="19" r="1.5" />
                          </svg>
                        </button>
                        {menuUserId === u.id ? (
                          <div
                            role="menu"
                            className="absolute end-0 z-20 mt-1 w-36 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg"
                          >
                            <button
                              type="button"
                              role="menuitem"
                              className="block w-full px-4 py-2.5 text-start text-sm font-medium text-zinc-800 hover:bg-zinc-50"
                              onClick={() => openEdit(u)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              disabled={u.id === currentUser?.id}
                              className="block w-full px-4 py-2.5 text-start text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                              onClick={() => requestDelete(u)}
                            >
                              Delete
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 ? (
              <p className="border-t border-zinc-100 px-4 py-10 text-center text-sm text-zinc-500">
                No users match your filters.
              </p>
            ) : null}
          </div>
        )}
      </div>

      {addOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setAddOpen(false)
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-user-title"
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl"
          >
            <h2 id="add-user-title" className="text-lg font-bold text-zinc-900">
              Add user
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Create an account with email and password.
            </p>
            <form className="mt-6 space-y-4" onSubmit={submitAdd}>
              {formError ? (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
                  {formError}
                </p>
              ) : null}
              <div>
                <label className="text-xs font-semibold text-zinc-700" htmlFor="add-name">
                  Name
                </label>
                <input
                  id="add-name"
                  className={inputClass}
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-700" htmlFor="add-email">
                  Email
                </label>
                <input
                  id="add-email"
                  type="email"
                  className={inputClass}
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <PasswordInput
                id="add-password"
                label="Password"
                name="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={addPassword}
                onChange={(e) => setAddPassword(e.target.value)}
                placeholder="••••••••"
              />
              <div>
                <label className="text-xs font-semibold text-zinc-700" htmlFor="add-role">
                  Role
                </label>
                <select
                  id="add-role"
                  value={addRole}
                  onChange={(e) => setAddRole(e.target.value)}
                  className={inputClass}
                >
                  <option value="client">Client</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Create user'}
                </button>
                <button
                  type="button"
                  onClick={() => setAddOpen(false)}
                  className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {editUser ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditUser(null)
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-user-title"
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl"
          >
            <h2 id="edit-user-title" className="text-lg font-bold text-zinc-900">
              Edit user
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Update name, email, or role.
            </p>
            <form className="mt-6 space-y-4" onSubmit={submitEdit}>
              {formError ? (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
                  {formError}
                </p>
              ) : null}
              <div>
                <label className="text-xs font-semibold text-zinc-700" htmlFor="edit-name">
                  Name
                </label>
                <input
                  id="edit-name"
                  className={inputClass}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-700" htmlFor="edit-email">
                  Email
                </label>
                <input
                  id="edit-email"
                  type="email"
                  className={inputClass}
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-700" htmlFor="edit-role">
                  Role
                </label>
                <select
                  id="edit-role"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className={inputClass}
                >
                  <option value="client">Client</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete user?"
        message={
          deleteTarget
            ? `Delete user “${deleteTarget.name}” (${deleteTarget.email})? This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        danger
        onCancel={() => setDeleteTarget(null)}
        onConfirm={performDelete}
      />
    </DashboardPage>
  )
}
