import { useCallback, useEffect, useMemo, useState } from 'react'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'
import DashboardPage from '../../components/DashboardPage.jsx'
import { useAuth } from '../../context/useAuth.js'
import { useToast } from '../../context/useToast.js'
import { apiJson, ApiError } from '../../lib/api.js'

function formatPrice(value) {
  return `$${Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function categoryLabel(slug) {
  if (!slug) return 'General'
  return slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')
}

const inputClass =
  'mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-500/10'

const TRASH_RETENTION_DAYS = 10
const TRASH_RETENTION_MS = TRASH_RETENTION_DAYS * 24 * 60 * 60 * 1000

function purgeCountdown(deletedAtIso) {
  if (!deletedAtIso) return ''
  const end = new Date(deletedAtIso).getTime() + TRASH_RETENTION_MS
  const ms = end - Date.now()
  if (ms <= 0) return 'Will be removed on the next cleanup run.'
  const days = Math.ceil(ms / (24 * 60 * 60 * 1000))
  return `Permanent deletion in ${days} day${days === 1 ? '' : 's'}`
}

function formatDeletedAt(iso) {
  if (!iso) return 'Deleted'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return 'Deleted'
  return `Deleted ${d.toLocaleDateString(undefined, { dateStyle: 'medium' })}`
}

export default function AdminProducts() {
  const { token } = useAuth()
  const { showToast } = useToast()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const [addOpen, setAddOpen] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [dbCategories, setDbCategories] = useState([])

  const emptyForm = {
    name: '',
    price: '',
    compareAtPrice: '',
    stock: '',
    image: '',
    category: '',
    description: '',
  }
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState(null)
  const [trashView, setTrashView] = useState(false)

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      if (trashView) {
        if (!token) {
          setLoadError('Sign in as admin to view trash.')
          setProducts([])
          return
        }
        const data = await apiJson('/products/trash', { token })
        setProducts(Array.isArray(data.products) ? data.products : [])
      } else {
        const data = await apiJson('/products')
        setProducts(Array.isArray(data.products) ? data.products : [])
      }
    } catch (err) {
      setLoadError(
        err instanceof ApiError ? err.message : 'Could not load products.',
      )
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [token, trashView])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  useEffect(() => {
    if (!addOpen || dbCategories.length === 0) return
    setForm((f) =>
      f.category ? f : { ...f, category: dbCategories[0].slug },
    )
  }, [addOpen, dbCategories])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await apiJson('/categories')
        if (!cancelled) {
          setDbCategories(Array.isArray(data.categories) ? data.categories : [])
        }
      } catch {
        if (!cancelled) setDbCategories([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const slugToCategoryName = useMemo(() => {
    const m = new Map()
    for (const c of dbCategories) {
      if (c.slug) m.set(c.slug, c.name)
    }
    return m
  }, [dbCategories])

  const categoryOptions = useMemo(() => {
    const s = new Set(products.map((p) => p.category).filter(Boolean))
    return ['all', ...Array.from(s).sort()]
  }, [products])

  const filtered = useMemo(() => {
    let list = products
    if (categoryFilter !== 'all') {
      list = list.filter((p) => p.category === categoryFilter)
    }
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.sku && p.sku.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q),
      )
    }
    return list
  }, [products, categoryFilter, search])

  function openAdd() {
    setFormError('')
    setForm({
      ...emptyForm,
      category: dbCategories[0]?.slug ?? '',
    })
    setAddOpen(true)
  }

  function openEdit(p) {
    setFormError('')
    setForm({
      name: p.name,
      price: String(p.price),
      compareAtPrice:
        p.compareAtPrice != null ? String(p.compareAtPrice) : '',
      stock: String(p.stock),
      image: p.image,
      category: p.category || dbCategories[0]?.slug || '',
      description: p.description || '',
    })
    setEditProduct(p)
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
      await apiJson('/products', {
        method: 'POST',
        token,
        body: {
          name: form.name.trim(),
          price: Number(form.price),
          stock: Number(form.stock),
          image: form.image.trim(),
          category: form.category.trim(),
          description: form.description,
          compareAtPrice: form.compareAtPrice.trim() || null,
        },
      })
      setAddOpen(false)
      await loadProducts()
      showToast({ message: 'Product created successfully.' })
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : 'Could not create product.',
      )
    } finally {
      setSaving(false)
    }
  }

  async function submitEdit(e) {
    e.preventDefault()
    if (!token || !editProduct) return
    setFormError('')
    setSaving(true)
    try {
      await apiJson(`/products/${editProduct.id}`, {
        method: 'PATCH',
        token,
        body: {
          name: form.name.trim(),
          price: Number(form.price),
          stock: Number(form.stock),
          image: form.image.trim(),
          category: form.category.trim(),
          description: form.description,
          compareAtPrice: form.compareAtPrice.trim() || null,
        },
      })
      setEditProduct(null)
      await loadProducts()
      showToast({ message: 'Product updated successfully.' })
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : 'Could not update product.',
      )
    } finally {
      setSaving(false)
    }
  }

  function requestDelete(p) {
    if (!token) return
    setDeleteTarget(p)
  }

  async function performDelete() {
    if (!token || !deleteTarget) return
    const name = deleteTarget.name
    const id = deleteTarget.id
    try {
      await apiJson(`/products/${id}`, { method: 'DELETE', token })
      setDeleteTarget(null)
      await loadProducts()
      showToast({
        message: `“${name}” moved to trash. You can restore it within ${TRASH_RETENTION_DAYS} days.`,
      })
    } catch (err) {
      showToast({
        variant: 'error',
        message:
          err instanceof ApiError ? err.message : 'Could not delete product.',
      })
    }
  }

  async function performRestore(p) {
    if (!token) return
    try {
      await apiJson(`/products/${p.id}/restore`, { method: 'POST', token })
      await loadProducts()
      showToast({ message: `“${p.name}” has been restored.` })
    } catch (err) {
      showToast({
        variant: 'error',
        message:
          err instanceof ApiError ? err.message : 'Could not restore product.',
      })
    }
  }

  function requestPermanentDelete(p) {
    if (!token) return
    setPermanentDeleteTarget(p)
  }

  async function performPermanentDelete() {
    if (!token || !permanentDeleteTarget) return
    const name = permanentDeleteTarget.name
    const id = permanentDeleteTarget.id
    try {
      await apiJson(`/products/${id}?permanent=1`, { method: 'DELETE', token })
      setPermanentDeleteTarget(null)
      await loadProducts()
      showToast({ message: `“${name}” permanently removed.` })
    } catch (err) {
      showToast({
        variant: 'error',
        message:
          err instanceof ApiError
            ? err.message
            : 'Could not delete product permanently.',
      })
    }
  }

  function priceLine(p) {
    if (p.compareAtPrice != null && p.compareAtPrice > p.price) {
      return `${formatPrice(p.price)} – ${formatPrice(p.compareAtPrice)}`
    }
    return formatPrice(p.price)
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
        <label className="text-xs font-semibold text-zinc-700" htmlFor="pf-name">
          Name
        </label>
        <input
          id="pf-name"
          className={inputClass}
          value={form.name}
          onChange={(e) => updateField('name', e.target.value)}
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold text-zinc-700" htmlFor="pf-price">
            Price
          </label>
          <input
            id="pf-price"
            type="number"
            step="0.01"
            min="0"
            className={inputClass}
            value={form.price}
            onChange={(e) => updateField('price', e.target.value)}
            required
          />
        </div>
        <div>
          <label
            className="text-xs font-semibold text-zinc-700"
            htmlFor="pf-compare"
          >
            Compare-at price (optional)
          </label>
          <input
            id="pf-compare"
            type="number"
            step="0.01"
            min="0"
            className={inputClass}
            value={form.compareAtPrice}
            onChange={(e) => updateField('compareAtPrice', e.target.value)}
            placeholder="Strike-through price"
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-zinc-700" htmlFor="pf-stock">
          Stock
        </label>
        <input
          id="pf-stock"
          type="number"
          min="0"
          className={inputClass}
          value={form.stock}
          onChange={(e) => updateField('stock', e.target.value)}
          required
        />
        <p className="mt-1 text-xs text-zinc-500">
          Sold count updates automatically when orders are fulfilled.
        </p>
      </div>
      <div>
        <label className="text-xs font-semibold text-zinc-700" htmlFor="pf-img">
          Image URL
        </label>
        <input
          id="pf-img"
          type="url"
          className={inputClass}
          value={form.image}
          onChange={(e) => updateField('image', e.target.value)}
          required
          placeholder="https://…"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-zinc-700" htmlFor="pf-cat">
          Category
        </label>
        <select
          id="pf-cat"
          className={inputClass}
          value={form.category}
          onChange={(e) => updateField('category', e.target.value)}
          required
          disabled={dbCategories.length === 0}
        >
          {dbCategories.length === 0 ? (
            <option value="">Loading categories…</option>
          ) : (
            <>
              <option value="" disabled>
                Select a category
              </option>
              {form.category &&
              !dbCategories.some((c) => c.slug === form.category) ? (
                <option value={form.category}>
                  {slugToCategoryName.get(form.category) || categoryLabel(form.category)}{' '}
                  (not in list)
                </option>
              ) : null}
              {dbCategories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </>
          )}
        </select>
        <p className="mt-1 text-xs text-zinc-500">
          Options come from your categories in the database.
        </p>
      </div>
      <div>
        <label className="text-xs font-semibold text-zinc-700" htmlFor="pf-desc">
          Description
        </label>
        <textarea
          id="pf-desc"
          rows={3}
          className={`${inputClass} resize-y`}
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
        />
      </div>
    </>
  )

  return (
    <DashboardPage
      title={trashView ? 'Trash' : 'Products'}
      subtitle={
        trashView
          ? `Restore products or delete them forever. Items older than ${TRASH_RETENTION_DAYS} days in trash are removed automatically.`
          : 'View and manage all listed products easily.'
      }
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
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 shadow-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-500/20"
            >
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c === 'all'
                    ? 'All categories'
                    : slugToCategoryName.get(c) || categoryLabel(c)}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                setTrashView((v) => !v)
                setSearch('')
                setCategoryFilter('all')
              }}
              title={trashView ? 'Back to products' : 'Open trash'}
              className={[
                'inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold shadow-sm transition focus-visible:outline-none focus-visible:ring-2',
                trashView
                  ? 'border-orange-300 bg-orange-50 text-orange-900 ring-2 ring-orange-500/25 hover:bg-orange-100'
                  : 'border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 focus-visible:ring-zinc-900/20',
              ].join(' ')}
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6" />
              </svg>
              Trash
            </button>
            {!trashView ? (
              <button
                type="button"
                onClick={openAdd}
                className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/40"
              >
                Add product
              </button>
            ) : null}
          </div>
        </div>

        {loading ? (
          <p className="py-12 text-center text-sm text-zinc-500">
            {trashView ? 'Loading trash…' : 'Loading products…'}
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
            {filtered.map((p) => (
              <article
                key={p.id}
                className={[
                  'flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md',
                  trashView
                    ? 'border-amber-200/90 ring-1 ring-amber-500/10'
                    : 'border-zinc-200',
                ].join(' ')}
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
                    <img
                      src={p.image}
                      alt=""
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        const el = e.currentTarget
                        if (el.dataset.fallbackApplied === '1') return
                        el.dataset.fallbackApplied = '1'
                        el.src =
                          'https://placehold.co/400x400/f4f4f5/71717a?text=Product'
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-3">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="inline-flex max-w-[58%] items-center rounded-full bg-zinc-100 px-1.5 py-0.5 text-[9px] font-semibold text-zinc-700 sm:text-[10px]">
                      <span className="truncate">
                        {slugToCategoryName.get(p.category) ||
                          categoryLabel(p.category)}
                      </span>
                    </span>
                    <span className="shrink-0 text-[10px] font-semibold text-zinc-800 sm:text-xs">
                      <span className="text-orange-500">★</span> 4.8
                      <span className="font-normal text-zinc-500">
                        {' '}
                        ({Number(p.sold).toLocaleString()})
                      </span>
                    </span>
                  </div>
                  <h3 className="mt-1.5 line-clamp-2 text-xs font-bold leading-snug text-zinc-900 sm:text-[13px]">
                    {p.name}
                  </h3>
                  <div className="mt-2 grid grid-cols-2 gap-1.5 text-[10px] sm:text-xs">
                    <div>
                      <p className="font-medium text-zinc-500">Price</p>
                      <p className="font-semibold text-zinc-900">{priceLine(p)}</p>
                    </div>
                    <div>
                      <p className="font-medium text-zinc-500">Stock</p>
                      <p className="font-semibold text-zinc-900">{p.stock} units</p>
                    </div>
                  </div>
                  {trashView ? (
                    <>
                      <p className="mt-2 text-[10px] leading-snug text-zinc-500 sm:text-xs">
                        {formatDeletedAt(p.deletedAt)}
                        {p.deletedAt ? (
                          <>
                            <span className="mx-1 text-zinc-300">·</span>
                            <span className="text-amber-800/90">
                              {purgeCountdown(p.deletedAt)}
                            </span>
                          </>
                        ) : null}
                      </p>
                      <div className="mt-3 flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => performRestore(p)}
                          className="flex-1 rounded-lg border border-emerald-200 bg-emerald-50/80 py-2 text-[11px] font-semibold text-emerald-800 transition hover:bg-emerald-100 sm:text-xs"
                        >
                          Restore
                        </button>
                        <button
                          type="button"
                          onClick={() => requestPermanentDelete(p)}
                          className="flex-1 rounded-lg border border-red-200 bg-white py-2 text-[11px] font-semibold text-red-600 transition hover:bg-red-50 sm:text-xs"
                        >
                          Delete forever
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="mt-3 flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEdit(p)}
                        className="flex-1 rounded-lg border border-zinc-200 bg-white py-2 text-[11px] font-semibold text-zinc-900 transition hover:bg-zinc-50 sm:text-xs"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => requestDelete(p)}
                        className="flex-1 rounded-lg border border-red-200 bg-white py-2 text-[11px] font-semibold text-red-600 transition hover:bg-red-50 sm:text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && !loadError && filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-zinc-500">
            {trashView
              ? 'Trash is empty.'
              : 'No products match your filters.'}
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
            aria-labelledby="add-product-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="add-product-title" className="text-lg font-bold text-zinc-900">
              Add product
            </h2>
            <form className="mt-6 space-y-4" onSubmit={submitCreate}>
              {formFields}
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="submit"
                  disabled={saving || !token}
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Create product'}
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

      {editProduct ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditProduct(null)
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-product-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="edit-product-title" className="text-lg font-bold text-zinc-900">
              Edit product
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
                  onClick={() => setEditProduct(null)}
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
        title="Move to trash?"
        message={
          deleteTarget
            ? `Move “${deleteTarget.name}” to trash? It will be hidden from the store. You can restore it from Trash within ${TRASH_RETENTION_DAYS} days.`
            : ''
        }
        confirmLabel="Move to trash"
        danger
        onCancel={() => setDeleteTarget(null)}
        onConfirm={performDelete}
      />

      <ConfirmDialog
        open={Boolean(permanentDeleteTarget)}
        title="Delete forever?"
        message={
          permanentDeleteTarget
            ? `Permanently delete “${permanentDeleteTarget.name}”? This cannot be undone.`
            : ''
        }
        confirmLabel="Delete forever"
        danger
        onCancel={() => setPermanentDeleteTarget(null)}
        onConfirm={performPermanentDelete}
      />
    </DashboardPage>
  )
}
