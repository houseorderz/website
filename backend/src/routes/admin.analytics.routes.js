import { Router } from 'express'
import * as analyticsController from '../controllers/analytics.controller.js'
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js'

const router = Router()

router.get(
  '/',
  requireAuth,
  requireAdmin,
  analyticsController.getAdminAnalytics,
)

export default router
