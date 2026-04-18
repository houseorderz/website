import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { apiJson, ApiError } from '../lib/api.js'
import { useCart } from '../context/useCart.js'
import { useWishlist } from '../context/useWishlist.js'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const COLORS = [
  { id: 'sage', name: '53 Green', swatch: 'bg-emerald-200 ring-emerald-800' },
  { id: 'peach', name: 'Peach', swatch: 'bg-orange-100 ring-orange-300' },
  { id: 'grey', name: 'Light Grey', swatch: 'bg-zinc-200 ring-zinc-400' },
]

const MOCK_REVIEWS = [
  {
    id: 1,
    name: 'James Gouse',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
    rating: 5,
    text: 'Great quality and true to size. The fabric feels premium and washes well. Highly recommend.',
    likes: 12,
    dislikes: 0,
  },
  {
    id: 2,
    name: 'Maria Chen',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
    rating: 5,
    text: 'Love the fit and color. Shipping was fast. Will order again.',
    likes: 8,
    dislikes: 1,
  },
  {
    id: 3,
    name: 'Alex Rivera',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
    rating: 4,
    text: 'Nice piece—slightly looser than expected but still looks good.',
    likes: 4,
    dislikes: 0,
  },
]

const RATING_ROWS = [
  { stars: 5, count: 184, pct: 82 },
  { stars: 4, count: 25, pct: 11 },
  { stars: 3, count: 10, pct: 4 },
  { stars: 2, count: 3, pct: 2 },
  { stars: 1, count: 3, pct: 1 },
]

function formatPrice(value) {
  return `$${Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function soldLabel(sold) {
  if (sold >= 1000) return `${(sold / 1000).toFixed(1).replace(/\.0$/, '')}K+ Sold`
  return `${sold}+ Sold`
}

function Stars({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-0.5 text-amber-500 ${className}`} aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" width="13" height="13" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
        </svg>
      ))}
    </span>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mainIndex, setMainIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState(COLORS[0].id)
  const [selectedSize, setSelectedSize] = useState('S')
  const [descExpanded, setDescExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState('reviews')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const data = await apiJson(`/products/${id}`)
        if (!cancelled) {
          setProduct(data.product)
          setMainIndex(0)
        }
      } catch (err) {
        if (!cancelled) {
          if (err instanceof ApiError && err.status === 404) {
            navigate('/products', { replace: true })
            return
          }
          setError(err instanceof ApiError ? err.message : 'Could not load product.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id, navigate])

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 text-center text-xs text-zinc-500">
        Loading product…
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 text-center">
        <p className="text-xs text-red-700" role="alert">
          {error || 'Product unavailable.'}
        </p>
        <Link to="/products" className="mt-3 inline-block text-xs font-semibold text-emerald-800">
          Back to products
        </Link>
      </div>
    )
  }

  const images = product.images?.length ? product.images : [product.image]
  const mainSrc = images[mainIndex] ?? product.image
  const wishlisted = isInWishlist(product.id)
  const shortDesc =
    product.description.length > 160
      ? `${product.description.slice(0, 160)}…`
      : product.description

  return (
    <div className="bg-white pb-10 pt-4">
      <div className="mx-auto max-w-5xl px-4 sm:px-5">
        <nav className="mb-5 text-[11px] text-zinc-500" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link to="/" className="hover:text-zinc-800">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to="/products" className="hover:text-zinc-800">
                {product.categoryLabel}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-zinc-900">{product.name}</li>
          </ol>
        </nav>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <div>
            <div className="overflow-hidden rounded-xl bg-zinc-100">
              <img
                src={mainSrc}
                alt={product.name}
                className="aspect-[5/6] max-h-[min(52vh,420px)] w-full object-cover object-center sm:max-h-[min(56vh,480px)]"
                onError={(e) => {
                  const el = e.currentTarget
                  if (el.dataset.fallbackApplied === '1') return
                  el.dataset.fallbackApplied = '1'
                  el.src =
                    'https://placehold.co/800x1000/f4f4f5/71717a?text=Product'
                }}
              />
            </div>
            <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1">
              {images.slice(0, 4).map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  onClick={() => setMainIndex(i)}
                  className={[
                    'relative h-14 w-14 shrink-0 overflow-hidden rounded-lg ring-2 ring-offset-1 transition',
                    mainIndex === i ? 'ring-emerald-800' : 'ring-transparent hover:ring-zinc-300',
                  ].join(' ')}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
              <button
                type="button"
                onClick={() => setMainIndex(Math.min(4, images.length - 1))}
                className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-900/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800"
              >
                <img
                  src={images[4] ?? images[0]}
                  alt=""
                  className="h-full w-full object-cover opacity-40"
                />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-white">
                  +4 more
                </span>
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl lg:text-[1.65rem]">
              {product.name}
            </h1>

            <div className="mt-2 text-xs leading-relaxed text-zinc-600 sm:text-[13px]">
              <p>
                {descExpanded ? product.description : shortDesc}{' '}
                {product.description.length > 160 ? (
                  <button
                    type="button"
                    onClick={() => setDescExpanded((v) => !v)}
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {descExpanded ? 'Show less' : 'Read more'}
                  </button>
                ) : null}
              </p>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-600">
              <span className="font-medium text-zinc-800">{soldLabel(product.sold)}</span>
              <span className="hidden h-3 w-px bg-zinc-200 sm:block" aria-hidden="true" />
              <span className="inline-flex items-center gap-1">
                <Stars />
                <span className="font-semibold text-zinc-900">{product.rating}</span>
                <span className="text-zinc-500">({product.reviewCount} reviews)</span>
              </span>
            </div>

            <div className="mt-5 flex flex-wrap items-end gap-2">
              <span className="text-2xl font-bold text-zinc-900 sm:text-3xl">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice != null ? (
                <span className="text-sm text-rose-400 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              ) : null}
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold text-zinc-800">
                Color:{' '}
                <span className="font-normal text-zinc-600">
                  {COLORS.find((c) => c.id === selectedColor)?.name}
                </span>
              </p>
              <div className="mt-2 flex gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedColor(c.id)}
                    aria-pressed={selectedColor === c.id}
                    aria-label={c.name}
                    className={[
                      'h-8 w-8 rounded-md ring-2 ring-offset-1 transition',
                      c.swatch,
                      selectedColor === c.id ? 'ring-emerald-800' : 'ring-transparent',
                    ].join(' ')}
                  />
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold text-zinc-800">
                Size:{' '}
                <span className="font-normal text-zinc-600">{selectedSize}</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {SIZES.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    aria-pressed={selectedSize === sz}
                    className={[
                      'min-w-[2.25rem] rounded-md border px-2 py-1.5 text-xs font-semibold transition',
                      selectedSize === sz
                        ? 'border-emerald-900 bg-emerald-900 text-white'
                        : 'border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300',
                    ].join(' ')}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  const colorObj = COLORS.find((c) => c.id === selectedColor)
                  addItem({
                    productId: product.id,
                    name: product.name,
                    image: mainSrc,
                    price: product.price,
                    quantity: 1,
                    size: selectedSize,
                    colorId: selectedColor,
                    colorLabel: colorObj?.name ?? selectedColor,
                  })
                  navigate('/cart')
                }}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-900/40"
              >
                <span className="text-sm leading-none">+</span>
                Add to Cart
              </button>
              <button
                type="button"
                className="inline-flex flex-1 items-center justify-center rounded-lg border-2 border-emerald-900 bg-white px-4 py-2.5 text-xs font-semibold text-emerald-900 transition hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-900/30"
              >
                Buy this Item
              </button>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 border-t border-zinc-100 pt-4 text-xs text-zinc-600 sm:justify-start">
              <button type="button" className="inline-flex items-center gap-1.5 hover:text-zinc-900">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Chat
              </button>
              <span className="h-3 w-px bg-zinc-200" aria-hidden="true" />
              <button
                type="button"
                aria-pressed={wishlisted}
                onClick={() =>
                  toggleItem({
                    productId: product.id,
                    name: product.name,
                    image: mainSrc,
                    price: product.price,
                    stock: product.stock,
                    sold: product.sold,
                  })
                }
                className={[
                  'inline-flex items-center gap-1.5 transition hover:text-zinc-900',
                  wishlisted ? 'font-semibold text-blue-600' : 'text-zinc-600',
                ].join(' ')}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="15"
                  height="15"
                  fill={wishlisted ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
                </svg>
                Wishlist
              </button>
              <span className="h-3 w-px bg-zinc-200" aria-hidden="true" />
              <button type="button" className="inline-flex items-center gap-1.5 hover:text-zinc-900">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" />
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-200 pt-6">
          <div className="flex gap-5 border-b border-zinc-200">
            {[
              { id: 'details', label: 'Details' },
              { id: 'reviews', label: 'Reviews' },
              { id: 'discussion', label: 'Discussion' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={[
                  '-mb-px border-b-2 pb-2 text-xs font-semibold transition',
                  activeTab === tab.id
                    ? 'border-emerald-800 text-emerald-900'
                    : 'border-transparent text-zinc-500 hover:text-zinc-800',
                ].join(' ')}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'details' ? (
            <div className="py-5 text-xs leading-relaxed text-zinc-600 sm:text-[13px]">
              <p>{product.description}</p>
              <ul className="mt-3 list-inside list-disc space-y-1.5 text-zinc-600">
                <li>Material: premium cotton blend</li>
                <li>Fit: regular; model wears size {selectedSize}</li>
                <li>Care: machine wash cold, tumble dry low</li>
                <li>SKU: stock updates in real time (current: {product.stock} available)</li>
              </ul>
            </div>
          ) : null}

          {activeTab === 'reviews' ? (
            <div className="grid gap-6 py-5 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-zinc-900">Reviews</h2>
                    <p className="text-xs text-zinc-500">
                      {MOCK_REVIEWS.length} from {product.reviewCount} reviews
                    </p>
                  </div>
                  <label className="text-xs text-zinc-600">
                    <span className="sr-only">Sort reviews</span>
                    <select className="rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-xs font-medium">
                      <option>Latest</option>
                      <option>Oldest</option>
                      <option>Highest rating</option>
                    </select>
                  </label>
                </div>
                <ul className="mt-4 space-y-3">
                  {MOCK_REVIEWS.map((r) => (
                    <li
                      key={r.id}
                      className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-3.5"
                    >
                      <div className="flex gap-3">
                        <img
                          src={r.avatar}
                          alt=""
                          className="h-9 w-9 rounded-full object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-zinc-900">{r.name}</p>
                          <div className="mt-0.5 text-xs text-amber-500">
                            {Array.from({ length: r.rating }, (_, i) => (
                              <span key={i} aria-hidden="true">
                                ★
                              </span>
                            ))}
                          </div>
                          <p className="mt-2 text-xs text-zinc-600 sm:text-[13px]">{r.text}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-zinc-500">
                            <button type="button" className="font-semibold text-emerald-800 hover:underline">
                              Reply
                            </button>
                            <span className="inline-flex items-center gap-1">
                              👍 {r.likes}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              👎 {r.dislikes}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-zinc-200 p-4">
                <div className="flex items-start gap-2">
                  <span className="text-2xl font-bold text-zinc-900">{product.rating}</span>
                  <div>
                    <div className="text-xs text-amber-500">★★★★★</div>
                    <p className="text-[10px] text-zinc-500">Overall rating</p>
                  </div>
                </div>
                <div className="mt-4 space-y-1.5">
                  {RATING_ROWS.map((row) => (
                    <div key={row.stars} className="flex items-center gap-1.5 text-[11px]">
                      <span className="w-2.5 text-zinc-500">{row.stars}</span>
                      <span className="text-amber-500">★</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
                        <div
                          className="h-full rounded-full bg-amber-500"
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                      <span className="w-6 text-end text-zinc-500">{row.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === 'discussion' ? (
            <p className="py-5 text-xs text-zinc-500">No discussion threads yet. Be the first to ask a question.</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
