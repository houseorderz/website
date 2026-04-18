import { pool } from '../config/db.js'
import { HttpError } from '../utils/httpError.js'

function mapRow(row, productCount) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    itemCount: Number(row.item_count),
    productCount:
      productCount != null
        ? Number(productCount)
        : Number(row.product_count ?? 0),
    sortOrder: row.sort_order,
  }
}

export async function listCategories() {
  const result = await pool.query(
    `SELECT c.id,
            c.name,
            c.slug,
            c.item_count,
            c.sort_order,
            (
              SELECT COUNT(*)::int
              FROM products p
              WHERE p.category_slug = c.slug
                AND NOT COALESCE(p.is_deleted, FALSE)
            ) AS product_count
     FROM categories c
     ORDER BY c.sort_order ASC, c.id ASC`,
  )
  return result.rows.map((row) => mapRow(row))
}

function validateName(raw) {
  const n = String(raw || '').trim()
  if (n.length < 1 || n.length > 255) {
    throw new HttpError(400, 'Category name is required (max 255 characters)')
  }
  return n
}

function validateSlug(raw) {
  const s = String(raw || '').trim().toLowerCase()
  if (s.length < 1 || s.length > 64) {
    throw new HttpError(400, 'Slug is required (max 64 characters)')
  }
  if (!/^[a-z0-9-]+$/.test(s)) {
    throw new HttpError(
      400,
      'Slug may only contain lowercase letters, numbers, and hyphens',
    )
  }
  return s
}

function slugFromName(name) {
  const base = validateName(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
  return base || `cat-${Date.now().toString(36)}`
}

async function nextSortOrder() {
  const r = await pool.query(
    `SELECT COALESCE(MAX(sort_order), 0) + 1 AS n FROM categories`,
  )
  return Number(r.rows[0].n)
}

export async function createCategory(body) {
  const name = validateName(body.name)
  const slugRaw = body.slug != null ? String(body.slug).trim() : ''
  const slug = slugRaw ? validateSlug(slugRaw) : slugFromName(name)
  let sortOrder = body.sortOrder
  if (sortOrder === undefined || sortOrder === null || sortOrder === '') {
    sortOrder = await nextSortOrder()
  } else {
    sortOrder = Math.floor(Number(sortOrder))
    if (!Number.isFinite(sortOrder)) {
      throw new HttpError(400, 'Sort order must be a number')
    }
  }

  try {
    const result = await pool.query(
      `INSERT INTO categories (name, item_count, sort_order, slug)
       VALUES ($1, 0, $2, $3)
       RETURNING id, name, slug, item_count, sort_order`,
      [name, sortOrder, slug],
    )
    const row = result.rows[0]
    return mapRow(row, 0)
  } catch (err) {
    if (err.code === '23505') {
      const msg = String(err.detail || '')
      if (msg.includes('name') || msg.includes('(name)')) {
        throw new HttpError(409, 'A category with this name already exists')
      }
      throw new HttpError(409, 'A category with this slug already exists')
    }
    throw err
  }
}

export async function updateCategory(rawId, body) {
  const id = Number(rawId)
  if (!Number.isInteger(id) || id < 1) {
    throw new HttpError(400, 'Invalid category id')
  }

  const existing = await pool.query(
    `SELECT id, name, slug, item_count, sort_order FROM categories WHERE id = $1`,
    [id],
  )
  if (existing.rows.length === 0) {
    throw new HttpError(404, 'Category not found')
  }
  const row = existing.rows[0]

  const nextName = body.name !== undefined ? validateName(body.name) : row.name

  let nextSlug = row.slug
  if (body.slug !== undefined) {
    const s = String(body.slug).trim()
    nextSlug = s ? validateSlug(s) : row.slug
  }

  let nextSort = row.sort_order
  if (body.sortOrder !== undefined) {
    nextSort = Math.floor(Number(body.sortOrder))
    if (!Number.isFinite(nextSort)) {
      throw new HttpError(400, 'Sort order must be a number')
    }
  }

  if (nextSlug === row.slug && nextName === row.name && nextSort === row.sort_order) {
    const pc = (
      await pool.query(
        `SELECT COUNT(*)::int AS n FROM products WHERE category_slug = $1 AND NOT COALESCE(is_deleted, FALSE)`,
        [row.slug],
      )
    ).rows[0].n
    return mapRow(row, pc)
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    if (nextSlug !== row.slug) {
      const taken = await client.query(
        `SELECT 1 FROM categories WHERE slug = $1 AND id <> $2`,
        [nextSlug, id],
      )
      if (taken.rows.length > 0) {
        await client.query('ROLLBACK')
        throw new HttpError(409, 'A category with this slug already exists')
      }
      await client.query(
        `UPDATE products SET category_slug = $1 WHERE category_slug = $2`,
        [nextSlug, row.slug],
      )
    }
    const result = await client.query(
      `UPDATE categories
       SET name = $1, slug = $2, sort_order = $3
       WHERE id = $4
       RETURNING id, name, slug, item_count, sort_order`,
      [nextName, nextSlug, nextSort, id],
    )
    await client.query('COMMIT')
    const updated = result.rows[0]
    const pc = (
      await pool.query(
        `SELECT COUNT(*)::int AS n FROM products WHERE category_slug = $1 AND NOT COALESCE(is_deleted, FALSE)`,
        [updated.slug],
      )
    ).rows[0].n
    return mapRow(updated, pc)
  } catch (err) {
    try {
      await client.query('ROLLBACK')
    } catch {
      /* ignore */
    }
    if (err instanceof HttpError) throw err
    if (err.code === '23505') {
      throw new HttpError(409, 'A category with this name or slug already exists')
    }
    throw err
  } finally {
    client.release()
  }
}

export async function deleteCategory(rawId) {
  const id = Number(rawId)
  if (!Number.isInteger(id) || id < 1) {
    throw new HttpError(400, 'Invalid category id')
  }

  const existing = await pool.query(
    `SELECT id, slug FROM categories WHERE id = $1`,
    [id],
  )
  if (existing.rows.length === 0) {
    throw new HttpError(404, 'Category not found')
  }
  const slug = existing.rows[0].slug

  const countR = await pool.query(
    `SELECT COUNT(*)::int AS n FROM products WHERE category_slug = $1`,
    [slug],
  )
  const n = Number(countR.rows[0].n)
  if (n > 0) {
    throw new HttpError(
      409,
      `Cannot delete this category: ${n} product(s) still use it. Reassign or remove them first.`,
    )
  }

  await pool.query(`DELETE FROM categories WHERE id = $1`, [id])
}
