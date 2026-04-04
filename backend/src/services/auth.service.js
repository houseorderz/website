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
      `INSERT INTO app_users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [n, e, passwordHash],
    )
  } catch (err) {
    if (err.code === '23505') {
      throw new HttpError(409, 'An account with this email already exists')
    }
    throw err
  }

  const user = result.rows[0]
  const token = signAuthToken({ sub: user.id, email: user.email })

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
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
    `SELECT id, name, email, password_hash, created_at
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

  const token = signAuthToken({ sub: row.id, email: row.email })

  return {
    user: {
      id: row.id,
      name: row.name,
      email: row.email,
      createdAt: row.created_at,
    },
    token,
  }
}
