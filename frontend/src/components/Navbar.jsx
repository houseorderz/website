import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { useCart } from '../context/useCart.js'
import { useWishlist } from '../context/useWishlist.js'
import { Container } from './Container.jsx'
import ProfileMenu from './ProfileMenu.jsx'

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

function CartIcon({ className = 'h-[18px] w-[18px]' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
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
  )
}

function WishlistNavLink({ onNavigate }) {
  const { count } = useWishlist()
  return (
    <NavLink
      to="/client/wishlist"
      onClick={() => onNavigate?.()}
      className={({ isActive }) =>
        [
          'relative inline-flex items-center gap-1.5 rounded-full px-2 py-2 text-xs font-semibold transition md:px-3',
          isActive ? 'text-blue-700' : 'text-blue-600 hover:text-blue-700',
        ].join(' ')
      }
    >
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
      </svg>
      <span className="hidden sm:inline">Wishlist</span>
      {count > 0 ? (
        <span className="absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold leading-none text-white sm:static sm:ms-0 sm:h-5 sm:min-w-5 sm:text-[11px]">
          {count > 99 ? '99+' : count}
        </span>
      ) : null}
    </NavLink>
  )
}

function CartNavLink({ onNavigate }) {
  const { itemCount } = useCart()
  return (
    <NavLink
      to="/cart"
      onClick={() => onNavigate?.()}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/30"
      aria-label={
        itemCount > 0
          ? `Shopping cart, ${itemCount} items`
          : 'Shopping cart'
      }
    >
      <CartIcon />
      {itemCount > 0 ? (
        <span className="absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold leading-none text-white">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      ) : null}
    </NavLink>
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

          <span
            className="hidden h-4 w-px shrink-0 bg-zinc-200 md:block"
            aria-hidden="true"
          />
          <div className="hidden md:flex">
            <WishlistNavLink />
          </div>
          <span
            className="hidden h-4 w-px shrink-0 bg-zinc-200 md:block"
            aria-hidden="true"
          />
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <CartNavLink />
          {isAuthenticated ? (
            <ProfileMenu user={user} />
          ) : (
            <NavLink
              to="/register"
              className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/40"
            >
              Get Started
            </NavLink>
          )}
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

              <div className="mt-2 flex flex-wrap items-center gap-2 px-1">
                <WishlistNavLink onNavigate={() => setOpen(false)} />
                <span className="h-6 w-px bg-zinc-200" aria-hidden="true" />
                <CartNavLink onNavigate={() => setOpen(false)} />
                {isAuthenticated ? (
                  <ProfileMenu user={user} />
                ) : (
                  <NavLink
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="flex flex-1 min-w-[140px] items-center justify-center rounded-full bg-zinc-900 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-zinc-800"
                  >
                    Get Started
                  </NavLink>
                )}
              </div>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  )
}

