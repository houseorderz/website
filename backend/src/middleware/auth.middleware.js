import { pool } from '../config/db.js'
import { HttpError } from '../utils/httpError.js'
import { verifyAuthToken } from '../utils/jwt.js'

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const [type, token] = header.split(' ')
    if (type !== 'Bearer' || !token) {
      throw new HttpError(401, 'Not authenticated')
    }

    const payload = verifyAuthToken(token)
    if (!payload?.sub) {
      throw new HttpError(401, 'Invalid or expired session')
    }

    const result = await pool.query(
      `SELECT id, name, email, role, created_at FROM app_users WHERE id = $1`,
      [payload.sub],
    )

    const row = result.rows[0]
    if (!row) {
      throw new HttpError(401, 'User no longer exists')
    }

    req.user = {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role || 'client',
      createdAt: row.created_at,
    }
    next()
  } catch (err) {
    next(err)
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user) {
    return next(new HttpError(401, 'Not authenticated'))
  }
  if (req.user.role !== 'admin') {
    return next(new HttpError(403, 'Admin access required'))
  }
  next()
}
