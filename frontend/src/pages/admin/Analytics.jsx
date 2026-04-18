import { useCallback, useEffect, useMemo, useState } from 'react'
import DashboardPage from '../../components/DashboardPage.jsx'
import { useAuth } from '../../context/useAuth.js'
import { apiJson, ApiError } from '../../lib/api.js'

function fmtMoney(n) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

function fmtMoneyFull(n) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

function TrendPill({ pct }) {
  if (pct == null || Number.isNaN(pct)) return null
  const up = pct >= 0
  return (
    <span
      className={[
        'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold',
        up ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700',
      ].join(' ')}
    >
      <span aria-hidden="true">{up ? '↑' : '↓'}</span>
      {Math.abs(pct)}%
    </span>
  )
}

function KpiCard({ title, value, sub, trendPct, icon }) {
  return (
    <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-sm ring-1 ring-zinc-900/5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-zinc-500">{title}</p>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-baseline gap-2">
        <p className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          {value}
        </p>
        {trendPct != null ? <TrendPill pct={trendPct} /> : null}
      </div>
      {sub ? (
        <p className="mt-2 text-xs text-zinc-500">{sub}</p>
      ) : null}
    </div>
  )
}

function CategoryLineChart({ categories }) {
  const w = 640
  const h = 240
  const pad = { t: 20, r: 20, b: 36, l: 44 }
  const innerW = w - pad.l - pad.r
  const innerH = h - pad.t - pad.b

  const pts = useMemo(() => {
    const list = (categories || []).filter(
      (c) => c.unitsSold > 0 || c.productCount > 0,
    )
    const sorted = [...list].sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 10)
    if (sorted.length === 0) return { lineD: '', areaD: '', maxY: 1, labels: [] }
    const maxY = Math.max(1, ...sorted.map((c) => c.unitsSold))
    const coords = sorted.map((c, i) => {
      const x =
        pad.l +
        (sorted.length <= 1
          ? innerW / 2
          : (i / (sorted.length - 1)) * innerW)
      const y = pad.t + innerH - (c.unitsSold / maxY) * innerH
      return { x, y, label: c.name, units: c.unitsSold }
    })
    const lineD = coords.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    const areaD = `${lineD} L ${coords[coords.length - 1].x} ${pad.t + innerH} L ${coords[0].x} ${pad.t + innerH} Z`
    return { lineD, areaD, maxY, labels: coords }
  }, [categories, innerH, innerW, pad.l, pad.t, pad.b, pad.r])

  if (!pts.lineD) {
    return (
      <div className="flex h-[240px] items-center justify-center rounded-xl bg-zinc-50 text-sm text-zinc-500">
        Not enough category sales data to plot yet.
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-auto w-full min-w-[320px]"
        role="img"
        aria-label="Units sold by category"
      >
        <defs>
          <linearGradient id="analytics-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = pad.t + innerH * (1 - t)
          return (
            <line
              key={t}
              x1={pad.l}
              y1={y}
              x2={pad.l + innerW}
              y2={y}
              stroke="#e4e4e7"
              strokeWidth="1"
              strokeDasharray="4 6"
            />
          )
        })}
        <path d={pts.areaD} fill="url(#analytics-area)" />
        <path
          d={pts.lineD}
          fill="none"
          stroke="#2563eb"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {pts.labels.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#fff" stroke="#2563eb" strokeWidth="2" />
        ))}
        <text x={pad.l} y={14} className="fill-zinc-400 text-[10px] font-medium">
          {pts.maxY}
        </text>
        {pts.labels.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={h - 8}
            textAnchor="middle"
            className="fill-zinc-500 text-[9px] font-medium"
          >
            {p.label.length > 8 ? `${p.label.slice(0, 7)}…` : p.label}
          </text>
        ))}
      </svg>
    </div>
  )
}

function CategoryBars({ bars, maxBar }) {
  const max = Math.max(1, maxBar || 1)
  return (
    <div className="flex h-[220px] items-end justify-between gap-1.5 px-1 pt-6 sm:gap-2">
      {bars.map((c, i) => {
        const hPct = Math.round((c.unitsSold / max) * 100)
        const isTop = i === 0 && c.unitsSold > 0
        return (
          <div
            key={c.slug}
            className="flex min-w-0 flex-1 flex-col items-center gap-2"
          >
            <span className="text-[10px] font-semibold text-zinc-600 sm:text-xs">
              {c.unitsSold > 0 ? c.unitsSold.toLocaleString() : '—'}
            </span>
            <div className="flex w-full flex-1 items-end justify-center">
              <div
                className={[
                  'w-full max-w-[44px] rounded-t-lg transition-all',
                  isTop ? 'bg-blue-500 shadow-sm shadow-blue-500/30' : 'bg-zinc-200',
                ].join(' ')}
                style={{
                  height: `${Math.max(8, hPct)}%`,
                  minHeight: c.unitsSold > 0 ? 12 : 4,
                }}
                title={`${c.name}: ${c.unitsSold} units`}
              />
            </div>
            <span className="max-w-full truncate text-[9px] font-medium text-zinc-500 sm:text-[10px]">
              {c.name.slice(0, 3)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function ShareGauge({ pct, label }) {
  const p = Math.min(100, Math.max(0, pct))
  const arcRadius = 48
  const circumference = Math.PI * arcRadius
  const dash = (p / 100) * circumference
  return (
    <div className="flex flex-col items-center py-2">
      <div className="relative h-28 w-44">
        <svg viewBox="0 0 120 72" className="h-full w-full">
          <path
            d="M 12 60 A 48 48 0 0 1 108 60"
            fill="none"
            stroke="#e4e4e7"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 12 60 A 48 48 0 0 1 108 60"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1 text-center">
          <p className="text-2xl font-bold text-zinc-900">{p}%</p>
          <p className="mt-0.5 max-w-[9rem] text-[10px] leading-snug text-zinc-500">
            {label}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AdminAnalytics() {
  const { token } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!token) {
      setData(null)
      setLoading(false)
      setError('')
      return
    }
    setLoading(true)
    setError('')
    try {
      const json = await apiJson('/admin/analytics', { token })
      setData(json)
    } catch (err) {
      setData(null)
      setError(
        err instanceof ApiError ? err.message : 'Could not load analytics.',
      )
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    load()
  }, [load])

  const highlights = data?.highlights

  return (
    <DashboardPage
      title="Analytics"
      subtitle="Catalog overview, category performance, and best sellers — styled like your reference dashboard."
    >
      {!token ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Sign in as an admin to view analytics.
        </p>
      ) : null}

      {token && loading ? (
        <p className="py-16 text-center text-sm text-zinc-500">Loading analytics…</p>
      ) : null}

      {token && error ? (
        <p
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {token && data && !loading && !error ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              title="Total users"
              value={data.totals.users.toLocaleString()}
              trendPct={data.trends.usersPct}
              sub={`${data.trends.usersCurr} new in last 30 days vs ${data.trends.usersPrev} prior period`}
              icon={
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              }
            />
            <KpiCard
              title="Active products"
              value={data.totals.products.toLocaleString()}
              trendPct={data.trends.productsPct}
              sub={`${data.trends.productsCurr} added last 30 days vs ${data.trends.productsPrev} prior period`}
              icon={
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
              }
            />
            <KpiCard
              title="Categories"
              value={data.totals.categories.toLocaleString()}
              trendPct={data.trends.categoriesPct}
              sub={`${data.trends.categoriesCurr} new last 30 days vs ${data.trends.categoriesPrev} prior period`}
              icon={
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              }
            />
            <KpiCard
              title="Units sold (catalog)"
              value={data.totals.totalUnitsSold.toLocaleString()}
              sub={`Est. revenue ${fmtMoney(data.totals.revenueEstimate)} (Σ price × sold)`}
              icon={
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              }
            />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-sm ring-1 ring-zinc-900/5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-zinc-900">
                      Category units sold
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">
                      Top categories by total units sold (from product{' '}
                      <span className="font-medium text-zinc-600">sold</span>{' '}
                      field).
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    Live data
                  </span>
                </div>
                <div className="mt-6">
                  <CategoryLineChart categories={data.categories} />
                </div>
                <div className="mt-6 grid gap-3 border-t border-zinc-100 pt-6 sm:grid-cols-3">
                  <div className="rounded-xl bg-blue-50/80 p-4 ring-1 ring-blue-100">
                    <p className="text-xs font-semibold text-blue-800">Most purchased</p>
                    <p className="mt-2 truncate text-sm font-bold text-zinc-900">
                      {highlights?.mostPurchased?.name || '—'}
                    </p>
                    <p className="mt-1 text-xs text-zinc-600">
                      {(highlights?.mostPurchased?.unitsSold ?? 0).toLocaleString()}{' '}
                      units
                    </p>
                  </div>
                  <div className="rounded-xl bg-emerald-50/80 p-4 ring-1 ring-emerald-100">
                    <p className="text-xs font-semibold text-emerald-800">
                      Highest avg price
                    </p>
                    <p className="mt-2 truncate text-sm font-bold text-zinc-900">
                      {highlights?.highestAvgPrice?.name || '—'}
                    </p>
                    <p className="mt-1 text-xs text-zinc-600">
                      {fmtMoneyFull(highlights?.highestAvgPrice?.avgPrice ?? 0)} avg
                    </p>
                  </div>
                  <div className="rounded-xl bg-orange-50/80 p-4 ring-1 ring-orange-100">
                    <p className="text-xs font-semibold text-orange-900">
                      Top revenue (est.)
                    </p>
                    <p className="mt-2 truncate text-sm font-bold text-zinc-900">
                      {highlights?.highestRevenue?.name || '—'}
                    </p>
                    <p className="mt-1 text-xs text-zinc-600">
                      {fmtMoney(highlights?.highestRevenue?.revenueEstimate ?? 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-sm ring-1 ring-zinc-900/5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-bold text-zinc-900">
                    Best selling products
                  </h2>
                  <span className="text-xs font-medium text-zinc-500">
                    By units sold
                  </span>
                </div>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-zinc-200 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                        <th className="pb-3 pe-3">ID</th>
                        <th className="pb-3 pe-3">Name</th>
                        <th className="pb-3 pe-3">Sold</th>
                        <th className="pb-3 pe-3">Revenue</th>
                        <th className="pb-3">Rating</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {data.topProducts.map((p) => (
                        <tr key={p.id} className="text-zinc-800">
                          <td className="py-3 pe-3 font-mono text-xs text-zinc-500">
                            #{p.sku || p.id}
                          </td>
                          <td className="py-3 pe-3">
                            <div className="flex items-center gap-2">
                              <img
                                src={p.image}
                                alt=""
                                className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-zinc-200"
                                onError={(e) => {
                                  const el = e.currentTarget
                                  if (el.dataset.fallbackApplied === '1') return
                                  el.dataset.fallbackApplied = '1'
                                  el.src =
                                    'https://placehold.co/72x72/f4f4f5/71717a?text=P'
                                }}
                              />
                              <span className="line-clamp-2 font-medium text-zinc-900">
                                {p.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 pe-3 font-semibold">
                            {p.sold.toLocaleString()}
                          </td>
                          <td className="py-3 pe-3">
                            <span className="inline-flex items-center gap-1.5 font-semibold text-zinc-900">
                              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                              {fmtMoneyFull(p.revenue)}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className="inline-flex items-center gap-1 text-amber-600">
                              <span aria-hidden="true">★</span>
                              <span className="font-semibold text-zinc-800">4.8</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {data.topProducts.length === 0 ? (
                  <p className="mt-4 text-center text-sm text-zinc-500">
                    No products in catalog yet.
                  </p>
                ) : null}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-sm ring-1 ring-zinc-900/5">
                <h2 className="text-base font-bold text-zinc-900">
                  Top categories (volume)
                </h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Compare units sold — tallest bar is the leader.
                </p>
                <CategoryBars
                  bars={data.chart.barsByUnitsSold}
                  maxBar={data.chart.maxBarUnits}
                />
              </div>

              <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-sm ring-1 ring-zinc-900/5">
                <h2 className="text-base font-bold text-zinc-900">
                  Leading category share
                </h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Share of all units sold attributed to the top category.
                </p>
                <ShareGauge
                  pct={data.chart.topCategorySharePct}
                  label={
                    highlights?.mostPurchased
                      ? `${highlights.mostPurchased.name} drives ${data.chart.topCategorySharePct}% of units`
                      : 'Add sales to categories to see share'
                  }
                />
                <button
                  type="button"
                  className="mt-2 w-full rounded-xl border border-zinc-200 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                  onClick={() => load()}
                >
                  Refresh data
                </button>
              </div>

              <div className="rounded-2xl border border-zinc-200/90 bg-gradient-to-b from-blue-50/80 to-white p-5 shadow-sm ring-1 ring-blue-100/80">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-md shadow-blue-500/25">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M12 2a10 10 0 0 1 10 10" />
                      <path d="M12 12l4-4" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-zinc-900">Insights</p>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                      Analytics use your database: users, active products, categories,
                      and per-category aggregates (product count, units sold, average
                      price, estimated revenue).
                    </p>
                  </div>
                </div>
                <div className="mt-4 rounded-xl border border-zinc-200/80 bg-white/90 p-3">
                  <label className="sr-only" htmlFor="analytics-assistant-input">
                    Ask a question
                  </label>
                  <input
                    id="analytics-assistant-input"
                    type="text"
                    readOnly
                    placeholder="Ask me anything… (coming soon)"
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-500 outline-none"
                  />
                  <div className="mt-2 flex justify-end gap-2 text-zinc-400">
                    <span className="rounded-lg p-1.5 hover:bg-zinc-100" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                      </svg>
                    </span>
                    <span className="rounded-lg p-1.5 hover:bg-zinc-100" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      </svg>
                    </span>
                    <span className="rounded-lg bg-blue-500 p-1.5 text-white" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </DashboardPage>
  )
}
