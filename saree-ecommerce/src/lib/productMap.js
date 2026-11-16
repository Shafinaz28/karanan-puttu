import { categoryIdFromText } from "../data/shopCategories"
import { products as catalogProducts } from "../data/products"

const storageBucket = "product-images"

const catalogImageByName = new Map(
  catalogProducts.map((p) => [p.name.trim().toLowerCase(), p.image]),
)
const catalogImageById = new Map(catalogProducts.map((p) => [Number(p.id), p.image]))

function normalizePublicImagePath(path) {
  if (!path) return ""
  let normalized = path.trim()
  if (!normalized) return ""

  if (/^https?:\/\//i.test(normalized)) return normalized

  if (!normalized.startsWith("/")) {
    const file = normalized.replace(/^product-images\//, "").split("/").pop() || normalized
    if (/^soft-\d+/i.test(file)) {
      normalized = `/sarees/soft/${file}`
    } else if (/^(worn-|old-)/i.test(file)) {
      normalized = `/sarees/worn/${file}`
    } else {
      normalized = `/${normalized.replace(/^\//, "")}`
    }
  }

  if (/^\/sarees\/.+\.(jpe?g|png)$/i.test(normalized)) {
    normalized = normalized.replace(/\.(jpe?g|png)$/i, ".avif")
  }

  return normalized
}

function catalogFallbackImage({ id, name }) {
  const byName = catalogImageByName.get(String(name || "").trim().toLowerCase())
  if (byName) return byName
  const byId = catalogImageById.get(Number(id))
  if (byId) return byId
  return ""
}

/** Resolved URL/path for rendering (DB row, cart line, or local product). */
export function productImageSrc(product) {
  if (!product) return ""
  const resolved = resolveProductImageUrl(product.image)
  if (resolved) return resolved
  return catalogFallbackImage(product)
}

/** Up to four photo URLs stored on one product. A JSON list shares the image column. */
export function productImageList(raw) {
  const text = String(raw || "").trim()
  if (text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text)
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item || "").trim()).filter(Boolean).slice(0, 4)
      }
    } catch {
      return text ? [text] : []
    }
  }
  return text ? [text] : []
}

/** Public URL for DB image field (full URL, site path, or bucket object path). */
export function resolveProductImageUrl(image) {
  const raw = String(image || "").trim()
  if (!raw) return ""

  if (/^https?:\/\//i.test(raw)) return raw

  if (raw.startsWith("/")) {
    return normalizePublicImagePath(raw)
  }

  const base = import.meta.env.VITE_SUPABASE_URL
  const bare = raw.replace(/^product-images\//, "")
  if (/^(worn-|old-|soft-)/i.test(bare) || /^\/sarees\//.test(`/${bare}`)) {
    return normalizePublicImagePath(bare.includes("/") ? `/${bare}` : bare)
  }

  if (!base) {
    return normalizePublicImagePath(raw)
  }

  const path = bare
  return `${base.replace(/\/$/, "")}/storage/v1/object/public/${storageBucket}/${path}`
}

const shopGroups = new Set(["soft", "tissue", "traditional", "party"])

function shopCategoryFromRow(row) {
  const fromLabel = categoryIdFromText(row.category)
  if (fromLabel) return fromLabel
  if (shopGroups.has(row.sale_group)) return row.sale_group
  if (row.party) return "party"
  return "soft"
}

function occasionFromRow(row) {
  const stored = String(row.occasion || "").trim().toLowerCase()
  if (stored === "wedding" || stored === "party" || stored === "festivals") return stored
  const badge = String(row.badge || "")
  if (/festival/i.test(badge)) return "festivals"
  if (/wedding/i.test(badge)) return "wedding"
  if (/\bparty\b/i.test(badge)) return "party"
  return ""
}

/** Map a Supabase row to the shape used across the shop UI. */
export function mapDbProduct(row) {
  const price = Number(row.price) || 2799
  const shopCategory = shopCategoryFromRow(row)
  const compareAt =
    Number(row.compare_at) ||
    (shopCategory === "tissue" || price >= 7000 ? 15999 : 5599)

  const rawList = productImageList(row.image)
  let images = rawList.map((item) => resolveProductImageUrl(item)).filter(Boolean)
  const fallback = catalogFallbackImage(row)
  if (!images.length && fallback) images = [fallback]
  const image = images[0] || ""

  return {
    id: row.id,
    name: row.name,
    category: row.category,
    shopCategory,
    price: [2800, 5599].includes(price) ? 2799 : price,
    compareAt,
    badge: row.badge || null,
    line: row.line || "",
    featured: Boolean(row.featured),
    party: Boolean(row.party),
    occasion: occasionFromRow(row),
    saleGroup: shopCategory,
    fabric: row.fabric || "Soft silk",
    length: row.length || "6.3 metres",
    color: row.color || "",
    description: row.description || "",
    image,
    images,
    active: row.active !== false,
  }
}

export function toDbPayload(product) {
  const images = (Array.isArray(product.images) ? product.images : [])
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .slice(0, 4)
  const cover = images[0] || String(product.image || "").trim()
  return {
    name: product.name,
    category: product.category || "Soft Silk",
    price: Number(product.price) || 2799,
    badge: product.badge || null,
    sale_group: product.saleGroup || "soft",
    line: product.line || null,
    featured: Boolean(product.featured),
    party: product.saleGroup === "party",
    occasion: product.occasion || null,
    fabric: product.fabric || "Soft silk",
    length: product.length || "6.3 metres",
    color: product.color || null,
    description: product.description || null,
    image: images.length > 1 ? JSON.stringify(images) : cover,
    active: product.active !== false,
    updated_at: new Date().toISOString(),
  }
}

export { catalogImageByName, catalogImageById }
