import { useWishlist } from '../context/useWishlist.js'

function HeartIcon({ filled, className = 'h-4 w-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? 'currentColor' : 'none'}
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

/**
 * @param {object} props
 * @param {{ id: string, name: string, image: string, price: number, stock?: number, sold?: number }} props.product
 * @param {'overlay' | 'plain'} [props.variant]
 * @param {string} [props.className]
 */
export default function WishlistHeartButton({
  product,
  variant = 'overlay',
  className = '',
}) {
  const { toggleItem, isInWishlist } = useWishlist()
  const saved = isInWishlist(product.id)

  function onClick(e) {
    e.preventDefault()
    e.stopPropagation()
    toggleItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      stock: product.stock,
      sold: product.sold,
    })
  }

  const base =
    variant === 'overlay'
      ? 'absolute top-2 end-2 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:bg-white hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30'
      : 'inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`${base} ${saved ? 'text-orange-500' : ''} ${className}`.trim()}
    >
      <HeartIcon filled={saved} />
    </button>
  )
}
