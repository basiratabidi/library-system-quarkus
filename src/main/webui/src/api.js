// Base URL for the Quarkus backend.
export const API_BASE_URL = 'http://localhost:8080'

export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
    this.name = 'ApiError'
  }
}

async function handle(res) {
  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const text = await res.text()
      if (text) message = text
    } catch {}
    throw new ApiError(res.status, message)
  }
  const text = await res.text()
  if (!text) return undefined
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function url(path) {
  return `${API_BASE_URL}${path}`
}

export async function api(path, opts) {
  const res = await fetch(url(path), {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  })
  return handle(res)
}

/* ---------- Books ---------- */
export const booksApi = {
  getAll: () => api('/books'),
  create: (body) => api('/books', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => api(`/books/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id) => api(`/books/${id}`, { method: 'DELETE' }),
}

/* ---------- Members ---------- */
export const membersApi = {
  getAll: () => api('/members'),
  create: (body) => api('/members', { method: 'POST', body: JSON.stringify(body) }),
  remove: (id) => api(`/members/${id}`, { method: 'DELETE' }),
}

/* ---------- Lending ---------- */
export const lendingApi = {
  lend: (bookId, memberId) => api(`/lendings/${bookId}/${memberId}`, { method: 'POST' }),
  returnBook: (lendingId) => api(`/lendings/return/${lendingId}`, { method: 'POST' }),
  get: (lendingId) => api(`/lendings/${lendingId}`),
}

/* Placeholder until /reviews backend exists - swap body for a real api() call later */
export function getBookRating(_bookId) {
  return { averageRating: 0, reviewCount: 0 }
}