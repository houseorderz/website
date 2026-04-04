import { Link } from 'react-router-dom'

function CountBox({ label, value }) {
  return (
    <div className="flex flex-col items-center rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-zinc-200">
      <div className="text-lg font-extrabold text-zinc-900">{value}</div>
      <div className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
        {label}
      </div>
    </div>
  )
}

export default function DealOfDay() {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 sm:p-8">
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-zinc-900">
          Deal
          <br />
          Of The Day
        </h3>
        <p className="mt-4 text-xs leading-5 text-zinc-600">
          Click shop now for all deal of the product. Lorem ipsum has been the
          industry standard dummy text ever since the 1500s, when an unknown
          printer took a galley of type.
        </p>

        <div className="mt-6 grid grid-cols-4 gap-2">
          <CountBox label="Days" value="08" />
          <CountBox label="Hours" value="12" />
          <CountBox label="Mins" value="45" />
          <CountBox label="Secs" value="30" />
        </div>

        <Link
          to="/products"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40"
        >
          Shop Now
        </Link>
      </div>

      <div className="relative overflow-hidden rounded-2xl shadow-sm ring-1 ring-zinc-200">
        <div className="absolute inset-0 bg-linear-to-r from-orange-500 via-rose-500 to-amber-400" />
        <div className="absolute inset-0 bg-[radial-gradient(40%_60%_at_20%_50%,rgba(255,255,255,0.35),transparent_70%)]" />
        <div className="relative grid h-full place-items-center p-6 text-white sm:p-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/90">
              Final
            </p>
            <p className="mt-1 text-4xl font-black tracking-tight">SALE</p>
            <p className="mt-1 text-sm font-semibold">up to 50% off</p>
            <p className="mt-4 text-xs text-white/90">Your Text Here</p>
          </div>
        </div>
      </div>
    </section>
  )
}

