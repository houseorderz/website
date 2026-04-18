import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import Navbar from '../components/Navbar.jsx'

function userInitials(name) {
  const t = name?.trim()
  if (!t) return '?'
  const parts = t.split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return t.slice(0, 2).toUpperCase()
}

export default function DashboardShell({ navGroups, roleBadge }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <div className="flex min-h-0 flex-1 flex-col bg-zinc-100/80 lg:flex-row">
      <aside className="flex w-full shrink-0 flex-col border-b border-zinc-200 bg-white shadow-sm lg:w-64 lg:border-b-0 lg:border-e">
        <NavLink
          to="/"
          className="flex h-14 items-center gap-2 border-b border-zinc-100 px-4 transition hover:bg-zinc-50 sm:h-16 sm:px-5"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-orange-500 text-sm font-bold text-white">
            G
          </span>
          <div>
            <p className="text-sm font-bold text-zinc-900">Genius Shop</p>
            <p className="text-[11px] font-medium text-orange-600">{roleBadge}</p>
          </div>
        </NavLink>

        <nav className="max-h-[40vh] flex-1 overflow-y-auto overflow-x-auto px-2 py-3 lg:max-h-none lg:px-3 lg:py-4">
          {navGroups.map((group, gi) => (
            <div
              key={gi}
              className={
                gi > 0
                  ? 'mt-2 border-t border-zinc-100 pt-2 lg:mt-4 lg:pt-4'
                  : ''
              }
            >
              <ul className="flex flex-wrap gap-1 lg:flex-col lg:gap-0 lg:space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.to} className="lg:w-full">
                      <NavLink
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                          [
                            'flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium transition sm:gap-3 sm:px-3 sm:py-2.5 sm:text-sm',
                            isActive
                              ? 'border-s-4 border-orange-500 bg-orange-50 text-orange-900 lg:-ms-px lg:ps-[11px]'
                              : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900',
                          ].join(' ')
                        }
                      >
                        <Icon />
                        <span className="whitespace-nowrap">{item.label}</span>
                      </NavLink>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="flex flex-wrap gap-2 border-t border-zinc-100 p-2 sm:p-3">
          <NavLink
            to="/contact"
            className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 sm:gap-3 sm:px-3 sm:py-2.5 sm:text-sm"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" className="shrink-0">
              <circle cx="12" cy="12" r="10" />
              <path d="M9 9a3 3 0 1 1 4 2.8c-.6.4-1 1-1 1.7V14" />
              <path d="M12 17h.01" />
            </svg>
            Help Desk
          </NavLink>
          <button
            type="button"
            onClick={() => {
              logout()
              navigate('/')
            }}
            className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-orange-600 transition hover:bg-orange-50 sm:gap-3 sm:px-3 sm:py-2.5 sm:text-sm lg:mt-1 lg:w-full"
          >
            Log Out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:min-h-0">
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-zinc-200 bg-white px-4 sm:px-6 lg:px-8">
          <div className="hidden min-w-0 flex-1 md:block">
            <div className="relative max-w-xl">
              <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-zinc-400">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
              </span>
              <input
                type="search"
                placeholder="Search..."
                className="w-full rounded-full border border-zinc-200 bg-zinc-50 py-2 ps-10 pe-4 text-sm text-zinc-900 outline-none ring-orange-500/20 focus:border-orange-300 focus:bg-white focus:ring-2"
              />
            </div>
          </div>
          <div className="ms-auto flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="relative rounded-full p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
              aria-label="Notifications"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
              </svg>
              <span className="absolute end-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>
            <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 py-1 pe-3 ps-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-200 text-xs font-bold text-zinc-700">
                {userInitials(user?.name)}
              </div>
              <div className="hidden min-w-0 sm:block">
                <p className="truncate text-sm font-semibold text-zinc-900">{user?.name}</p>
                <p className="text-[11px] text-zinc-500">{roleBadge}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      </div>
    </div>
  )
}
