import { mapDbProduct, toDbPayload } from "./productMap"
import { supabase } from "./supabase"

export async function fetchAdminProducts() {
  const { data, error } = await supabase.from("products").select("*").order("id", { ascending: true })
  if (error) throw error
  return (data || []).map(mapDbProduct)
}

function withoutOccasionColumn(payload, occasion) {
  const { occasion: _occasion, ...rest } = payload
  if (!occasion) return rest
  const badge = String(rest.badge || "")
  const mark = occasion === "festivals" ? "Festivals" : occasion === "wedding" ? "Wedding" : "Party"
  if (new RegExp(mark, "i").test(badge)) return rest
  return { ...rest, badge: badge ? `${badge} · ${mark}` : mark }
}

async function writeProduct(query, payload, occasion) {
  let { data, error } = await query(payload)
  if (error && /occasion/i.test(error.message || "")) {
    ;({ data, error } = await query(withoutOccasionColumn(payload, occasion)))
  }
  if (error) throw error
  return mapDbProduct(data)
}

export async function createProduct(form) {
  const payload = toDbPayload(form)
  return writeProduct(
    (body) => supabase.from("products").insert(body).select("*").single(),
    payload,
    form.occasion,
  )
}

export async function updateProduct(id, form) {
  const payload = toDbPayload(form)
  return writeProduct(
    (body) => supabase.from("products").update(body).eq("id", id).select("*").single(),
    payload,
    form.occasion,
  )
}

export async function deleteProduct(id) {
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) throw error
}

export async function setProductActive(id, active) {
  const { error } = await supabase
    .from("products")
    .update({ active, updated_at: new Date().toISOString() })
    .eq("id", id)
  if (error) throw error
}

export function validateProductForm(form) {
  if (!String(form.name || "").trim()) return "Enter a product name."
  if (!Number.isFinite(Number(form.price)) || Number(form.price) <= 0) return "Enter a valid price."
  if (!String(form.image || "").trim()) return "Add a photo or paste an image URL."
  return ""
}
