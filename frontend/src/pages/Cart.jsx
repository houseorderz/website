import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/useCart.js'
import { useOrders } from '../context/useOrders.js'

function formatPrice(value) {
  return `$${Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function XIcon({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

export default function Cart() {
  const navigate = useNavigate()
  const { placeOrder } = useOrders()
  const {
    lines,
    subtotal,
    clearCart,
    incrementLine,
    removeLine,
  } = useCart()
  const [promoInput, setPromoInput] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)

  const discountAmount = useMemo(
    () => Math.round(subtotal * (discountPercent / 100) * 100) / 100,
    [subtotal, discountPercent],
  )
  const total = Math.max(0, subtotal - discountAmount)

  const productKinds = lines.length

  function applyPromo() {
    const c = promoInput.trim().toUpperCase()
    if (c === 'SAVE10' || c === 'WELCOME10') {
      setDiscountPercent(10)
    } else {
      setDiscountPercent(0)
    }
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-zinc-900">Cart</h1>
        <p className="mt-3 text-sm text-zinc-600">Your cart is empty.</p>
        <Link
          to="/products"
          className="mt-6 inline-flex rounded-2xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          Browse products
        </Link>
      </div>
    )
  }

  return (
    <div className="pb-12 pt-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-100 pb-4">
                <div>
                  <h1 className="text-xl font-bold text-zinc-900 sm:text-2xl">
                    Cart
                  </h1>
                  <p className="mt-1 text-sm text-zinc-500">
                    ({productKinds} {productKinds === 1 ? 'product' : 'products'})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => clearCart()}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 transition hover:text-red-700"
                >
                  <XIcon />
                  Clear cart
                </button>
              </div>

              <div className="mt-4 hidden grid-cols-[1fr_auto_auto] gap-4 border-b border-zinc-100 pb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 sm:grid">
                <span>Product</span>
                <span className="text-center">Count</span>
                <span className="text-end">Price</span>
              </div>

              <ul className="divide-y divide-zinc-100">
                {lines.map((line) => (
                  <li
                    key={line.lineKey}
                    className="flex flex-col gap-4 py-5 first:pt-4 sm:flex-row sm:items-center sm:gap-4"
                  >
                    <div className="flex min-w-0 flex-1 gap-4">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
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
                      <div className="min-w-0">
                        <p className="font-bold text-zinc-900">{line.name}</p>
                        <p className="mt-0.5 text-sm text-zinc-500">
                          {[line.colorLabel, line.size ? `Size ${line.size}` : '']
                            .filter(Boolean)
                            .join(' · ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:w-auto sm:justify-end">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => incrementLine(line.lineKey, -1)}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition hover:bg-zinc-50"
                        >
                          −
                        </button>
                        <span className="min-w-[2rem] text-center text-sm font-semibold text-zinc-900">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => incrementLine(line.lineKey, 1)}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition hover:bg-zinc-50"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <p className="text-lg font-bold text-zinc-900 sm:text-xl">
                          {formatPrice(line.price * line.quantity)}
                        </p>
                        <button
                          type="button"
                          aria-label={`Remove ${line.name}`}
                          onClick={() => removeLine(line.lineKey)}
                          className="text-red-600 transition hover:text-red-700"
                        >
                          <XIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-zinc-100 p-5 sm:p-6">
              <p className="text-sm font-semibold text-zinc-800">Promo code</p>
              <div className="mt-3 flex rounded-xl border border-zinc-200 bg-white p-1 shadow-sm">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Type here..."
                  className="min-w-0 flex-1 rounded-lg border-0 bg-transparent px-3 py-2.5 text-sm text-zinc-900 outline-none ring-0 placeholder:text-zinc-400"
                />
                <button
                  type="button"
                  onClick={applyPromo}
                  className="shrink-0 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
                >
                  Apply
                </button>
              </div>
              {discountPercent > 0 ? (
                <p className="mt-2 text-xs text-emerald-700">
                  {discountPercent}% discount applied (SAVE10 / WELCOME10)
                </p>
              ) : null}

              <div className="mt-8 space-y-3 border-t border-zinc-200/80 pt-6 text-sm">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-zinc-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Discount</span>
                  <span className="font-medium text-zinc-900">
                    −{formatPrice(discountAmount)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-zinc-200/80 pt-3 text-base font-bold text-zinc-900">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  placeOrder({
                    lines,
                    subtotal,
                    discount: discountAmount,
                    total,
                  })
                  clearCart()
                  navigate('/client/orders')
                }}
                className="mt-6 w-full rounded-2xl bg-zinc-900 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/40"
              >
                Continue to checkout
              </button>
            </div>
          </div>
        </div>

        <section className="mt-10 overflow-hidden rounded-2xl bg-zinc-900 text-white sm:mt-12">
          <div className="grid items-center gap-6 p-6 sm:grid-cols-[1fr_auto_1fr] sm:gap-4 sm:p-8">
            <div className="hidden max-h-32 justify-center sm:flex">
              <img
                src="https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=280&h=280&fit=crop"
                alt=""
                className="max-h-32 w-auto object-contain opacity-90"
              />
            </div>
            <div className="text-center sm:text-start">
              <p className="text-lg font-bold sm:text-xl">
                Check the newest Apple products
              </p>
              <p className="mt-1 text-sm text-white/70">Official Apple retailer</p>
              <Link
                to="/products"
                className="mt-4 inline-flex rounded-xl border-2 border-white px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-zinc-900"
              >
                Shop now
              </Link>
            </div>
            <div className="hidden max-h-32 justify-center sm:flex">
              <img
                src="https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=280&h=280&fit=crop"
                alt=""
                className="max-h-32 w-auto object-contain opacity-90"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
