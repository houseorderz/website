import { NavLink, Outlet } from 'react-router-dom'

const image =
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80'

export default function AuthLayout() {
  return (
    <div className="min-h-dvh bg-white">
      <div className="grid min-h-dvh lg:grid-cols-2">
        <section className="relative hidden overflow-hidden lg:block">
          <img
            src={image}
            alt="Fashion"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/35" />

          <div className="relative flex h-full flex-col justify-between p-10 text-white">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 text-sm font-semibold">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 ring-1 ring-white/20">
                  W
                </span>
                Wearify
              </div>

              <NavLink
                to="/"
                className="text-sm text-white/90 underline-offset-4 hover:underline"
              >
                Back to home
              </NavLink>
            </div>

            <div className="max-w-md">
              <p className="text-2xl font-extrabold leading-tight">
                “Simply all the styles that my wardrobe and I need.”
              </p>
              <div className="mt-6">
                <p className="text-sm font-semibold">Karen Yue</p>
                <p className="mt-1 text-xs text-white/80">
                  Director of Digital Marketing Technology
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  )
}

