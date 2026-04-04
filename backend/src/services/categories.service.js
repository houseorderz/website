import { pool } from '../config/db.js'

export async function listCategories() {
  const result = await pool.query(
    `SELECT id, name, item_count, sort_order
     FROM categories
     ORDER BY sort_order ASC, id ASC`,
  )
  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    itemCount: Number(row.item_count),
    sortOrder: row.sort_order,
  }))
}
