import { pool } from '../config/db.js'
import { HttpError } from '../utils/httpError.js'

/** Days until soft-deleted products are permanently removed (see purge job + SQL). */
export const SOFT_DELETE_RETENTION_DAYS = 10

const GALLERY_POOL = [
  'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'https://images.pexels.com/photos/6311662/pexels-photo-6311662.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'https://images.pexels.com/photos/1154861/pexels-photo-1154861.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'https://images.pexels.com/photos/1755383/pexels-photo-1755383.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
]

function buildGallery(mainUrl, productId) {
  const main = mainUrl || GALLERY_POOL[0]
  const start = Number(productId) % GALLERY_POOL.length
  const thumbs = [main]
  let i = 0
  while (thumbs.length < 5 && i < GALLERY_POOL.length * 2) {
    const u = GALLERY_POOL[(start + i) % GALLERY_POOL.length]
    i += 1
    if (!thumbs.includes(u)) thumbs.push(u)
  }
  while (thumbs.length < 5) thumbs.push(main)
  return thumbs
}

function categoryLabel(slug) {
  if (!slug) return 'Products'
  return slug.charAt(0).toUpperCase() + slug.slice(1)
}

function mapDetailRow(row) {
  const price = Number(row.price)
  const compareRaw = row.compare_at_price
  const compareAt =
    compareRaw != null ? Number(compareRaw) : Math.round(price * 1.22 * 100) / 100
  return {
    id: String(row.id),
    name: row.name,
    price,
    compareAtPrice: compareAt > price ? compareAt : null,
    stock: row.stock,
    sold: row.sold,
    image: row.image_url,
    category: row.category_slug,
    categoryLabel: categoryLabel(row.category_slug),
    description: row.description || '',
    images: buildGallery(row.image_url, row.id),
    rating: 4.9,
    reviewCount: 225,
  }
}

function mapListRow(row) {
  const price = Number(row.price)
  const compareRaw = row.compare_at_price
  const compareAt =
    compareRaw != null ? Number(compareRaw) : null
  const deletedAt = row.deleted_at
  const out = {
    id: String(row.id),
    sku: row.sku,
    name: row.name,
    price,
    compareAtPrice: compareAt != null && compareAt > price ? compareAt : null,
    stock: row.stock,
    sold: row.sold,
    image: row.image_url,
    category: row.category_slug,
    description: row.description || '',
  }
  if (deletedAt != null) {
    const d = deletedAt instanceof Date ? deletedAt : new Date(deletedAt)
    if (!Number.isNaN(d.getTime())) out.deletedAt = d.toISOString()
  }
  return out
}

export async function listProducts() {
  const result = await pool.query(
    `SELECT id,
            sku,
            name,
            price::float8 AS price,
            stock,
            sold,
            image_url,
            category_slug,
            description,
            compare_at_price
     FROM products
     WHERE NOT COALESCE(is_deleted, FALSE)
     ORDER BY id ASC`,
  )
  return result.rows.map(mapListRow)
}

export async function listTrashProducts() {
  const result = await pool.query(
    `SELECT id,
            sku,
            name,
            price::float8 AS price,
            stock,
            sold,
            image_url,
            category_slug,
            description,
            compare_at_price,
            deleted_at
     FROM products
     WHERE COALESCE(is_deleted, FALSE) = TRUE
     ORDER BY deleted_at DESC NULLS LAST, id DESC`,
  )
  return result.rows.map(mapListRow)
}

export async function purgeExpiredSoftDeletes() {
  const result = await pool.query(
    `DELETE FROM products
     WHERE is_deleted = TRUE
       AND deleted_at IS NOT NULL
       AND deleted_at < NOW() - ($1::integer * INTERVAL '1 day')
     RETURNING id`,
    [SOFT_DELETE_RETENTION_DAYS],
  )
  return result.rowCount ?? 0
}

function validateSku(sku) {
  const s = String(sku || '').trim()
  if (s.length < 1 || s.length > 32) {
    throw new HttpError(400, 'SKU must be 1–32 characters')
  }
  if (!/^[A-Za-z0-9._-]+$/.test(s)) {
    throw new HttpError(400, 'SKU may only contain letters, numbers, dot, dash, underscore')
  }
  return s
}

function generateAutoSku() {
  const t = Date.now().toString(36).toUpperCase()
  const r = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `G-${t}-${r}`.slice(0, 32)
}

function validateCategorySlug(slug) {
  const s = String(slug || '').trim().toLowerCase()
  if (s.length < 1 || s.length > 64) {
    throw new HttpError(400, 'Category slug is required (max 64 characters)')
  }
  if (!/^[a-z0-9-]+$/.test(s)) {
    throw new HttpError(400, 'Category slug: lowercase letters, numbers, hyphens only')
  }
  return s
}

async function validateCategoryFromCatalog(raw) {
  const slug = validateCategorySlug(raw)
  const r = await pool.query(`SELECT 1 FROM categories WHERE slug = $1`, [slug])
  if (r.rows.length === 0) {
    throw new HttpError(400, 'Unknown category. Choose one from your categories list.')
  }
  return slug
}

export async function createProduct(body) {
  const skuProvided =
    body.sku != null && String(body.sku).trim() !== ''
  let sku = skuProvided ? validateSku(body.sku) : generateAutoSku()

  const name = String(body.name || '').trim()
  if (name.length < 1 || name.length > 255) {
    throw new HttpError(400, 'Valid product name is required')
  }
  const price = Number(body.price)
  if (!Number.isFinite(price) || price < 0) {
    throw new HttpError(400, 'Valid price is required')
  }
  const stock = Math.max(0, Math.floor(Number(body.stock)))
  if (!Number.isFinite(stock)) {
    throw new HttpError(400, 'Valid stock is required')
  }
  const sold = 0
  const imageUrl = String(body.image || body.image_url || '').trim()
  if (imageUrl.length < 1) {
    throw new HttpError(400, 'Image URL is required')
  }
  const categorySlug = await validateCategoryFromCatalog(
    body.category || body.category_slug,
  )
  const description =
    body.description != null ? String(body.description) : ''
  let compareAt = null
  if (body.compareAtPrice != null && body.compareAtPrice !== '') {
    const c = Number(body.compareAtPrice)
    if (Number.isFinite(c) && c >= 0) compareAt = c
  }

  const insertValues = [
    sku,
    name,
    price,
    stock,
    sold,
    imageUrl,
    categorySlug,
    description,
    compareAt,
  ]

  let result
  try {
    result = await pool.query(
      `INSERT INTO products (sku, name, price, stock, sold, image_url, category_slug, description, compare_at_price)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id,
                 sku,
                 name,
                 price::float8 AS price,
                 stock,
                 sold,
                 image_url,
                 category_slug,
                 description,
                 compare_at_price`,
      insertValues,
    )
  } catch (err) {
    if (err.code === '23505') {
      if (skuProvided) {
        throw new HttpError(409, 'A product with this SKU already exists')
      }
      for (let attempt = 0; attempt < 12; attempt++) {
        sku = generateAutoSku()
        insertValues[0] = sku
        try {
          result = await pool.query(
            `INSERT INTO products (sku, name, price, stock, sold, image_url, category_slug, description, compare_at_price)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING id,
                       sku,
                       name,
                       price::float8 AS price,
                       stock,
                       sold,
                       image_url,
                       category_slug,
                       description,
                       compare_at_price`,
            insertValues,
          )
          return mapListRow(result.rows[0])
        } catch (e2) {
          if (e2.code !== '23505') throw e2
        }
      }
      throw new HttpError(500, 'Could not allocate a unique SKU')
    }
    throw err
  }

  return mapListRow(result.rows[0])
}

export async function updateProduct(rawId, body) {
  const id = Number(rawId)
  if (!Number.isInteger(id) || id < 1) {
    throw new HttpError(400, 'Invalid product id')
  }

  const existing = await pool.query(
    `SELECT id,
            sku,
            name,
            price::float8 AS price,
            stock,
            sold,
            image_url,
            category_slug,
            description,
            compare_at_price
     FROM products
     WHERE id = $1
       AND NOT COALESCE(is_deleted, FALSE)`,
    [id],
  )
  if (existing.rows.length === 0) {
    throw new HttpError(404, 'Product not found')
  }
  const row = existing.rows[0]

  const nextSku = body.sku !== undefined ? validateSku(body.sku) : row.sku
  const nextName =
    body.name !== undefined
      ? String(body.name).trim()
      : row.name
  if (nextName.length < 1 || nextName.length > 255) {
    throw new HttpError(400, 'Valid product name is required')
  }
  const nextPrice =
    body.price !== undefined ? Number(body.price) : Number(row.price)
  if (!Number.isFinite(nextPrice) || nextPrice < 0) {
    throw new HttpError(400, 'Valid price is required')
  }
  const nextStock =
    body.stock !== undefined
      ? Math.max(0, Math.floor(Number(body.stock)))
      : row.stock
  const nextSold = row.sold
  const nextImage =
    body.image !== undefined || body.image_url !== undefined
      ? String(body.image || body.image_url).trim()
      : row.image_url
  if (nextImage.length < 1) {
    throw new HttpError(400, 'Image URL is required')
  }
  const nextCat =
    body.category !== undefined || body.category_slug !== undefined
      ? await validateCategoryFromCatalog(body.category || body.category_slug)
      : row.category_slug
  const nextDesc =
    body.description !== undefined ? String(body.description) : row.description
  let nextCompare = row.compare_at_price != null ? Number(row.compare_at_price) : null
  if (body.compareAtPrice !== undefined) {
    if (body.compareAtPrice === null || body.compareAtPrice === '') {
      nextCompare = null
    } else {
      const c = Number(body.compareAtPrice)
      nextCompare = Number.isFinite(c) && c >= 0 ? c : null
    }
  }

  try {
    const result = await pool.query(
      `UPDATE products
       SET sku = $1,
           name = $2,
           price = $3,
           stock = $4,
           sold = $5,
           image_url = $6,
           category_slug = $7,
           description = $8,
           compare_at_price = $9
       WHERE id = $10
       RETURNING id,
                 sku,
                 name,
                 price::float8 AS price,
                 stock,
                 sold,
                 image_url,
                 category_slug,
                 description,
                 compare_at_price`,
      [
        nextSku,
        nextName,
        nextPrice,
        nextStock,
        nextSold,
        nextImage,
        nextCat,
        nextDesc,
        nextCompare,
        id,
      ],
    )
    return mapListRow(result.rows[0])
  } catch (err) {
    if (err.code === '23505') {
      throw new HttpError(409, 'A product with this SKU already exists')
    }
    throw err
  }
}

export async function deleteProduct(rawId, { permanent = false } = {}) {
  const id = Number(rawId)
  if (!Number.isInteger(id) || id < 1) {
    throw new HttpError(400, 'Invalid product id')
  }
  if (permanent) {
    const result = await pool.query(
      `DELETE FROM products
       WHERE id = $1
         AND COALESCE(is_deleted, FALSE) = TRUE
       RETURNING id`,
      [id],
    )
    if (result.rowCount === 0) {
      throw new HttpError(
        404,
        'Product not found in trash (or already removed)',
      )
    }
    return
  }
  const result = await pool.query(
    `UPDATE products
     SET is_deleted = TRUE,
         deleted_at = NOW()
     WHERE id = $1
       AND NOT COALESCE(is_deleted, FALSE)
     RETURNING id`,
    [id],
  )
  if (result.rowCount === 0) {
    throw new HttpError(404, 'Product not found')
  }
}

export async function restoreProduct(rawId) {
  const id = Number(rawId)
  if (!Number.isInteger(id) || id < 1) {
    throw new HttpError(400, 'Invalid product id')
  }
  const result = await pool.query(
    `UPDATE products
     SET is_deleted = FALSE,
         deleted_at = NULL
     WHERE id = $1
       AND COALESCE(is_deleted, FALSE) = TRUE
     RETURNING id,
               sku,
               name,
               price::float8 AS price,
               stock,
               sold,
               image_url,
               category_slug,
               description,
               compare_at_price`,
    [id],
  )
  if (result.rows.length === 0) {
    throw new HttpError(404, 'Product not found in trash')
  }
  return mapListRow(result.rows[0])
}

export async function getProductById(rawId) {
  const id = Number(rawId)
  if (!Number.isInteger(id) || id < 1) return null
  const result = await pool.query(
    `SELECT id,
            name,
            price::float8 AS price,
            stock,
            sold,
            image_url,
            category_slug,
            description,
            compare_at_price
     FROM products
     WHERE id = $1
       AND NOT COALESCE(is_deleted, FALSE)`,
    [id],
  )
  if (result.rows.length === 0) return null
  return mapDetailRow(result.rows[0])
}
