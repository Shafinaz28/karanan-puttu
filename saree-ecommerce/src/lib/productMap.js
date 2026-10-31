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
