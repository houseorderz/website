function IconWrap({ children }) {
  return (
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/10 text-orange-600 ring-1 ring-orange-500/15">
      {children}
    </span>
  )
}

function ContactRow({ icon, title, value }) {
  return (
    <div className="flex items-start gap-3">
      <IconWrap>{icon}</IconWrap>
      <div>
        <p className="text-sm font-semibold text-zinc-900">{title}</p>
        <p className="mt-1 text-sm text-zinc-600">{value}</p>
      </div>
    </div>
  )
}

export default function Contact() {
  return (
    <div className="space-y-8 py-10">
      <header className="space-y-3">
        <p className="text-xs font-semibold text-orange-500">Contact us</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
          Get in Touch with Our Team
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-zinc-600">
          We’re here to answer your questions, discuss your project, and help you
          find the best solutions for your style needs. Reach out to us, and
          let’s start building something great together.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 sm:p-8">
          <h2 className="text-base font-extrabold text-zinc-900">
            Let’s Talk About Your Project
          </h2>

          <form className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-900">Name</label>
              <input
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-500/10"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-900">
                Email Address
              </label>
              <input
                type="email"
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-500/10"
                placeholder="We’ll get back to you here"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-900">
                Company Name
              </label>
              <input
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-500/10"
                placeholder="Let us know who you represent"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-900">Subject</label>
              <input
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-500/10"
                placeholder="What’s this about?"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-900">Message</label>
              <textarea
                rows={5}
                className="mt-2 w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-500/10"
                placeholder="Tell us how we can help"
              />
            </div>

            <button
              type="button"
              className="inline-flex w-full items-center justify-center rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30"
            >
              Send Message
            </button>
          </form>
        </section>

        <aside className="space-y-6">
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 sm:p-8">
            <h2 className="text-base font-extrabold text-zinc-900">
              Prefer a Direct Approach?
            </h2>

            <div className="mt-5 space-y-4">
              <ContactRow
                title="+62-8234-5674-8901"
                value="Call us anytime"
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.9.32 1.77.57 2.62a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.46-1.09a2 2 0 0 1 2.11-.45c.85.25 1.72.45 2.62.57A2 2 0 0 1 22 16.92Z" />
                  </svg>
                }
              />
              <ContactRow
                title="contact@wearify.com"
                value="We reply within 24 hours"
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 4h16v16H4z" />
                    <path d="m22 6-10 7L2 6" />
                  </svg>
                }
              />
              <ContactRow
                title="Monday to Friday, 9 AM - 6 PM"
                value="Business hours"
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v6l4 2" />
                  </svg>
                }
              />
            </div>
          </section>

          <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-200">
            <div className="h-48 bg-[linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] bg-size-[24px_24px]">
              <div className="h-full w-full bg-[radial-gradient(45%_60%_at_30%_40%,rgba(251,146,60,0.20),transparent_70%)]" />
            </div>

            <div className="p-6 sm:p-8">
              <h3 className="text-base font-extrabold text-zinc-900">
                Visit Our Office
              </h3>
              <p className="mt-2 text-sm text-zinc-600">
                123 Fashion Street, Innovation City, Wearland 56789
              </p>

              <button
                type="button"
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/20"
              >
                Get a Direction
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}

