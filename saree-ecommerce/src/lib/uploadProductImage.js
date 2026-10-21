import { supabase, supabaseConfigured } from "./supabase"

const bucket = "product-images"

export async function uploadProductImage(file) {
  if (!supabaseConfigured || !supabase) {
    throw new Error("Connect Supabase before uploading a photo.")
  }
  const { data: sessionData } = await supabase.auth.getSession()
  if (!sessionData.session) {
    throw new Error("Sign in at Admin login, then upload the photo.")
  }
  const extension = (file.name.split(".").pop() || "jpg").toLowerCase()
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    contentType: file.type || "image/jpeg",
    upsert: false,
  })
  if (error) throw error
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
