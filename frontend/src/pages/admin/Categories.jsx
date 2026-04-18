import { useCallback, useEffect, useMemo, useState } from 'react'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'
import DashboardPage from '../../components/DashboardPage.jsx'
import { useAuth } from '../../context/useAuth.js'
import { useToast } from '../../context/useToast.js'
import { apiJson, ApiError } from '../../lib/api.js'

const inputClass =
  'mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-500/10'

function CategoryVisual({ name }) {
  const initial = name.trim().charAt(0).toUpperCase() || '?'
  return (
    <div className="flex aspect-square w-full max-w-[120px] items-center justify-center rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-50 text-3xl font-bold text-orange-500/90 ring-1 ring-zinc-200/80 sm:text-4xl">
      {initial}
    </div>
  )
}

export default function AdminCategories() {
  const { token } = useAuth()
  const { showToast } = useToast()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('order')

  const [addOpen, setAddOpen] = useState(false)
  const [editCategory, setEditCategory] = useState(null)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const emptyForm = { name: '', slug: '', sortOrder: '' }
  const [form, setForm] = useState(emptyForm)

  const loadCategories = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const data = await apiJson('/categories')
      setCategories(Array.isArray(data.categories) ? data.categories : [])
    } catch (err) {
      setLoadError(
        err instanceof ApiError ? err.message : 'Could not load categories.',
      )
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  const filtered = useMemo(() => {
    let list = [...categories]
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.slug && c.slug.toLowerCase().includes(q)),
      )
    }
    if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'products') {
      list.sort(
        (a, b) =>
          (b.productCount ?? b.itemCount ?? 0) -
          (a.productCount ?? a.itemCount ?? 0),
      )
    } else {
      list.sort(
        (a, b) =>
          (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || (a.id ?? 0) - (b.id ?? 0),
      )
    }
    return list
  }, [categories, search, sortBy])

  function openAdd() {
    setFormError('')
    setForm({ ...emptyForm })
    setAddOpen(true)
  }

  function openEdit(c) {
    setFormError('')
    setForm({
      name: c.name,
      slug: c.slug || '',
      sortOrder: String(c.sortOrder ?? 0),
    })
    setEditCategory(c)
  }

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function submitCreate(e) {
    e.preventDefault()
    if (!token) return
    setFormError('')
    setSaving(true)
    try {
      const body = { name: form.name.trim() }
      const soRaw = form.sortOrder.trim()
      if (soRaw !== '') {
        const so = Math.floor(Number(soRaw))
        if (!Number.isFinite(so)) {
          setFormError('Sort order must be a number.')
          setSaving(false)
          return
        }
        body.sortOrder = so
      }
      if (form.slug.trim()) body.slug = form.slug.trim().toLowerCase()
      await apiJson('/categories', { method: 'POST', token, body })
      setAddOpen(false)
      await loadCategories()
      showToast({ message: 'Category created.' })
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : 'Could not create category.',
      )
    } finally {
      setSaving(false)
    }
  }

  async function submitEdit(e) {
    e.preventDefault()
    if (!token || !editCategory) return
    setFormError('')
    setSaving(true)
    try {
      const patch = {
        name: form.name.trim(),
        slug: form.slug.trim().toLowerCase(),
      }
      const soRaw = form.sortOrder.trim()
      if (soRaw !== '') {
        const so = Math.floor(Number(soRaw))
        if (!Number.isFinite(so)) {
          setFormError('Sort order must be a number.')
          setSaving(false)
          return
        }
        patch.sortOrder = so
      }
      await apiJson(`/categories/${editCategory.id}`, {
        method: 'PATCH',
        token,
        body: patch,
      })
      setEditCategory(null)
      await loadCategories()
      showToast({ message: 'Category updated.' })
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : 'Could not update category.',
      )
    } finally {
      setSaving(false)
    }
  }

  async function performDelete() {
    if (!token || !deleteTarget) return
    const name = deleteTarget.name
    const id = deleteTarget.id
    try {
      await apiJson(`/categories/${id}`, { method: 'DELETE', token })
      setDeleteTarget(null)
      await loadCategories()
      showToast({ message: `“${name}” has been deleted.` })
    } catch (err) {
      showToast({
        variant: 'error',
        message:
          err instanceof ApiError ? err.message : 'Could not delete category.',
      })
    }
  }

  const formFields = (
    <>
      {formError ? (
        <p
          className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          role="alert"
        >
          {formError}
        </p>
      ) : null}
      <div>
        <label className="text-xs font-semibold text-zinc-700" htmlFor="cf-name">
          Name
        </label>
        <input
          id="cf-name"
          className={inputClass}
          value={form.name}
          onChange={(e) => updateField('name', e.target.value)}
          required
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-zinc-700" htmlFor="cf-slug">
          URL slug
        </label>
        <input
          id="cf-slug"
          className={inputClass}
          value={form.slug}
          onChange={(e) => updateField('slug', e.target.value.toLowerCase())}
          placeholder={addOpen ? 'Leave empty to auto-generate from name' : ''}
        />
        <p className="mt-1 text-xs text-zinc-500">
          Lowercase letters, numbers, and hyphens. Used as{' '}
          <span className="font-medium">category_slug</span> on products.
        </p>
      </div>
      <div>
        <label
          className="text-xs font-semibold text-zinc-700"
          htmlFor="cf-sort"
        >
          Sort order
        </label>
        <input
          id="cf-sort"
          type="number"
          className={inputClass}
          value={form.sortOrder}
          onChange={(e) => updateField('sortOrder', e.target.value)}
          placeholder="e.g. 1"
        />
        <p className="mt-1 text-xs text-zinc-500">
          Lower numbers appear first in lists. Leave empty on create to append
          at the end.
        </p>
      </div>
    </>
  )

  return (
    <DashboardPage
      title="Categories"
      subtitle="View and manage catalog categories easily."
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative min-w-0 flex-1 lg:max-w-md">
            <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 ps-10 pe-4 text-sm text-zinc-900 outline-none ring-orange-500/20 focus:border-orange-300 focus:ring-2"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 shadow-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-500/20"
            >
              <option value="order">Sort: list order</option>
              <option value="name">Sort: name</option>
              <option value="products">Sort: product count</option>
            </select>
            <button
              type="button"
              onClick={openAdd}
              className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/40"
            >
              Add category
            </button>
          </div>
        </div>

        {loading ? (
          <p className="py-12 text-center text-sm text-zinc-500">
            Loading categories…
          </p>
        ) : loadError ? (
          <p
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {loadError}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filtered.map((c) => (
              <article
                key={c.id}
                className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative border-b border-zinc-100 bg-zinc-50/80">
                  <span className="absolute start-2 top-2">
                    <input
                      type="checkbox"
                      disabled
                      className="h-3.5 w-3.5 rounded border-zinc-300"
                      aria-hidden="true"
                    />
                  </span>
                  <div className="flex aspect-square items-center justify-center p-3 sm:p-4">
                    <CategoryVisual name={c.name} />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-3">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="inline-flex max-w-[72%] items-center rounded-full bg-zinc-100 px-1.5 py-0.5 text-[9px] font-semibold text-zinc-700 sm:text-[10px]">
                      <span className="truncate font-mono">{c.slug}</span>
                    </span>
                    <span className="shrink-0 text-[10px] font-semibold text-orange-600 sm:text-xs">
                      #{c.sortOrder ?? 0}
                    </span>
                  </div>
                  <h3 className="mt-1.5 line-clamp-2 text-xs font-bold leading-snug text-zinc-900 sm:text-[13px]">
                    {c.name}
                  </h3>
                  <div className="mt-2 grid grid-cols-2 gap-1.5 text-[10px] sm:text-xs">
                    <div>
                      <p className="font-medium text-zinc-500">Products</p>
                      <p className="font-semibold text-zinc-900">
                        {c.productCount ?? c.itemCount ?? 0}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-zinc-500">Sort</p>
                      <p className="font-semibold text-zinc-900">
                        {c.sortOrder ?? 0}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEdit(c)}
                      className="flex-1 rounded-lg border border-zinc-200 bg-white py-2 text-[11px] font-semibold text-zinc-900 transition hover:bg-zinc-50 sm:text-xs"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(c)}
                      className="flex-1 rounded-lg border border-red-200 bg-white py-2 text-[11px] font-semibold text-red-600 transition hover:bg-red-50 sm:text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && !loadError && filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-zinc-500">
            No categories match your search.
          </p>
        ) : null}
      </div>

      {addOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setAddOpen(false)
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-category-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="add-category-title"
              className="text-lg font-bold text-zinc-900"
            >
              Add category
            </h2>
            <form className="mt-6 space-y-4" onSubmit={submitCreate}>
              {formFields}
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="submit"
                  disabled={saving || !token}
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Create category'}
                </button>
                <button
                  type="button"
                  onClick={() => setAddOpen(false)}
                  className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {editCategory ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditCategory(null)
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-category-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="edit-category-title"
              className="text-lg font-bold text-zinc-900"
            >
              Edit category
            </h2>
            <form className="mt-6 space-y-4" onSubmit={submitEdit}>
              {formFields}
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="submit"
                  disabled={saving || !token}
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditCategory(null)}
                  className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete category?"
        message={
          deleteTarget
            ? `Delete “${deleteTarget.name}”? This cannot be undone. Categories that still have products cannot be removed.`
            : ''
        }
        confirmLabel="Delete"
        danger
        onCancel={() => setDeleteTarget(null)}
        onConfirm={performDelete}
      />
    </DashboardPage>
  )
}
