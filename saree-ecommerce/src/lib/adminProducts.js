import { mapDbProduct, toDbPayload } from "./productMap"
import { supabase } from "./supabase"

export async function fetchAdminProducts() {
  const { data, error } = await supabase.from("products").select("*").order("id", { ascending: true })
  if (error) throw error
  return (data || []).map(mapDbProduct)
}

export async function createProduct(form) {
  const payload = toDbPayload(form)
  const { data, error } = await supabase.from("products").insert(payload).select("*").single()
  if (error) throw error
  return mapDbProduct(data)
}

export async function updateProduct(id, form) {
  const payload = toDbPayload(form)
  const { data, error } = await supabase.from("products").update(payload).eq("id", id).select("*").single()
  if (error) throw error
  return mapDbProduct(data)
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
