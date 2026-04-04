import SectionHeading from './SectionHeading.jsx'
import ProductCard from './ProductCard.jsx'

const featured = [
  { id: 'f1', price: 9732455, oldPrice: 9860000, rating: 4.7, reviews: 33 },
  { id: 'f2', price: 9732455, oldPrice: 9860000, rating: 4.8, reviews: 48 },
  { id: 'f3', price: 9732455, oldPrice: 9860000, rating: 4.6, reviews: 21 },
  { id: 'f4', price: 9732455, oldPrice: 9860000, rating: 4.5, reviews: 16 },
]

export default function FeaturedProducts() {
  return (
    <section className="space-y-6">
      <SectionHeading title="Our Featured Products" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}

