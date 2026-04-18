import { Router } from 'express'
import healthRoutes from './health.routes.js'
import authRoutes from './auth.routes.js'
import categoriesRoutes from './categories.routes.js'
import productsRoutes from './products.routes.js'
import adminUsersRoutes from './admin.users.routes.js'
import adminAnalyticsRoutes from './admin.analytics.routes.js'

const router = Router()

router.use('/health', healthRoutes)
router.use('/auth', authRoutes)
router.use('/categories', categoriesRoutes)
router.use('/products', productsRoutes)
router.use('/admin/users', adminUsersRoutes)
router.use('/admin/analytics', adminAnalyticsRoutes)

export default router
