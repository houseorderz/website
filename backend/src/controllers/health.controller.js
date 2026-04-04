import { pool } from '../config/db.js'

export async function getHealth(req, res, next) {
  try {
    const result = await pool.query('SELECT 1 AS ok')
    res.json({
      status: 'ok',
      database: result.rows[0]?.ok === 1,
    })
  } catch (err) {
    next(err)
  }
}
