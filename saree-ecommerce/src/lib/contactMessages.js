import { supabase, supabaseConfigured } from "./supabase"

function requireSupabase() {
  if (!supabaseConfigured || !supabase) {
    throw new Error("Contact messages need Supabase. Configure the Supabase URL and anon key in .env.")
  }
  return supabase
}

function explainTableError(error) {
  if (/contact_messages|schema cache|does not exist/i.test(error.message || "")) {
    return new Error("The contact_messages table is not set up yet. Run supabase/contact_messages.sql in the Supabase SQL Editor.")
  }
  return error
}

export async function submitContactMessage({ name, mobile, email, message }) {
  const client = requireSupabase()
  const { error } = await client.from("contact_messages").insert({
    name: name.trim(),
    mobile: mobile.trim(),
    email: email.trim().toLowerCase(),
    message: message.trim(),
  })
  if (error) throw explainTableError(error)
}

export async function loadContactMessages() {
  const client = requireSupabase()
  const { data, error } = await client
    .from("contact_messages")
    .select("id, name, mobile, email, message, status, created_at")
    .order("created_at", { ascending: false })
  if (error) throw explainTableError(error)
  return data || []
}

export async function updateContactMessageStatus(id, status) {
  const client = requireSupabase()
  const { error } = await client
    .from("contact_messages")
    .update({ status })
    .eq("id", id)
  if (error) throw explainTableError(error)
}
