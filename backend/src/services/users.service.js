import bcrypt from 'bcryptjs'
import { pool } from '../config/db.js'
import { HttpError } from '../utils/httpError.js'

const SALT_ROUNDS = 10
const MIN_PASSWORD = 8

function validateName(name) {
  const n = String(name || '').trim()
  if (n.length < 1) throw new HttpError(400, 'Name is required')
  if (n.length > 255) throw new HttpError(400, 'Name is too long')
  return n
}

function normalizeEmail(email) {
  return String(email).trim().toLowerCase()
}

function validateEmail(email) {
  const e = normalizeEmail(email)
  if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
    throw new HttpError(400, 'Valid email is required')
  }
  return e
}

function validatePassword(password) {
  if (!password || String(password).length < MIN_PASSWORD) {
    throw new HttpError(
      400,
      `Password must be at least ${MIN_PASSWORD} characters`,
    )
  }
  return String(password)
}

function validateRole(role) {
  const r = String(role || 'client').toLowerCase()
  if (r !== 'admin' && r !== 'client') {
    throw new HttpError(400, 'Role must be admin or client')
  }
  return r
}

function mapRow(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role || 'client',
    createdAt: row.created_at,
  }
}

export async function listAppUsers() {
  const result = await pool.query(
    `SELECT id, name, email, role, created_at
     FROM app_users
     ORDER BY created_at DESC`,
  )
  return result.rows.map(mapRow)
}

export async function createAppUser({ name, email, password, role }) {
  const n = validateName(name)
  const e = validateEmail(email)
  const p = validatePassword(password)
  const r = validateRole(role)
  const passwordHash = await bcrypt.hash(p, SALT_ROUNDS)

  let result
  try {
    result = await pool.query(
      `INSERT INTO app_users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at`,
      [n, e, passwordHash, r],
    )
  } catch (err) {
    if (err.code === '23505') {
      throw new HttpError(409, 'An account with this email already exists')
    }
    throw err
  }

  return mapRow(result.rows[0])
}

export async function updateAppUser(id, { name, email, role }, currentUserId) {
  const existing = await pool.query(
    `SELECT id, name, email, role FROM app_users WHERE id = $1`,
    [id],
  )
  const row = existing.rows[0]
  if (!row) {
    throw new HttpError(404, 'User not found')
  }

  const nextName = name !== undefined ? validateName(name) : row.name
  let nextEmail = row.email
  if (email !== undefined) {
    nextEmail = validateEmail(email)
  }
  const nextRole = role !== undefined ? validateRole(role) : row.role

  if (row.role === 'admin' && nextRole === 'client') {
    const { rows } = await pool.query(
      `SELECT COUNT(*)::int AS c FROM app_users WHERE role = 'admin'`,
    )
    if (rows[0].c <= 1) {
      throw new HttpError(400, 'Cannot change the last admin to client')
    }
  }

  if (id === currentUserId && row.role === 'admin' && nextRole === 'client') {
    const { rows } = await pool.query(
      `SELECT COUNT(*)::int AS c FROM app_users WHERE role = 'admin'`,
    )
    if (rows[0].c <= 1) {
      throw new HttpError(400, 'You are the only admin; cannot change your role')
    }
  }

  try {
    const result = await pool.query(
      `UPDATE app_users
       SET name = $1, email = $2, role = $3
       WHERE id = $4
       RETURNING id, name, email, role, created_at`,
      [nextName, nextEmail, nextRole, id],
    )
    return mapRow(result.rows[0])
  } catch (err) {
    if (err.code === '23505') {
      throw new HttpError(409, 'An account with this email already exists')
    }
    throw err
  }
}

export async function deleteAppUser(id, currentUserId) {
  if (id === currentUserId) {
    throw new HttpError(400, 'Cannot delete your own account')
  }

  const existing = await pool.query(
    `SELECT role FROM app_users WHERE id = $1`,
    [id],
  )
  if (!existing.rows[0]) {
    throw new HttpError(404, 'User not found')
  }

  if (existing.rows[0].role === 'admin') {
    const { rows } = await pool.query(
      `SELECT COUNT(*)::int AS c FROM app_users WHERE role = 'admin'`,
    )
    if (rows[0].c <= 1) {
      throw new HttpError(400, 'Cannot delete the last admin account')
    }
  }

  await pool.query(`DELETE FROM app_users WHERE id = $1`, [id])
}
