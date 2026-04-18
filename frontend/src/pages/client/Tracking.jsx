import DashboardPage from '../../components/DashboardPage.jsx'

function StepBadge({ done, current }) {
  if (done) {
    return (
      <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200/80">
        Done
      </span>
    )
  }
  if (current) {
    return (
      <span className="inline-flex rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-orange-900 ring-1 ring-orange-200/80">
        In progress
      </span>
    )
  }
  return (
    <span className="inline-flex rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-600 ring-1 ring-zinc-200/80">
      Pending
    </span>
  )
}

/** Sample shipment timeline for order GS-1042 */
const PLACEHOLDER_STEPS = [
  {
    title: 'Order placed',
    detail: 'Payment confirmed · Warehouse notified',
    date: 'Mar 28, 2026 · 9:14 AM',
    done: true,
    current: false,
  },
  {
    title: 'Packed',
    detail: 'Items picked and packed at fulfillment center',
    date: 'Mar 29, 2026 · 2:40 PM',
    done: true,
    current: false,
  },
  {
    title: 'Shipped',
    detail: 'Carrier: Sample Express · Tracking #1Z999AA10123456784',
    date: 'Mar 30, 2026 · 8:05 AM',
    done: false,
    current: true,
  },
  {
    title: 'Out for delivery',
    detail: 'Expected today by 6:00 PM',
    date: '—',
    done: false,
    current: false,
  },
  {
    title: 'Delivered',
    detail: 'Signed by recipient',
    date: '—',
    done: false,
    current: false,
  },
]

export default function ClientTracking() {
  return (
    <DashboardPage title="Tracking" subtitle="Track shipments and deliveries.">
      <div className="rounded-xl border border-zinc-200 bg-zinc-50/40 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Sample order
            </p>
            <p className="text-lg font-bold text-zinc-900">GS-1042</p>
          </div>
          <StepBadge done={false} current />
        </div>
      </div>

      <div className="relative ps-6">
        <span
          className="absolute start-[7px] top-2 bottom-2 w-px bg-zinc-200"
          aria-hidden="true"
        />
        <ul className="space-y-6">
          {PLACEHOLDER_STEPS.map((step) => (
            <li key={step.title} className="relative flex gap-4">
              <span
                className={[
                  'absolute -start-6 top-1.5 z-[1] h-3.5 w-3.5 rounded-full border-2 border-white ring-2',
                  step.done
                    ? 'bg-emerald-500 ring-emerald-200'
                    : step.current
                      ? 'bg-orange-500 ring-orange-200'
                      : 'bg-zinc-300 ring-zinc-200',
                ].join(' ')}
              />
              <div className="min-w-0 flex-1 rounded-xl border border-zinc-100 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-zinc-900">{step.title}</h3>
                  <StepBadge done={step.done} current={step.current} />
                </div>
                <p className="mt-1 text-sm text-zinc-600">{step.detail}</p>
                <p className="mt-2 text-xs font-medium text-zinc-500">{step.date}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-zinc-500">
        Static demo timeline. Link to a tracking API or carrier webhook when available.
      </p>
    </DashboardPage>
  )
}
