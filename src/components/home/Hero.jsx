import { Link } from 'react-router-dom'
import { Container } from '../Container.jsx'

const images = {
  denim:
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80',
  model:
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80',
}

function DecorSparkle() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-orange-400"
      aria-hidden="true"
    >
      <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2Z" />
    </svg>
  )
}

function OvalPhoto({ className = '', src, alt }) {
  return (
    <div
      className={[
        'relative overflow-hidden rounded-[999px] border border-black/5 bg-white shadow-sm',
        className,
      ].join(' ')}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        loading="lazy"
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-black/10" />
    </div>
  )
}

export default function Hero() {
  return (
    <section className="relative left-1/2 right-1/2 w-screen -ml-[50vw] -mr-[50vw] overflow-hidden bg-[#fbf4e8]">
      <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_85%_30%,rgba(251,146,60,0.18),transparent_60%),radial-gradient(70%_70%_at_20%_20%,rgba(244,63,94,0.10),transparent_65%)]" />

      <Container className="relative">
        <div className="relative grid gap-10 py-10 sm:py-14 lg:grid-cols-2 lg:items-center">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold text-orange-500">
              Dive in and Explore
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
              Start Shopping Now!
            </h1>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Explore our curated collections and find the perfect item that speaks
              to your style and needs. With just a click, begin your journey.
            </p>

            <div className="mt-6">
              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-md bg-orange-500 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40"
              >
                Shop Now
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -left-2 top-10 rotate-6">
              <DecorSparkle />
            </div>

            <div className="absolute right-6 top-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-sm ring-1 ring-black/5">
                <DecorSparkle />
              </span>
            </div>

            <div className="absolute left-1/2 top-0 -translate-x-1/2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5">
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-rose-500"
                  aria-hidden="true"
                >
                  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
                </svg>
              </span>
            </div>

            <div className="flex items-end justify-center gap-6">
              <OvalPhoto
                src={images.denim}
                alt="Denim collection"
                className="h-44 w-32 sm:h-52 sm:w-36"
              />
              <OvalPhoto
                src={images.model}
                alt="Fashion model"
                className="h-56 w-44 sm:h-64 sm:w-48"
              />
            </div>

            <div className="absolute -right-2 top-16 hidden sm:block">
              <svg
                viewBox="0 0 24 24"
                width="26"
                height="26"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-sky-500"
                aria-hidden="true"
              >
                <path d="M12 2l4 8h-8l4-8Z" />
                <path d="M6 10h12l-6 12-6-12Z" />
              </svg>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

