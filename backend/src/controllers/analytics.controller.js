import * as analyticsService from '../services/analytics.service.js'

export async function getAdminAnalytics(req, res, next) {
  try {
    const data = await analyticsService.getAdminAnalytics()
    res.json(data)
  } catch (err) {
    next(err)
  }
}
