import PageHeader from '../components/PageHeader.jsx'

const products = [
  { id: 'p1', name: 'Essential Tee', price: 19, tag: 'New' },
  { id: 'p2', name: 'Relaxed Hoodie', price: 49, tag: 'Popular' },
  { id: 'p3', name: 'Classic Denim', price: 59, tag: 'Best value' },
  { id: 'p4', name: 'Minimal Jacket', price: 89, tag: 'Limited' },
  { id: 'p5', name: 'Everyday Cap', price: 15, tag: 'Accessory' },
  { id: 'p6', name: 'Clean Sneakers', price: 79, tag: 'Trending' },
]

function Price({ value }) {
  return (
    <span className="text-sm font-semibold text-zinc-900">${value}</span>
  )
}

export default function Products() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        subtitle="A starter grid you can replace with real data later."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-zinc-900">{p.name}</p>
                <p className="mt-1 text-xs text-zinc-500">{p.tag}</p>
              </div>
              <Price value={p.price} />
            </div>

            <div className="mt-4 h-32 rounded-xl bg-linear-to-br from-zinc-100 to-zinc-200" />

            <button
              type="button"
              className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/40"
            >
              Add to cart
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

