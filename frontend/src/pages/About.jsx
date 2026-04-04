import { Link } from 'react-router-dom'
import { Container } from '../components/Container.jsx'

const images = {
  desk:
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
}

const logos = [
  'smartcat',
  'taskus',
  'traktor',
  'taskcode',
  'taskrabbit',
  'acme corp',
  'lightbox',
  'boltshift',
]

function Stat({ value, label }) {
  return (
    <div className="rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-zinc-200">
      <div className="text-2xl font-extrabold tracking-tight text-zinc-900">
        {value}
      </div>
      <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
        {label}
      </div>
    </div>
  )
}

export default function About() {
  return (
    <div className="space-y-10">
      <section className="relative left-1/2 right-1/2 w-screen -ml-[50vw] -mr-[50vw] overflow-hidden rounded-none bg-[#fbf4e8]">
        <Container className="relative">
          <div className="grid gap-8 py-10 sm:py-14 lg:grid-cols-2 lg:items-center">
            <div className="max-w-xl">
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
                Fuel Your <span className="text-orange-500">Style</span> with
                Modern Essentials
              </h1>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Wearify helps you build an elegant wardrobe with minimal pieces.
                Clean design, premium feel, and a smooth shopping experience across
                all devices.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center rounded-md bg-orange-500 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40"
                >
                  Get Started
                </Link>

                <div className="flex items-center gap-2 text-xs text-zinc-600">
                  <span className="inline-flex items-center gap-1 font-semibold text-zinc-900">
                    <svg
                      viewBox="0 0 20 20"
                      width="14"
                      height="14"
                      aria-hidden="true"
                      className="text-orange-400"
                    >
                      <path
                        d="M10 15.3 4.12 18.6l1.12-6.53L.5 7.4l6.56-.95L10 0.5l2.94 5.95 6.56.95-4.74 4.67 1.12 6.53L10 15.3Z"
                        fill="currentColor"
                      />
                    </svg>
                    4.8
                  </span>
                  <span className="text-zinc-500">based on reviews</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="mx-auto max-w-md overflow-hidden rounded-none bg-white shadow-sm ring-1 ring-zinc-200">
                <img
                  src={images.desk}
                  alt="About Wearify"
                  className="h-56 w-full object-cover sm:h-64"
                  loading="lazy"
                />
                <div className="flex items-center justify-between gap-4 p-4">
                  <div className="flex -space-x-2">
                    {['A', 'M', 'S'].map((c) => (
                      <div
                        key={c}
                        className="grid h-7 w-7 place-items-center rounded-full bg-linear-to-br from-orange-200 to-rose-200 text-[11px] font-bold text-zinc-800 ring-2 ring-white"
                      >
                        {c}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-zinc-700">
                    12k+ happy customers
                  </p>
                </div>
              </div>

              <div className="pointer-events-none absolute -left-3 top-6 hidden sm:block">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-sm ring-1 ring-black/5">
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
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
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="rounded-3xl bg-white py-6 shadow-sm ring-1 ring-zinc-200">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 px-6 text-xs font-semibold uppercase tracking-wide text-zinc-400 sm:px-10">
          {logos.map((l) => (
            <span key={l} className="opacity-70">
              {l}
            </span>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 sm:p-10 lg:grid-cols-2 lg:items-start">
        <div className="max-w-xl">
          <p className="text-sm font-extrabold text-zinc-900">
            Empowering your success
            <span className="block text-zinc-400">with our solutions</span>
          </p>
          <p className="mt-4 text-sm leading-6 text-zinc-600">
            Struggling to pick the right outfits? Our users found the perfect
            essentials with Wearify. By simplifying product discovery and
            boosting confidence, they’ve achieved more with less time.
          </p>
          <p className="mt-4 text-sm leading-6 text-zinc-600">
            This page layout is ready to scale: connect real analytics, testimonials,
            and content as you grow.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Stat value="15k" label="Global downloads" />
          <Stat value="$20M" label="Return investment" />
          <Stat value="200+" label="5-star reviews" />
          <Stat value="500" label="Projects completed" />
        </div>
      </section>
    </div>
  )
}

