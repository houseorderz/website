function HeartIcon() {
  return (
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
  )
}

function Stars({ value = 4.5 }) {
  const full = Math.floor(value)
  const half = value - full >= 0.5
  const total = 5

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }).map((_, i) => {
        const filled = i < full
        const isHalf = i === full && half
        return (
          <span key={i} className="text-[10px] leading-none">
            <svg
              viewBox="0 0 20 20"
              width="12"
              height="12"
              aria-hidden="true"
              className={filled || isHalf ? 'text-orange-400' : 'text-zinc-300'}
            >
              <defs>
                <linearGradient id={`half-${i}`} x1="0" x2="1">
                  <stop offset="50%" stopColor="currentColor" />
                  <stop offset="50%" stopColor="rgb(212 212 216)" />
                </linearGradient>
              </defs>
              <path
                d="M10 15.3 4.12 18.6l1.12-6.53L.5 7.4l6.56-.95L10 0.5l2.94 5.95 6.56.95-4.74 4.67 1.12 6.53L10 15.3Z"
                fill={isHalf ? `url(#half-${i})` : 'currentColor'}
              />
            </svg>
          </span>
        )
      })}
    </div>
  )
}

export default function ProductCard({ product }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200">
      <div className="absolute left-3 top-3 z-10">
        <span className="rounded bg-zinc-900 px-2 py-1 text-[10px] font-semibold text-white">
          Sale
        </span>
      </div>
      <button
        type="button"
        className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow-sm ring-1 ring-black/5 transition hover:bg-white hover:text-zinc-900"
        aria-label="Add to wishlist"
      >
        <HeartIcon />
      </button>

      <div className="p-4">
        <div className="h-36 rounded-xl bg-linear-to-br from-zinc-100 to-zinc-200 transition group-hover:from-orange-100 group-hover:to-rose-100" />

        <p className="mt-3 text-[11px] text-zinc-500">
          Physical Product Title will be here...
        </p>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-sm font-extrabold text-zinc-900">
            ${product.price.toLocaleString()}
          </div>
          <div className="text-[11px] font-semibold text-orange-500">
            ${product.oldPrice.toLocaleString()}
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <Stars value={product.rating} />
          <p className="text-[11px] text-zinc-500">{product.reviews} reviews</p>
        </div>
      </div>
    </div>
  )
}

