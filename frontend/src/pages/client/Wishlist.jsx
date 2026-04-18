import { Link } from 'react-router-dom'
import DashboardPage from '../../components/DashboardPage.jsx'
import WishlistHeartButton from '../../components/WishlistHeartButton.jsx'
import { useWishlist } from '../../context/useWishlist.js'

function formatPrice(value) {
  return `$${Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export default function ClientWishlist() {
  const { items } = useWishlist()

  return (
    <DashboardPage title="Wishlist" subtitle="Saved items for later.">
      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 px-4 py-12 text-center text-sm text-zinc-500">
          No saved items yet. Tap the heart on a product card or product page to
          add it here.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <div
              key={p.productId}
              className="relative flex flex-col overflow-hidden rounded-[18px] border border-zinc-100 bg-white p-3 shadow-sm transition hover:border-orange-200 hover:shadow-md sm:p-4"
            >
              <Link
                to={`/products/${p.productId}`}
                className="flex flex-1 flex-col"
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
                </div>
                <div className="mt-4 flex flex-1 flex-col">
                  <h2 className="text-sm font-bold leading-snug text-zinc-900 sm:text-base">
                    {p.name}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-zinc-900">
                    {formatPrice(p.price)}
                  </p>
                  <div className="mt-auto flex justify-between pt-4 text-xs text-[#6C757D] sm:text-sm">
                    <span>
                      Stock:{' '}
                      {p.stock != null && !Number.isNaN(p.stock) ? p.stock : '—'}
                    </span>
                    <span>
                      Sold:{' '}
                      {p.sold != null && !Number.isNaN(p.sold) ? p.sold : '—'}
                    </span>
                  </div>
                </div>
              </Link>
              <WishlistHeartButton
                product={{
                  id: p.productId,
                  name: p.name,
                  image: p.image,
                  price: p.price,
                  stock: p.stock,
                  sold: p.sold,
                }}
                variant="overlay"
              />
            </div>
          ))}
        </div>
      )}
    </DashboardPage>
  )
}
