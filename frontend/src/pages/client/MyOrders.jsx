import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import DashboardPage from '../../components/DashboardPage.jsx'
import { useOrders } from '../../context/useOrders.js'

function statusClass(status) {
  const s = status.toLowerCase()
  if (s === 'delivered')
    return 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/80'
  if (s === 'shipped' || s === 'in transit')
    return 'bg-orange-50 text-orange-900 ring-1 ring-orange-200/80'
  if (s === 'processing') return 'bg-amber-50 text-amber-900 ring-1 ring-amber-200/80'
  return 'bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200/80'
}

function formatPrice(value) {
  return `$${Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function lineVariant(line) {
  return [line.colorLabel, line.size ? `Size ${line.size}` : '']
    .filter(Boolean)
    .join(' · ')
}

function OrderLineItems({ lines }) {
  if (!lines?.length) {
    return (
      <p className="text-xs text-zinc-500">
        No product details for this order (placed before line items were saved).
      </p>
    )
  }

  return (
    <ul className="divide-y divide-zinc-200/90">
      {lines.map((line) => {
        const variant = lineVariant(line)
        return (
        <li
          key={line.lineKey}
          className="flex gap-3 py-3 first:pt-0 last:pb-0 sm:items-center sm:gap-4"
        >
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-zinc-100 sm:h-[72px] sm:w-[72px]">
            <img
              src={line.image}
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => {
                const el = e.currentTarget
                if (el.dataset.fallbackApplied === '1') return
                el.dataset.fallbackApplied = '1'
                el.src =
                  'https://placehold.co/160x160/f4f4f5/71717a?text=Item'
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-zinc-900">{line.name}</p>
            {variant ? (
              <p className="mt-0.5 text-xs text-zinc-500">{variant}</p>
            ) : null}
            <p className="mt-1 text-xs text-zinc-600">
              Qty {line.quantity} × {formatPrice(line.price)}
            </p>
          </div>
          <div className="shrink-0 text-end">
            <p className="text-sm font-bold text-zinc-900">
              {formatPrice(line.price * line.quantity)}
            </p>
          </div>
        </li>
        )
      })}
    </ul>
  )
}

export default function ClientMyOrders() {
  const { orders } = useOrders()

  const sorted = [...orders].sort((a, b) =>
    String(b.placedAt).localeCompare(String(a.placedAt)),
  )

  return (
    <DashboardPage title="My Orders" subtitle="Order history and status.">
      {sorted.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 px-4 py-12 text-center text-sm text-zinc-500">
          No orders yet. Add items to your cart and use{' '}
          <strong>Continue to checkout</strong> to place an order.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-200">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/90">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Order
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Date
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Status
                </th>
                <th className="px-4 py-3 text-end text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => (
                <Fragment key={row.id}>
                  <tr className="border-b border-zinc-100 transition hover:bg-zinc-50/80">
                    <td className="px-4 py-3 align-top">
                      <Link
                        to="/client/tracking"
                        className="font-semibold text-zinc-900 hover:text-orange-600"
                      >
                        {row.orderNo}
                      </Link>
                    </td>
                    <td className="px-4 py-3 align-top text-zinc-600">
                      {row.placedAt}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClass(row.status)}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top text-end font-medium text-zinc-900">
                      {formatPrice(row.total)}
                    </td>
                  </tr>
                  <tr className="border-b border-zinc-200 bg-zinc-50/60">
                    <td colSpan={4} className="px-4 py-4 sm:px-6">
                      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                        Items in this order
                      </p>
                      <OrderLineItems lines={row.lines} />
                    </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-zinc-500">
        Orders are saved in this browser. Connect an API later to sync across
        devices.
      </p>
    </DashboardPage>
  )
}
