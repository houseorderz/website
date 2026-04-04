import * as authService from '../services/auth.service.js'
import { HttpError } from '../utils/httpError.js'

export async function postRegister(req, res, next) {
  try {
    const { name, email, password } = req.body || {}
    const data = await authService.registerUser({ name, email, password })
    res.status(201).json(data)
  } catch (err) {
    next(err)
  }
}

export async function postLogin(req, res, next) {
  try {
    const { email, password } = req.body || {}
    if (email == null || password == null) {
      throw new HttpError(400, 'Email and password are required')
    }
    const data = await authService.loginUser({ email, password })
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export async function getMe(req, res, next) {
  try {
    if (!req.user) {
      throw new HttpError(401, 'Not authenticated')
    }
    res.json({ user: req.user })
  } catch (err) {
    next(err)
  }
}
