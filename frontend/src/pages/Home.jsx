export default function Home() {
  return (
    <div className="space-y-10">
      <Hero />
      <Categories />
      <Offers />
      <ExploreProducts />
      <FeaturedProducts />
      <DealOfDay />
    </div>
  )
}

import Hero from '../components/home/Hero.jsx'
import Categories from '../components/home/Categories.jsx'
import Offers from '../components/home/Offers.jsx'
import ExploreProducts from '../components/home/ExploreProducts.jsx'
import FeaturedProducts from '../components/home/FeaturedProducts.jsx'
import DealOfDay from '../components/home/DealOfDay.jsx'

