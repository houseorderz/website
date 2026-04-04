const images = {
  winter:
    'https://images.unsplash.com/photo-1520975958225-0d2a3b2d8d11?auto=format&fit=crop&w=1200&q=80',
  sneakers:
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
  fashion:
    'https://images.unsplash.com/photo-1520975869018-4d0b3f3e3c2f?auto=format&fit=crop&w=1200&q=80',
  arrival:
    'https://images.unsplash.com/photo-1520975661595-6453be3f7070?auto=format&fit=crop&w=1200&q=80',
}

function Banner({ className = '', children }) {
  return (
    <div
      className={[
        'relative overflow-hidden rounded-none bg-white shadow-sm ring-1 ring-zinc-200',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}

function BigWinterSale() {
  return (
    <Banner className="bg-[#fbf4e8]">
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_20%_20%,rgba(251,146,60,0.20),transparent_65%),radial-gradient(60%_60%_at_75%_35%,rgba(244,63,94,0.12),transparent_60%)]" />
      <div className="relative grid min-h-[260px] gap-6 p-6 sm:p-8">
        <div className="max-w-[320px]">
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">
            Super
          </p>
          <p className="mt-1 text-3xl font-extrabold tracking-tight text-zinc-900">
            Winter Sale
          </p>
          <p className="mt-4 text-sm text-zinc-700">Get</p>

          <div className="mt-3 flex items-center gap-3">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-orange-200/60 text-xl font-black text-zinc-900 ring-1 ring-black/5">
              65%
            </span>
            <span className="text-sm font-semibold text-zinc-700">Off</span>
          </div>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-600 ring-1 ring-orange-500/20">
            Latest Fashion
          </div>
        </div>

        <div className="absolute bottom-0 right-0 hidden h-full w-[56%] sm:block">
          <img
            src={images.winter}
            alt="Winter sale"
            className="h-full w-full object-cover opacity-90"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-linear-to-l from-transparent via-transparent to-[#fbf4e8]" />
        </div>
      </div>
    </Banner>
  )
}

function SmallNewArrival() {
  return (
    <Banner className="min-h-[155px]">
      <div className="absolute inset-0 bg-linear-to-br from-white via-white to-sky-50" />
      <div className="relative grid h-full grid-cols-[1fr,120px] items-center gap-4 p-6">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wide text-sky-600">
            New Fashion
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            New Arrival
          </p>
        </div>
        <div className="relative h-24 w-full overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-zinc-200">
          <img
            src={images.arrival}
            alt="New arrival"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </Banner>
  )
}

function SmallShoes() {
  return (
    <Banner className="min-h-[155px]">
      <div className="absolute inset-0 bg-linear-to-br from-orange-50 via-amber-50 to-rose-50" />
      <div className="relative grid h-full grid-cols-[1fr,120px] items-center gap-4 p-6">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wide text-orange-600">
            Shoes
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            New Arrival
          </p>
        </div>
        <div className="relative h-24 w-full overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-zinc-200">
          <img
            src={images.sneakers}
            alt="Shoes"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </Banner>
  )
}

function WideFashionCollection() {
  return (
    <Banner className="min-h-[170px]">
      <div className="absolute inset-0 bg-linear-to-r from-sky-50 via-white to-orange-50" />
      <div className="absolute -left-14 top-1/2 h-56 w-56 -translate-y-1/2 rotate-12 bg-sky-600/15" />
      <div className="absolute left-24 top-1/2 h-56 w-56 -translate-y-1/2 rotate-12 bg-orange-500/15" />

      <div className="relative grid h-full grid-cols-1 gap-6 p-6 sm:grid-cols-[1fr,220px] sm:items-center">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wide text-orange-600">
            Fashion
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Collection
          </p>
        </div>

        <div className="relative h-28 w-full overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-zinc-200 sm:h-32">
          <img
            src={images.fashion}
            alt="Fashion collection"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute -left-10 -top-10 h-24 w-24 rotate-12 rounded-2xl bg-orange-500/15" />
          <div className="absolute -bottom-10 -right-10 h-24 w-24 rotate-12 rounded-2xl bg-sky-600/15" />
        </div>
      </div>
    </Banner>
  )
}

export default function Offers() {
  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
          Best Month offer
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-xs leading-5 text-zinc-600">
          Eroti pellentesque curabitur euismod dui etiam pellentesque rhoncus
          fermentum tristique lobortis lectus magnis. Consequat porta turpis
          maecenas.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <BigWinterSale />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          <SmallNewArrival />
          <SmallShoes />
          <div className="sm:col-span-2">
            <WideFashionCollection />
          </div>
        </div>
      </div>
    </section>
  )
}

