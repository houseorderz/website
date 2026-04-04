export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

export async function apiJson(path, options = {}) {
  const { method = 'GET', body, token } = options
  const headers = { Accept: 'application/json' }
  if (body != null) {
    headers['Content-Type'] = 'application/json'
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  })

  const text = await res.text()
  let data = {}
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { error: text || res.statusText }
    }
  }

  if (!res.ok) {
    throw new ApiError(
      data.error || res.statusText || 'Request failed',
      res.status,
    )
  }

  return data
}
