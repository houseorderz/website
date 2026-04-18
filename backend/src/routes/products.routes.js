import { Router } from 'express'
import * as productsController from '../controllers/products.controller.js'
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/', productsController.getProducts)
router.get(
  '/trash',
  requireAuth,
  requireAdmin,
  productsController.getTrashProducts,
)
router.post('/', requireAuth, requireAdmin, productsController.postProduct)
router.post(
  '/:id/restore',
  requireAuth,
  requireAdmin,
  productsController.restoreProduct,
)
router.get('/:id', productsController.getProduct)
router.patch('/:id', requireAuth, requireAdmin, productsController.patchProduct)
router.delete('/:id', requireAuth, requireAdmin, productsController.deleteProduct)

export default router
