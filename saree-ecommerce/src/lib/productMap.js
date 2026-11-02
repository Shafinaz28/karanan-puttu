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

/** Map a Supabase row to the shape used across the shop UI. */
export function mapDbProduct(row) {
  const price = Number(row.price) || 2799
  const shopCategory =
    row.shop_category ||
    (/tissue/i.test(`${row.fabric || ""} ${row.category || ""}`) ? "tissue" : null) ||
    (row.party ? "party" : null) ||
    (row.sale_group === "traditional" ? "traditional" : "soft")
  const compareAt =
    Number(row.compare_at) ||
    (shopCategory === "tissue" || price >= 7000 ? 15999 : 5599)

  let image = resolveProductImageUrl(row.image)
  const rawImage = String(row.image || "").trim()
  const fallback = catalogFallbackImage(row)
  const isHostedProductPhoto =
    /^https?:\/\//i.test(rawImage) &&
    !rawImage.includes(`/storage/v1/object/public/${storageBucket}/`)

  if (!isHostedProductPhoto && fallback) {
    const needsFallback =
      !rawImage ||
      /\.jpe?g$/i.test(rawImage) ||
      (rawImage.startsWith("/sarees/") && !/\.avif$/i.test(rawImage)) ||
      (!rawImage.startsWith("/") && !/^https?:\/\//i.test(rawImage))
    if (needsFallback) image = fallback
  }

  if (!image && fallback) image = fallback

  return {
    id: row.id,
    name: row.name,
    category: row.category,
    shopCategory,
    price: [2800, 5599].includes(price) ? 2799 : price,
    compareAt,
    badge: row.badge || null,
    saleGroup: row.sale_group || shopCategory,
    line: row.line || "",
    featured: Boolean(row.featured),
    party: Boolean(row.party),
    fabric: row.fabric || "Soft silk",
    length: row.length || "6.3 metres",
    color: row.color || "",
    description: row.description || "",
    image,
    active: row.active !== false,
  }
}

export function toDbPayload(product) {
  return {
    name: product.name,
    category: product.category || "Soft Silk",
    price: Number(product.price) || 2799,
    badge: product.badge || null,
    sale_group: product.saleGroup || "soft",
    line: product.line || null,
    featured: Boolean(product.featured),
    party: Boolean(product.party),
    fabric: product.fabric || "Soft silk",
    length: product.length || "6.3 metres",
    color: product.color || null,
    description: product.description || null,
    image: product.image,
    active: product.active !== false,
    updated_at: new Date().toISOString(),
  }
}

export { catalogImageByName, catalogImageById }
