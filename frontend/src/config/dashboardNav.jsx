function IconOverview() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" className="shrink-0">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="11" width="7" height="10" rx="1" />
      <rect x="3" y="15" width="7" height="6" rx="1" />
    </svg>
  )
}

function IconBox() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" className="shrink-0">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="M3.3 7.7 12 12l8.7-4.3M12 22V12" />
    </svg>
  )
}

function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" className="shrink-0">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function IconGrid() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" className="shrink-0">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function IconChart() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" className="shrink-0">
      <path d="M3 3v18h18" />
      <path d="M7 12v5M12 8v9M17 5v12" />
    </svg>
  )
}

function IconHeart() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" className="shrink-0">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  )
}

function IconMapPin() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" className="shrink-0">
      <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}

function IconUser() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" className="shrink-0">
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function IconCard() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" className="shrink-0">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  )
}

export const ADMIN_NAV_GROUPS = [
  {
    items: [
      { to: '/admin/overview', label: 'Overview', icon: IconOverview, end: true },
      { to: '/admin/products', label: 'Products', icon: IconBox },
      { to: '/admin/users', label: 'Users', icon: IconUsers },
      { to: '/admin/categories', label: 'Categories', icon: IconGrid },
    ],
  },
  {
    items: [{ to: '/admin/analytics', label: 'Analytics', icon: IconChart }],
  },
]

export const CLIENT_NAV_GROUPS = [
  {
    items: [
      { to: '/client/overview', label: 'Overview', icon: IconOverview, end: true },
      { to: '/client/orders', label: 'My Orders', icon: IconBox },
      { to: '/client/wishlist', label: 'Wishlist', icon: IconHeart },
      { to: '/client/tracking', label: 'Tracking', icon: IconMapPin },
    ],
  },
  {
    items: [
      { to: '/client/profile', label: 'Profile', icon: IconUser },
      { to: '/client/payment-methods', label: 'Payment Methods', icon: IconCard },
    ],
  },
]
