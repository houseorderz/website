import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import WishlistHeartButton from '../components/WishlistHeartButton.jsx'
import { apiJson, ApiError } from '../lib/api.js'

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All Products' },
  { id: 'most-purchased', label: 'Most Purchased' },
  { id: 'furniture', label: 'Furniture' },
  { id: 'shoes', label: 'Shoes' },
  { id: 'clothes', label: 'Clothes' },
  { id: 'electronic', label: 'Electronic' },
  { id: 'sports', label: 'Sports' },
  { id: 'grocery', label: 'Grocery' },
]

function formatPrice(value) {
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function filterProducts(items, activeCategoryId, search) {
  let list = [...items]
  const q = search.trim().toLowerCase()
  if (q) {
    list = list.filter((p) => p.name.toLowerCase().includes(q))
  }
  if (activeCategoryId === 'most-purchased') {
    list.sort((a, b) => b.sold - a.sold)
  } else if (activeCategoryId !== 'all') {
    list = list.filter((p) => p.category === activeCategoryId)
  }
  return list
}

export default function Products() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setLoadError('')
      try {
        const data = await apiJson('/products')
        if (!cancelled) setProducts(Array.isArray(data.products) ? data.products : [])
      } catch (err) {
        if (!cancelled) {
          setLoadError(
            err instanceof ApiError ? err.message : 'Could not load products.',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const visible = useMemo(
    () => filterProducts(products, activeCategory, search),
    [products, activeCategory, search],
  )

  return (
    <div className="-mx-4 space-y-8 bg-[#F8F9FA] px-4 py-8 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 lg:py-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 lg:text-4xl">
          Products
        </h1>

        <label className="relative block w-full sm:max-w-md lg:w-80 lg:shrink-0">
          <span className="sr-only">Search products</span>
          <span className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-[#6C757D]">
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
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product..."
            className="w-full rounded-full border-0 bg-[#F1F1F1] py-3 ps-11 pe-5 text-sm text-zinc-900 shadow-none outline-none ring-0 placeholder:text-[#6C757D] focus:bg-white focus:ring-2 focus:ring-zinc-900/10"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORY_FILTERS.map((c) => {
          const isActive = activeCategory === c.id
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveCategory(c.id)}
              aria-pressed={isActive}
              className={[
                'rounded-full px-4 py-2 text-sm font-medium transition',
                isActive
                  ? 'bg-[#F1F1F1] text-zinc-900'
                  : 'text-zinc-900 hover:bg-white/80',
              ].join(' ')}
            >
              {c.label}
            </button>
          )
        })}
      </div>

      {loading ? (
        <p className="rounded-2xl bg-white py-16 text-center text-sm text-[#6C757D]">
          Loading products…
        </p>
      ) : loadError ? (
        <p
          className="rounded-2xl border border-red-200 bg-red-50 py-16 text-center text-sm text-red-800"
          role="alert"
        >
          {loadError}
        </p>
      ) : visible.length === 0 ? (
        <p className="rounded-2xl bg-white py-16 text-center text-sm text-[#6C757D]">
          No products match your filters.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-5">
          {visible.map((p) => (
            <Link
              key={p.id}
              to={`/products/${p.id}`}
              className="flex flex-col overflow-hidden rounded-[18px] bg-white p-3 shadow-sm transition hover:shadow-md sm:p-4"
            >
              <div className="relative aspect-square rounded-2xl bg-[#F1F1F1]">
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-full w-full rounded-2xl object-contain p-3"
                  loading="lazy"
                  onError={(e) => {
                    const el = e.currentTarget
                    if (el.dataset.fallbackApplied === '1') return
                    el.dataset.fallbackApplied = '1'
                    el.src =
                      'https://placehold.co/600x600/f1f1f1/6c757d?text=Product'
                  }}
                />
                <WishlistHeartButton product={p} variant="overlay" />
                <span
                  className="absolute bottom-2 end-2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm"
                  aria-hidden="true"
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
                  >
                    <path d="M7 17 17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </span>
              </div>

              <div className="mt-4 flex flex-1 flex-col">
                <h2 className="text-sm font-bold leading-snug text-zinc-900 sm:text-base">
                  {p.name}
                </h2>
                <p className="mt-1 text-sm font-normal text-zinc-900">
                  {formatPrice(p.price)}
                </p>
                <div className="mt-auto flex justify-between pt-4 text-xs text-[#6C757D] sm:text-sm">
                  <span>Stock: {p.stock}</span>
                  <span>Sold: {p.sold}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
