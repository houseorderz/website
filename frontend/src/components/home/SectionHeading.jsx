export default function SectionHeading({ title, subtitle, align = 'center' }) {
  const alignClass =
    align === 'left' ? 'text-left items-start' : 'text-center items-center'

  return (
    <div className={`flex flex-col gap-2 ${alignClass}`}>
      <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="max-w-2xl text-sm leading-6 text-zinc-600">{subtitle}</p>
      ) : null}
    </div>
  )
}

