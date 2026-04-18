import * as productsService from '../services/products.service.js'
import { HttpError } from '../utils/httpError.js'

export async function getProducts(req, res, next) {
  try {
    const products = await productsService.listProducts()
    res.json({ products })
  } catch (err) {
    next(err)
  }
}

export async function getTrashProducts(req, res, next) {
  try {
    const products = await productsService.listTrashProducts()
    res.json({ products })
  } catch (err) {
    next(err)
  }
}

export async function getProduct(req, res, next) {
  try {
    const product = await productsService.getProductById(req.params.id)
    if (!product) {
      throw new HttpError(404, 'Product not found')
    }
    res.json({ product })
  } catch (err) {
    next(err)
  }
}

export async function postProduct(req, res, next) {
  try {
    const product = await productsService.createProduct(req.body || {})
    res.status(201).json({ product })
  } catch (err) {
    next(err)
  }
}

export async function patchProduct(req, res, next) {
  try {
    const product = await productsService.updateProduct(req.params.id, req.body || {})
    res.json({ product })
  } catch (err) {
    next(err)
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const permanent =
      req.query.permanent === '1' || req.query.permanent === 'true'
    await productsService.deleteProduct(req.params.id, { permanent })
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export async function restoreProduct(req, res, next) {
  try {
    const product = await productsService.restoreProduct(req.params.id)
    res.json({ product })
  } catch (err) {
    next(err)
  }
}
