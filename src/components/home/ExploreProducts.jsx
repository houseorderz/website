import { useMemo, useState } from 'react'
import SectionHeading from './SectionHeading.jsx'
import ProductCard from './ProductCard.jsx'

const tabs = [
  { id: 'new', label: 'NEW ARRIVAL' },
  { id: 'trending', label: 'TRENDING' },
  { id: 'best', label: 'BEST SELLING' },
  { id: 'popular', label: 'POPULAR' },
]

const allProducts = [
  { id: 'a1', group: 'new', price: 9732455, oldPrice: 9860000, rating: 4.8, reviews: 46 },
  { id: 'a2', group: 'new', price: 9732455, oldPrice: 9860000, rating: 4.6, reviews: 31 },
  { id: 'a3', group: 'new', price: 9732455, oldPrice: 9860000, rating: 4.7, reviews: 52 },
  { id: 'a4', group: 'trending', price: 9732455, oldPrice: 9860000, rating: 4.5, reviews: 28 },
  { id: 'a5', group: 'trending', price: 9732455, oldPrice: 9860000, rating: 4.4, reviews: 17 },
  { id: 'a6', group: 'trending', price: 9732455, oldPrice: 9860000, rating: 4.6, reviews: 39 },
  { id: 'a7', group: 'best', price: 9732455, oldPrice: 9860000, rating: 4.9, reviews: 64 },
  { id: 'a8', group: 'best', price: 9732455, oldPrice: 9860000, rating: 4.7, reviews: 41 },
  { id: 'a9', group: 'best', price: 9732455, oldPrice: 9860000, rating: 4.8, reviews: 53 },
  { id: 'a10', group: 'popular', price: 9732455, oldPrice: 9860000, rating: 4.6, reviews: 22 },
  { id: 'a11', group: 'popular', price: 9732455, oldPrice: 9860000, rating: 4.5, reviews: 19 },
  { id: 'a12', group: 'popular', price: 9732455, oldPrice: 9860000, rating: 4.7, reviews: 35 },
]

export default function ExploreProducts() {
  const [active, setActive] = useState('trending')

  const products = useMemo(() => {
    const filtered = allProducts.filter((p) => p.group === active)
    return filtered.length ? filtered : allProducts.slice(0, 8)
  }, [active])

  return (
    <section className="space-y-6">
      <SectionHeading title="Explore Our Products" />

      <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-semibold">
        {tabs.map((t) => {
          const isActive = t.id === active
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              className={[
                'relative px-2 py-1.5 transition',
                isActive ? 'text-orange-500' : 'text-zinc-500 hover:text-zinc-900',
              ].join(' ')}
            >
              {t.label}
              {isActive ? (
                <span className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded bg-orange-500" />
              ) : null}
            </button>
          )
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.slice(0, 8).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}

