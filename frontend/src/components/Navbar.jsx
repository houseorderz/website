import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { Container } from './Container.jsx'

const primaryLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/products', label: 'Product' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

const pagesLinks = [
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/login', label: 'Login' },
  { to: '/register', label: 'Register' },
]

function NavItem({ to, label, end, onNavigate }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          'px-1 py-2 text-xs font-semibold uppercase tracking-wide transition',
          isActive
            ? 'text-zinc-900'
            : 'text-zinc-600 hover:text-zinc-900',
        ].join(' ')
      }
    >
      {label}
    </NavLink>
  )
}

function IconButton({ label, children }) {
  return (
    <button
      type="button"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/30"
      aria-label={label}
    >
      {children}
    </button>
  )
}

export default function Navbar() {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [pagesOpen, setPagesOpen] = useState(false)

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false)
        setPagesOpen(false)
      }
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white">
      <div className="bg-orange-500 text-white">
        <Container className="flex h-9 items-center justify-between gap-3 text-[11px]">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="opacity-90">Contact &amp; Support:</span>
            <span className="font-semibold">00 000 000 000</span>
          </div>

          <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <span className="hidden max-w-[140px] truncate text-white/90 sm:inline">
                    Hi, {user?.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      logout()
                      navigate('/')
                    }}
                    className="rounded-sm border border-white/50 px-2 py-0.5 font-semibold text-white/95 hover:bg-white/10"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/register"
                    className="rounded-sm border border-white/50 px-2 py-0.5 font-semibold text-white/95 hover:bg-white/10"
                  >
                    Sign up
                  </NavLink>
                  <NavLink
                    to="/login"
                    className="rounded-sm border border-white/50 px-2 py-0.5 font-semibold text-white/95 hover:bg-white/10"
                  >
                    Sign in
                  </NavLink>
                </>
              )}
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <button
                type="button"
                className="inline-flex items-center gap-1 text-white/95 hover:text-white"
              >
                <span>English</span>
                <svg
                  viewBox="0 0 20 20"
                  width="14"
                  height="14"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.24 4.5a.75.75 0 0 1-1.08 0l-4.24-4.5a.75.75 0 0 1 .02-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <span className="h-4 w-px bg-white/40" />
              <button
                type="button"
                className="inline-flex items-center gap-1 text-white/95 hover:text-white"
              >
                <span>USD</span>
                <svg
                  viewBox="0 0 20 20"
                  width="14"
                  height="14"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.24 4.5a.75.75 0 0 1-1.08 0l-4.24-4.5a.75.75 0 0 1 .02-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <span className="h-4 w-px bg-white/40" />
              <button
                type="button"
                className="inline-flex items-center gap-1 text-white/95 hover:text-white"
                aria-label="My account"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 21a8 8 0 0 0-16 0" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>My Account</span>
              </button>
            </div>
          </div>
        </Container>
      </div>

      <Container className="flex h-16 items-center justify-between gap-4">
        <NavLink
          to="/"
          className="text-lg font-extrabold tracking-tight text-zinc-900"
        >
          Genius <span className="font-black">Shop</span>
        </NavLink>

        <nav className="hidden items-center gap-6 md:flex">
          {primaryLinks.slice(0, 2).map((l) => (
            <NavItem key={l.to} {...l} />
          ))}

          <div className="relative">
            <button
              type="button"
              className="inline-flex items-center gap-1 px-1 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-600 transition hover:text-zinc-900"
              aria-haspopup="menu"
              aria-expanded={pagesOpen}
              onClick={() => setPagesOpen((v) => !v)}
            >
              Pages
              <svg
                viewBox="0 0 20 20"
                width="14"
                height="14"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.24 4.5a.75.75 0 0 1-1.08 0l-4.24-4.5a.75.75 0 0 1 .02-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {pagesOpen ? (
              <div
                role="menu"
                className="absolute left-0 top-full mt-2 w-44 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg"
              >
                <div className="p-2">
                  {pagesLinks.map((l) => (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      onClick={() => setPagesOpen(false)}
                      className={({ isActive }) =>
                        [
                          'block rounded-lg px-3 py-2 text-sm transition',
                          isActive
                            ? 'bg-zinc-900 text-white'
                            : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900',
                        ].join(' ')
                      }
                    >
                      {l.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {primaryLinks.slice(2).map((l) => (
            <NavItem key={l.to} {...l} />
          ))}

       
        </nav>

        <div className="hidden items-center gap-1 md:flex">
          <IconButton label="Search">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </IconButton>
          <IconButton label="Wishlist">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
            </svg>
          </IconButton>
          <IconButton label="Cart">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 6h15l-1.5 9h-13z" />
              <path d="M6 6l-2-2H2" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>
          </IconButton>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-md p-2 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/40 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {open ? (
              <>
                <path d="M18 6 6 18" />
                <path d="M6 6l12 12" />
              </>
            ) : (
              <>
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </>
            )}
          </svg>
        </button>
      </Container>

      {open ? (
        <div className="border-t border-zinc-200 bg-white md:hidden">
          <Container className="py-4">
            <div className="grid gap-2">
              {primaryLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    [
                      'rounded-lg px-3 py-2 text-sm font-medium transition',
                      isActive
                        ? 'bg-zinc-900 text-white'
                        : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900',
                    ].join(' ')
                  }
                >
                  {l.label}
                </NavLink>
              ))}

              <div className="mt-2 border-t border-zinc-200 pt-3">
                <p className="px-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Pages
                </p>
                <div className="mt-2 grid gap-2">
                  {pagesLinks.map((l) => (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        [
                          'rounded-lg px-3 py-2 text-sm font-medium transition',
                          isActive
                            ? 'bg-zinc-900 text-white'
                            : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900',
                        ].join(' ')
                      }
                    >
                      {l.label}
                    </NavLink>
                  ))}
                </div>
              </div>

              <div className="mt-2 flex items-center gap-2 px-1">
                <IconButton label="Search">
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.3-4.3" />
                  </svg>
                </IconButton>
                <IconButton label="Wishlist">
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
                  </svg>
                </IconButton>
                <IconButton label="Cart">
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M6 6h15l-1.5 9h-13z" />
                    <path d="M6 6l-2-2H2" />
                    <circle cx="9" cy="20" r="1" />
                    <circle cx="18" cy="20" r="1" />
                  </svg>
                </IconButton>
              </div>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  )
}

