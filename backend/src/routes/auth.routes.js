import { Router } from 'express'
import * as authController from '../controllers/auth.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const router = Router()

router.post('/register', authController.postRegister)
router.post('/login', authController.postLogin)
router.get('/me', requireAuth, authController.getMe)

export default router
