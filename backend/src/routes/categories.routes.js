import { Router } from 'express'
import * as categoriesController from '../controllers/categories.controller.js'

const router = Router()

router.get('/', categoriesController.getCategories)

export default router
