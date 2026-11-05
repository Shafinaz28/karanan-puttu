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

function nextOrderId() {
  return `KP${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}

function explainOrderError(error) {
  const message = error?.message || ""
  if (/cancelled_orders|admin_cancel_order/i.test(message)) {
    return new Error("Cancelled-order storage is not set up. Run supabase/cancel.sql after supabase/orders.sql in the Supabase SQL Editor.")
  }
  if (/cancel_order|function.*schema cache/i.test(message)) {
    return new Error("Customer cancellation is not set up. Run supabase/cancel.sql after supabase/orders.sql in the Supabase SQL Editor.")
  }
  if (/row-level security|permission denied|not allowed/i.test(message)) {
    return new Error("The order database rejected this order. Check the shopper insert policy in supabase/orders.sql.")
  }
  if (/orders|schema cache|does not exist/i.test(message)) {
    return new Error("Order storage is not set up. Run supabase/orders.sql in the Supabase SQL Editor.")
  }
  if (/failed to fetch|networkerror|network request failed|invalid url/i.test(message)) {
    return new Error("Cannot reach Supabase. Check the internet connection and VITE_SUPABASE_URL in saree-ecommerce/.env, then restart the app or redeploy.")
  }
  return error instanceof Error ? error : new Error(message || "Unable to save the order.")
}

export async function saveOrder(input) {
  if (!supabaseConfigured || !supabase) {
    throw new Error("Order storage is unavailable. Configure the Supabase URL and anon key before accepting orders.")
  }

  const saved = {
    id: nextOrderId(),
    customer: input.customer,
    email: input.email || "",
    phone: input.phone,
    address: input.address,
    city: input.city,
    state: input.state || "",
    pincode: input.pincode,
    payment: input.payment || "Cash on delivery",
    amount: input.amount,
    couponCode: input.couponCode || "",
    discountAmount: Number(input.discountAmount || 0),
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
  const { error } = await supabase.from("orders").insert({
    id: saved.id,
    customer: saved.customer,
    email: saved.email,
    phone: saved.phone,
    address: saved.address,
    city: saved.city,
    state: saved.state,
    pincode: saved.pincode,
    payment: saved.payment,
    amount: saved.amount,
    coupon_code: saved.couponCode || null,
    discount_amount: saved.discountAmount,
    status: saved.status,
    items: saved.items,
    created_at: saved.createdAt,
  })
  if (error) throw explainOrderError(error)

  writeOrders([saved, ...readOrders()])
  return saved
}

function cancellationDetails(extra = {}) {
  return {
    cancelledAt: extra.cancelledAt || new Date().toISOString(),
    cancelReason: extra.cancelReason || "",
    cancelNote: extra.cancelNote || "",
  }
}

function updateLocalOrderStatus(id, status, extra = {}) {
  const next = readOrders().map((order) => (
    order.id === id
      ? { ...order, status, ...(status === "Cancelled" ? cancellationDetails(extra) : {}), ...extra }
      : order
  ))
  writeOrders(next)
  return next
}

export async function updateOrderStatus(id, status, extra = {}) {
  if (!supabaseConfigured || !supabase) {
    throw new Error("Order storage is unavailable. Configure Supabase before updating an order.")
  }
  if (status === "Cancelled") {
    const details = cancellationDetails(extra)
    const { data, error } = await supabase.rpc("admin_cancel_order", {
      p_order_id: id,
      p_reason: details.cancelReason,
      p_note: details.cancelNote,
    })
    if (error) throw explainOrderError(error)
    if (!data) throw new Error("This order could not be cancelled. Refresh the dashboard and try again.")
    return updateLocalOrderStatus(id, status, details)
  }

  const { data, error } = await supabase.from("orders").update({ status }).eq("id", id).select("id")
  if (error) throw explainOrderError(error)
  if (!data?.length) throw new Error("This order could not be updated. Refresh the dashboard and try again.")
  return updateLocalOrderStatus(id, status, extra)
}

export async function cancelCustomerOrder(id, phone, details = {}) {
  if (!supabaseConfigured || !supabase) {
    throw new Error("Order storage is unavailable. Please contact the store to cancel this order.")
  }
  const { data, error } = await supabase.rpc("cancel_order", {
    p_order_id: id,
    p_phone: phone,
    p_reason: details.cancelReason || "",
    p_note: details.cancelNote || "",
  })
  if (error) throw explainOrderError(error)
  if (!data) {
    throw new Error("This order could not be cancelled. Check the order ID and phone number, or contact the store.")
  }
  return updateLocalOrderStatus(id, "Cancelled", details)
}

function mapDbOrder(row) {
  const createdAt = row.created_at || new Date().toISOString()
  return {
    id: row.id,
    customer: row.customer,
    email: row.email || "",
    phone: row.phone || "",
    address: row.address || "",
    city: row.city || "",
    state: row.state || "",
    pincode: row.pincode || "",
    payment: row.payment || "Cash on delivery",
    amount: row.amount,
    couponCode: row.coupon_code || "",
    discountAmount: Number(row.discount_amount || 0),
    items: row.items || [],
    status: row.status || "Pending",
    createdAt,
    cancelledAt: row.cancelled_at || "",
    cancelReason: row.cancel_reason || "",
    cancelNote: row.cancel_note || "",
    date: new Date(createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  }
}

function mergeOrders(...groups) {
  const merged = new Map()
  for (const group of groups) {
    for (const order of group) {
      merged.set(order.id, order)
    }
  }
  return [...merged.values()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

async function loadAllDbOrders(table) {
  const pageSize = 1000
  const orders = []
  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order("created_at", { ascending: false })
      .order("id", { ascending: true })
      .range(offset, offset + pageSize - 1)
    if (error) return { data: null, error }
    orders.push(...(data || []))
    if (!data || data.length < pageSize) return { data: orders, error: null }
  }
}

export async function loadOrders() {
  const local = readOrders()
  if (!supabaseConfigured || !supabase) return { orders: local, warning: "" }
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  if (sessionError) throw explainOrderError(sessionError)
  if (!sessionData.session) return { orders: local, warning: "" }
  const [{ data, error }, { data: cancelledData, error: cancelledError }] = await Promise.all([
    loadAllDbOrders("orders"),
    loadAllDbOrders("cancelled_orders"),
  ])
  if (error) throw explainOrderError(error)
  const warning = cancelledError
    ? explainOrderError(cancelledError).message
    : ""
  return {
    orders: mergeOrders(
      local,
      (data || []).map(mapDbOrder),
      (cancelledData || []).map(mapDbOrder),
    ),
    warning,
  }
}

export async function loadCustomers() {
  if (!supabaseConfigured || !supabase) return []
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  if (sessionError) throw explainOrderError(sessionError)
  if (!sessionData.session) return []

  const pageSize = 1000
  const customers = []
  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await supabase
      .from("customers")
      .select("customer_key, customer, email, phone, address, city, state, pincode, orders_count, total_spent, last_order_at")
      .order("last_order_at", { ascending: false })
      .range(offset, offset + pageSize - 1)
    if (error) {
      if (/customers|schema cache|does not exist/i.test(error.message || "")) {
        throw new Error("Customer storage is not set up. Run supabase/customers.sql after supabase/orders.sql in the Supabase SQL Editor.")
      }
      throw explainOrderError(error)
    }

    customers.push(...(data || []).map((row) => ({
      id: row.customer_key,
      customer: row.customer,
      email: row.email || "",
      phone: row.phone || "",
      address: row.address || "",
      city: row.city || "",
      state: row.state || "",
      pincode: row.pincode || "",
      ordersCount: Number(row.orders_count || 0),
      totalSpent: Number(row.total_spent || 0),
      lastOrderAt: row.last_order_at,
    })))
    if (!data || data.length < pageSize) return customers
  }
}

export async function loadCustomerProfiles() {
  if (!supabaseConfigured || !supabase) return []
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  if (sessionError) throw explainOrderError(sessionError)
  if (!sessionData.session) return []

  const pageSize = 1000
  const profiles = []
  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, phone, created_at")
      .eq("account_type", "customer")
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1)
    if (error) {
      if (/profiles|schema cache|does not exist/i.test(error.message || "")) {
        throw new Error("Customer profiles are not set up. Run supabase/profiles.sql in the Supabase SQL Editor.")
      }
      throw explainOrderError(error)
    }

    profiles.push(...(data || []).map((profile) => ({
      id: profile.id,
      customer: profile.full_name || profile.email || "Customer",
      email: profile.email || "",
      phone: profile.phone || "",
      createdAt: profile.created_at,
    })))
    if (!data || data.length < pageSize) return profiles
  }
}
