import jwt from 'jsonwebtoken'

const defaultExpires = '7d'

export function signAuthToken(payload) {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 16) {
    throw new Error(
      'JWT_SECRET must be set in backend/.env (at least 16 characters)',
    )
  }
  return jwt.sign(payload, secret, { expiresIn: defaultExpires })
}

export function verifyAuthToken(token) {
  const secret = process.env.JWT_SECRET
  if (!secret) return null
  try {
    return jwt.verify(token, secret)
  } catch {
    return null
  }
}
