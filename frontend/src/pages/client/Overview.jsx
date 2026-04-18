import DashboardPage from '../../components/DashboardPage.jsx'
import { Link } from 'react-router-dom'
import { useWishlist } from '../../context/useWishlist.js'
import { useOrders } from '../../context/useOrders.js'

const BASE_STATS = [
  {
    key: 'active',
    label: 'Active orders',
    value: '0',
    hint: 'In progress or shipping',
    to: '/client/orders',
  },
  { key: 'wishlist', label: 'Wishlist items', value: '0', hint: 'Saved for later', to: '/client/wishlist' },
  {
    key: 'delivered',
    label: 'Delivered',
    value: '0',
    hint: 'All-time completed',
    to: '/client/orders',
  },
]

const PLACEHOLDER_ACTIVITY = [
  { title: 'Order #1042 shipped', meta: 'Mar 28, 2026', to: '/client/tracking' },
  { title: 'Order #1038 delivered', meta: 'Mar 12, 2026', to: '/client/orders' },
  { title: 'Profile updated', meta: 'Feb 2, 2026', to: '/client/profile' },
]

export default function ClientOverview() {
  const { count } = useWishlist()
  const { orders } = useOrders()
  const activeCount = orders.filter(
    (o) => o.status === 'Processing' || o.status === 'Shipped',
  ).length
  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length

  const stats = BASE_STATS.map((s) => {
    if (s.key === 'wishlist') return { ...s, value: String(count) }
    if (s.key === 'active') return { ...s, value: String(activeCount) }
    if (s.key === 'delivered') return { ...s, value: String(deliveredCount) }
    return s
  })

  return (
    <DashboardPage
      title="Overview"
      subtitle="Your account summary and recent activity."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-5 transition hover:border-orange-200 hover:bg-orange-50/40"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              {s.label}
            </p>
            <p className="mt-2 text-2xl font-bold text-zinc-900">{s.value}</p>
            <p className="mt-1 text-xs text-zinc-500">{s.hint}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-5 sm:p-6">
        <h2 className="text-sm font-bold text-zinc-900">Recent activity</h2>
        <p className="mt-1 text-xs text-zinc-500">
          Sample timeline — connect to orders API when available.
        </p>
        <ul className="mt-4 divide-y divide-zinc-200/80">
          {PLACEHOLDER_ACTIVITY.map((row) => (
            <li key={row.title}>
              <Link
                to={row.to}
                className="flex items-center justify-between gap-3 py-3 text-sm transition hover:text-orange-600"
              >
                <span className="font-medium text-zinc-800">{row.title}</span>
                <span className="shrink-0 text-xs text-zinc-500">{row.meta}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </DashboardPage>
  )
}
