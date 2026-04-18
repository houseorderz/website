import { Router } from 'express'
import * as usersController from '../controllers/users.controller.js'
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/', requireAuth, requireAdmin, usersController.getUsers)
router.post('/', requireAuth, requireAdmin, usersController.postUser)
router.patch('/:id', requireAuth, requireAdmin, usersController.patchUser)
router.delete('/:id', requireAuth, requireAdmin, usersController.deleteUser)

export default router
