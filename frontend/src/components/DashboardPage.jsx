export default function DashboardPage({ title, subtitle, children }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-2 text-sm text-zinc-500 sm:text-base">{subtitle}</p>
      ) : null}
      {children ? (
        <div className={subtitle ? 'mt-8' : 'mt-6'}>{children}</div>
      ) : null}
    </div>
  )
}
