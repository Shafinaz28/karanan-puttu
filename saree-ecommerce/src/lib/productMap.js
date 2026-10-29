/** Map a Supabase row to the shape used across the shop UI. */
export function mapDbProduct(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: [2800, 5599].includes(Number(row.price)) ? 2799 : Number(row.price),
    compareAt: 5599,
    badge: row.badge || null,
    saleGroup: row.sale_group || "soft",
    line: row.line || "",
    featured: Boolean(row.featured),
    party: Boolean(row.party),
    fabric: row.fabric || "Soft silk",
    length: row.length || "6.3 metres",
    color: row.color || "",
    description: row.description || "",
    image: row.image,
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
