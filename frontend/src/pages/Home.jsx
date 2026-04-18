export default function Home() {
  return (
    <div className="space-y-10">
      <Hero />
      <Categories />
      <FeaturedProducts />
    </div>
  )
}

import Hero from '../components/home/Hero.jsx'
import Categories from '../components/home/Categories.jsx'
import FeaturedProducts from '../components/home/FeaturedProducts.jsx'

