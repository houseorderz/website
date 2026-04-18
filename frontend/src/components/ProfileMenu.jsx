import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

function userInitials(name) {
  const t = name?.trim()
  if (!t) return '?'
  const parts = t.split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return t.slice(0, 2).toUpperCase()
}

export default function ProfileMenu({ user }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const navigate = useNavigate()
  const { logout } = useAuth()

  useEffect(() => {
    if (!open) return
    function onPointerDown(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-zinc-200 text-sm font-semibold text-zinc-800 ring-2 ring-white transition hover:bg-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/30"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={
          user?.name ? `Account menu for ${user.name}` : 'Open account menu'
        }
      >
        {userInitials(user?.name)}
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute end-0 top-full z-[60] mt-2 w-48 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg"
        >
          <NavLink
            role="menuitem"
            to={
              (user?.role || 'client') === 'admin'
                ? '/admin/overview'
                : '/client/overview'
            }
            onClick={close}
            className={({ isActive }) =>
              [
                'block px-4 py-2.5 text-sm font-medium transition',
                isActive
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900',
              ].join(' ')
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            role="menuitem"
            to={
              (user?.role || 'client') === 'admin'
                ? '/admin/profile'
                : '/client/profile'
            }
            onClick={close}
            className={({ isActive }) =>
              [
                'block px-4 py-2.5 text-sm font-medium transition',
                isActive
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900',
              ].join(' ')
            }
          >
            Profile
          </NavLink>
          <div className="my-1 border-t border-zinc-200" />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              logout()
              close()
              navigate('/')
            }}
            className="block w-full px-4 py-2.5 text-start text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      ) : null}
    </div>
  )
}
