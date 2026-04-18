import bcrypt from 'bcryptjs'
import { pool } from '../config/db.js'
import { HttpError } from '../utils/httpError.js'
import { signAuthToken } from '../utils/jwt.js'

const SALT_ROUNDS = 10
const MIN_PASSWORD = 8

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

function validateName(name) {
  const n = String(name || '').trim()
  if (n.length < 1) {
    throw new HttpError(400, 'Name is required')
  }
  if (n.length > 255) {
    throw new HttpError(400, 'Name is too long')
  }
  return n
}

export async function registerUser({ name, email, password }) {
  const n = validateName(name)
  const e = validateEmail(email)
  const p = validatePassword(password)

  const passwordHash = await bcrypt.hash(p, SALT_ROUNDS)

  let result
  try {
    result = await pool.query(
      `INSERT INTO app_users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'client')
       RETURNING id, name, email, role, created_at`,
      [n, e, passwordHash],
    )
  } catch (err) {
    if (err.code === '23505') {
      throw new HttpError(409, 'An account with this email already exists')
    }
    throw err
  }

  const user = result.rows[0]
  const token = signAuthToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  })

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.created_at,
    },
    token,
  }
}

export async function loginUser({ email, password }) {
  const e = validateEmail(email)
  if (password == null || String(password).length === 0) {
    throw new HttpError(400, 'Password is required')
  }
  const p = String(password)

  const result = await pool.query(
    `SELECT id, name, email, password_hash, role, created_at
     FROM app_users
     WHERE LOWER(email) = $1`,
    [e],
  )

  const row = result.rows[0]
  if (!row) {
    throw new HttpError(401, 'Invalid email or password')
  }

  const match = await bcrypt.compare(p, row.password_hash)
  if (!match) {
    throw new HttpError(401, 'Invalid email or password')
  }

  const role = row.role || 'client'
  const token = signAuthToken({ sub: row.id, email: row.email, role })

  return {
    user: {
      id: row.id,
      name: row.name,
      email: row.email,
      role,
      createdAt: row.created_at,
    },
    token,
  }
}

function mapUserRow(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role || 'client',
    createdAt: row.created_at,
  }
}

export async function updateProfile(userId, { name, currentPassword, newPassword }) {
  const wantsPassword =
    newPassword != null && String(newPassword).trim().length > 0
  const wantsName = name !== undefined && name !== null

  if (!wantsPassword && !wantsName) {
    throw new HttpError(400, 'Nothing to update')
  }

  if (wantsPassword) {
    const nextPwd = validatePassword(newPassword)
    if (!currentPassword || String(currentPassword).length === 0) {
      throw new HttpError(
        400,
        'Current password is required to set a new password',
      )
    }
    const pwdRes = await pool.query(
      `SELECT password_hash FROM app_users WHERE id = $1`,
      [userId],
    )
    const row = pwdRes.rows[0]
    if (!row) {
      throw new HttpError(404, 'User not found')
    }
    const ok = await bcrypt.compare(String(currentPassword), row.password_hash)
    if (!ok) {
      throw new HttpError(401, 'Current password is incorrect')
    }
    const passwordHash = await bcrypt.hash(nextPwd, SALT_ROUNDS)
    await pool.query(
      `UPDATE app_users SET password_hash = $2 WHERE id = $1`,
      [userId, passwordHash],
    )
  }

  if (wantsName) {
    const n = validateName(name)
    await pool.query(`UPDATE app_users SET name = $2 WHERE id = $1`, [
      userId,
      n,
    ])
  }

  const result = await pool.query(
    `SELECT id, name, email, role, created_at FROM app_users WHERE id = $1`,
    [userId],
  )
  const updated = result.rows[0]
  if (!updated) {
    throw new HttpError(404, 'User not found')
  }

  return { user: mapUserRow(updated) }
}
