const STORAGE_KEY = "karnan-wishlist"

function readIds() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
    return Array.isArray(parsed) ? parsed.map(Number).filter(Boolean) : []
  } catch {
    return []
  }
}

function writeIds(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

export function getWishlistIds() {
  return readIds()
}

export function toggleWishlistId(productId) {
  const id = Number(productId)
  const ids = readIds()
  const next = ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]
  writeIds(next)
  window.dispatchEvent(new Event("karnan-wishlist"))
  return next.includes(id)
}

export function isInWishlist(productId) {
  return readIds().includes(Number(productId))
}
