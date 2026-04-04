const categories = [
  {
    name: 'Leather Jacket',
    count: 12,
    img: 'https://images.unsplash.com/photo-1520974735194-6c3b1d9fe8f8?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Women Dress',
    count: 12,
    img: 'https://images.unsplash.com/photo-1520975661595-6453be3f7070?auto=format&fit=crop&w=600&q=80',
    featured: true,
  },
  {
    name: 'Formal Shoe',
    count: 12,
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Sweat Shirt',
    count: 12,
    img: 'https://images.unsplash.com/photo-1520975958225-0d2a3b2d8d11?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Hill Shoe',
    count: 12,
    img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Formal Dress',
    count: 12,
    img: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=300&q=80',
  },
]

function CategoryAvatar({ src, alt }) {
  return (
    <div className="relative h-[72px] w-[72px] overflow-hidden rounded-full bg-zinc-100">
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        loading="lazy"
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-black/10" />
    </div>
  )
}

export default function Categories() {
  return (
    <section className="bg-white py-10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-center gap-x-10 gap-y-6 px-4 sm:px-6 lg:px-8">
        {categories.map((c, idx) => (
          <button
            key={c.name}
            type="button"
            className="group flex w-[96px] flex-col items-center gap-2 text-center"
          >
            <div className="relative">
              <div className="rounded-full p-1 ring-1 ring-zinc-300 transition group-hover:ring-zinc-400">
                <CategoryAvatar src={c.img} alt={c.name} />
              </div>
              {c.featured || idx === 1 ? (
                <span className="absolute inset-0 rounded-full border-2 border-emerald-400/70 border-dotted" />
              ) : null}
            </div>

            <div className="text-[11px] font-semibold text-zinc-900">
              {c.name}
            </div>
            <div className="text-[11px] text-zinc-500">({c.count})</div>
          </button>
        ))}
      </div>
    </section>
  )
}

