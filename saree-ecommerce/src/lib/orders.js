import { supabase, supabaseConfigured } from "./supabase"

const storageKey = "karanan-orders"

export function findOrder(orderId, phone) {
  const id = String(orderId || "").trim().toUpperCase()
  const digits = String(phone || "").replace(/\D/g, "").slice(-10)
  if (!id || digits.length < 10) return null
  return readOrders().find((order) => {
    const orderDigits = String(order.phone || "").replace(/\D/g, "").slice(-10)
    return String(order.id).toUpperCase() === id && orderDigits === digits
  }) || null
}

export function readOrders() {
  try {
    const raw = window.localStorage.getItem(storageKey)
    const list = raw ? JSON.parse(raw) : []
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

function writeOrders(orders) {
  window.localStorage.setItem(storageKey, JSON.stringify(orders))
  window.dispatchEvent(new Event("karanan-orders"))
}

function deliveryLabel(from) {
  const date = new Date(from)
  date.setDate(date.getDate() + 10)
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`
}

function nextOrderId(orders) {
  const highest = orders.reduce((max, order) => {
    const number = Number(String(order.id).replace(/\D/g, ""))
    return Number.isFinite(number) ? Math.max(max, number) : max
  }, 1000)
  return `KP${highest + 1}`
}

export function saveOrder(input) {
  const current = readOrders()
  const saved = {
    id: nextOrderId(current),
    customer: input.customer,
    phone: input.phone,
    address: input.address,
    city: input.city,
    state: input.state || "",
    pincode: input.pincode,
    payment: input.payment || "Cash on delivery",
    amount: input.amount,
    items: input.items,
    status: "Pending",
    createdAt: new Date().toISOString(),
    date: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    deliveryBy: deliveryLabel(new Date()),
  }
  writeOrders([saved, ...current])
  if (supabaseConfigured && supabase) {
    supabase.from("orders").insert({
      id: saved.id,
      customer: saved.customer,
      phone: saved.phone,
      address: saved.address,
      city: saved.city,
      state: saved.state,
      pincode: saved.pincode,
      payment: saved.payment,
      amount: saved.amount,
      status: saved.status,
      items: saved.items,
      created_at: saved.createdAt,
    }).then(() => {})
  }
  return saved
}

export function updateOrderStatus(id, status, extra = {}) {
  const next = readOrders().map((order) => (
    order.id === id ? { ...order, status, cancelledAt: status === "Cancelled" ? (extra.cancelledAt || order.cancelledAt || new Date().toISOString()) : order.cancelledAt, ...extra } : order
  ))
  writeOrders(next)
  if (supabaseConfigured && supabase) {
    supabase.from("orders").update({ status }).eq("id", id).then(() => {})
  }
  return next
}

function mapDbOrder(row) {
  const createdAt = row.created_at || new Date().toISOString()
  return {
    id: row.id,
    customer: row.customer,
    phone: row.phone || "",
    address: row.address || "",
    city: row.city || "",
    state: row.state || "",
    pincode: row.pincode || "",
    payment: row.payment || "Cash on delivery",
    amount: row.amount,
    items: row.items || [],
    status: row.status || "Pending",
    createdAt,
    date: new Date(createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  }
}

export async function loadOrders() {
  const local = readOrders()
  if (!supabaseConfigured || !supabase) return local
  const { data: sessionData } = await supabase.auth.getSession()
  if (!sessionData.session) return local
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
  if (error || !data?.length) return local
  const merged = new Map()
  for (const order of [...data.map(mapDbOrder), ...local]) merged.set(order.id, order)
  return [...merged.values()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}
