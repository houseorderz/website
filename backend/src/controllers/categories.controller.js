import * as categoriesService from '../services/categories.service.js'

export async function getCategories(req, res, next) {
  try {
    const categories = await categoriesService.listCategories()
    res.json({ categories })
  } catch (err) {
    next(err)
  }
}

export async function postCategory(req, res, next) {
  try {
    const category = await categoriesService.createCategory(req.body || {})
    res.status(201).json({ category })
  } catch (err) {
    next(err)
  }
}

export async function patchCategory(req, res, next) {
  try {
    const category = await categoriesService.updateCategory(
      req.params.id,
      req.body || {},
    )
    res.json({ category })
  } catch (err) {
    next(err)
  }
}

export async function deleteCategory(req, res, next) {
  try {
    await categoriesService.deleteCategory(req.params.id)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
