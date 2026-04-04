export function errorHandler(err, req, res, _next) {
  console.error(err)
  const status = err.status ?? 500
  const message =
    status === 500 ? 'Internal Server Error' : err.message || 'Request failed'
  res.status(status).json({ error: message })
}
