import { Router } from 'express'
import * as categoriesController from '../controllers/categories.controller.js'
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/', categoriesController.getCategories)
router.post(
  '/',
  requireAuth,
  requireAdmin,
  categoriesController.postCategory,
)
router.patch(
  '/:id',
  requireAuth,
  requireAdmin,
  categoriesController.patchCategory,
)
router.delete(
  '/:id',
  requireAuth,
  requireAdmin,
  categoriesController.deleteCategory,
)

export default router
