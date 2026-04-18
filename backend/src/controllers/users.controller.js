import * as usersService from '../services/users.service.js'
import { HttpError } from '../utils/httpError.js'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function parseId(raw) {
  const id = String(raw || '').trim()
  if (!UUID_RE.test(id)) {
    throw new HttpError(400, 'Invalid user id')
  }
  return id
}

export async function getUsers(_req, res, next) {
  try {
    const users = await usersService.listAppUsers()
    res.json({ users })
  } catch (err) {
    next(err)
  }
}

export async function postUser(req, res, next) {
  try {
    const { name, email, password, role } = req.body || {}
    if (name == null || email == null || password == null) {
      throw new HttpError(400, 'Name, email, and password are required')
    }
    const user = await usersService.createAppUser({ name, email, password, role })
    res.status(201).json({ user })
  } catch (err) {
    next(err)
  }
}

export async function patchUser(req, res, next) {
  try {
    const id = parseId(req.params.id)
    const { name, email, role } = req.body || {}
    const user = await usersService.updateAppUser(
      id,
      { name, email, role },
      req.user.id,
    )
    res.json({ user })
  } catch (err) {
    next(err)
  }
}

export async function deleteUser(req, res, next) {
  try {
    const id = parseId(req.params.id)
    await usersService.deleteAppUser(id, req.user.id)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
