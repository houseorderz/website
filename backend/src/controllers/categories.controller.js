import * as categoriesService from '../services/categories.service.js'

export async function getCategories(req, res, next) {
  try {
    const categories = await categoriesService.listCategories()
    res.json({ categories })
  } catch (err) {
    next(err)
  }
}
