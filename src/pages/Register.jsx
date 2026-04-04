import { Link } from 'react-router-dom'

export default function Register() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 lg:hidden">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-orange-500/10 text-orange-600 ring-1 ring-orange-500/15">
            W
          </span>
          Wearify
        </div>
        <Link to="/" className="text-sm text-zinc-600 hover:text-zinc-900">
          Back to home
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900">
          Create your Wearify account
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Join to save favorites and enjoy a faster checkout.
        </p>
      </div>

      <form className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-zinc-700">Name</label>
          <input
            className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-500/10"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-zinc-700">Email</label>
          <input
            type="email"
            className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-500/10"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-zinc-700">Password</label>
          <input
            type="password"
            className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-500/10"
            placeholder="••••••••"
          />
        </div>
        <button
          type="button"
          className="inline-flex w-full items-center justify-center rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30"
        >
          Create account
        </button>

        <p className="text-center text-sm text-zinc-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-orange-600">
            Log in
          </Link>
        </p>
      </form>
    </div>
  )
}

