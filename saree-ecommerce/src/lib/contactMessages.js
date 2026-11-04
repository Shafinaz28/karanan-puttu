import { supabase, supabaseConfigured } from "./supabase"

function requireSupabase() {
  if (!supabaseConfigured || !supabase) {
    throw new Error("Contact messages need Supabase. Configure the Supabase URL and anon key in .env.")
  }
  return supabase
}

function explainTableError(error) {
  if (/contact_messages|contact-photos|schema cache|does not exist/i.test(error.message || "")) {
    return new Error("Contact enquiry storage is not set up. Run supabase/contact_messages.sql in the Supabase SQL Editor.")
  }
  return error
}

export async function submitContactMessage({
  name,
  mobile,
  email,
  message,
  sareeType,
  sareeCount,
  photoPaths,
}) {
  const client = requireSupabase()
  const { error } = await client.from("contact_messages").insert({
    name: name.trim(),
    mobile: mobile.trim(),
    email: email.trim().toLowerCase() || null,
    message: message.trim(),
    saree_type: sareeType?.trim() || "Not specified",
    saree_count: Number(sareeCount) || 1,
    photo_paths: photoPaths || [],
  })
  if (error) throw explainTableError(error)
}

export async function loadContactMessages() {
  const client = requireSupabase()
  const { data, error } = await client
    .from("contact_messages")
    .select("id, name, mobile, email, message, saree_type, saree_count, photo_paths, status, created_at")
    .order("created_at", { ascending: false })
  if (error) throw explainTableError(error)
  return Promise.all(
    (data || []).map(async (message) => {
      const photoPaths = message.photo_paths || []
      if (photoPaths.length === 0) return { ...message, photos: [] }
      const { data: photos, error: photoError } = await client.storage
        .from(photoBucket)
        .createSignedUrls(photoPaths, 3600)
      if (photoError) throw photoError
      const failedPhoto = photos.find((photo) => photo.error || !photo.signedUrl)
      if (failedPhoto) throw new Error(failedPhoto.error || "Unable to access an uploaded contact photo.")
      return {
        ...message,
        photos: photos.map((photo) => photo.signedUrl),
      }
    }),
  )
}

export async function updateContactMessageStatus(id, status) {
  const client = requireSupabase()
  const { error } = await client
    .from("contact_messages")
    .update({ status })
    .eq("id", id)
  if (error) throw explainTableError(error)
}
