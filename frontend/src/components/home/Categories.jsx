import { useEffect, useState } from 'react'
import { apiJson } from '../../lib/api.js'

function CategoryTile({ name }) {
  const initial = name.trim().charAt(0).toUpperCase() || '?'
  return (
    <div className="flex h-[72px] w-[72px] items-center justify-center rounded-xl bg-zinc-100 text-lg font-bold text-zinc-400 ring-1 ring-zinc-200 transition group-hover:bg-zinc-50 group-hover:ring-zinc-300">
      {initial}
    </div>
  )
}

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const data = await apiJson('/categories')
        if (!cancelled) {
          setCategories(Array.isArray(data.categories) ? data.categories : [])
        }
      } catch {
        if (!cancelled) {
          setError('Could not load categories')
          setCategories([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="bg-white py-10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-center gap-x-10 gap-y-6 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <p className="w-full text-center text-sm text-zinc-500">
            Loading categories…
          </p>
        ) : null}
        {error && !loading ? (
          <p className="w-full text-center text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
        {!loading &&
          categories.map((c) => (
            <button
              key={c.id}
              type="button"
              className="group flex w-[96px] flex-col items-center gap-2 text-center"
            >
              <div className="rounded-xl p-1 ring-1 ring-zinc-300 transition group-hover:ring-zinc-400">
                <CategoryTile name={c.name} />
              </div>
              <div className="text-[11px] font-semibold text-zinc-900">
                {c.name}
              </div>
              <div className="text-[11px] text-zinc-500">
                ({c.productCount ?? c.itemCount ?? 0})
              </div>
            </button>
          ))}
      </div>
    </section>
  )
}
