import { useState } from 'react'
import DashboardPage from '../../components/DashboardPage.jsx'

const primaryBtn =
  'inline-flex items-center justify-center rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30'

const ghostBtn =
  'inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/20'

const dangerBtn =
  'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/20'

function cardBrandIcon(brand) {
  const b = brand.toLowerCase()
  if (b === 'visa')
    return (
      <span className="text-[11px] font-bold tracking-tighter text-blue-900">VISA</span>
    )
  if (b === 'mastercard')
    return (
      <span className="text-[11px] font-bold text-orange-700">MC</span>
    )
  return (
    <span className="text-[11px] font-semibold text-zinc-600">{brand}</span>
  )
}

export default function ClientPaymentMethods() {
  const [methods, setMethods] = useState(() => [
    { id: 'pm_1', brand: 'Visa', last4: '4242', exp: '08 / 27', default: true },
    { id: 'pm_2', brand: 'Mastercard', last4: '8891', exp: '01 / 28', default: false },
  ])

  function remove(id) {
    setMethods((prev) => prev.filter((m) => m.id !== id))
  }

  function addPlaceholder() {
    setMethods((prev) => [
      ...prev,
      {
        id: `pm_${Date.now()}`,
        brand: 'Visa',
        last4: String(1000 + Math.floor(Math.random() * 9000)),
        exp: '12 / 29',
        default: false,
      },
    ])
  }

  return (
    <DashboardPage title="Payment Methods" subtitle="Saved cards and billing details.">
      <ul className="space-y-3">
        {methods.length === 0 ? (
          <li className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 px-4 py-10 text-center text-sm text-zinc-500">
            No saved cards yet. Add a payment method to see it here (UI preview).
          </li>
        ) : (
          methods.map((m) => (
            <li
              key={m.id}
              className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-16 place-items-center rounded-lg border border-zinc-200 bg-white shadow-sm">
                  {cardBrandIcon(m.brand)}
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900">
                    {m.brand} ·••• {m.last4}
                  </p>
                  <p className="text-xs text-zinc-500">Expires {m.exp}</p>
                  {m.default ? (
                    <span className="mt-1 inline-flex rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-semibold text-orange-900 ring-1 ring-orange-200/80">
                      Default
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 sm:justify-end">
                <button type="button" className={dangerBtn} onClick={() => remove(m.id)}>
                  Remove
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      <div className="flex flex-wrap gap-3 pt-2">
        <button type="button" className={primaryBtn} onClick={addPlaceholder}>
          Add payment method
        </button>
        <button type="button" className={ghostBtn}>
          Billing address (preview)
        </button>
      </div>

      <p className="text-xs text-zinc-500">
        Local UI only — connect to your payments provider when backend is ready.
      </p>
    </DashboardPage>
  )
}
