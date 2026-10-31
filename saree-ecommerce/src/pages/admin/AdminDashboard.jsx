import { Fragment, useEffect, useMemo, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import logo from "../../assets/images/kpc-logo.avif"
import { clearUser, readUser } from "../Login"
import { formatPrice } from "../../data/products"
import { mapDbProduct, toDbPayload } from "../../lib/productMap"
import { uploadProductImage } from "../../lib/uploadProductImage"
import { loadOrders, readOrders, updateOrderStatus } from "../../lib/orders"
import {
  loadContactMessages,
  updateContactMessageStatus,
} from "../../lib/contactMessages"
import { supabase, supabaseConfigured } from "../../lib/supabase"
import { useProducts } from "../../context/ProductsContext"

const emptyForm = {
  name: "",
  category: "Soft Silk",
  price: 2799,
  badge: "",
  saleGroup: "soft",
  line: "",
  fabric: "Soft silk",
  length: "6.3 metres",
  color: "",
  description: "",
  image: "/sarees/worn/worn-purple.avif",
  featured: false,
  party: false,
  active: true,
}

function customerIdentity(order) {
  const email = String(order.email || "").trim().toLowerCase()
  if (email) return `email:${email}`
  const phone = String(order.phone || "").replace(/\D/g, "")
  if (phone) return `phone:${phone}`
  return `name:${String(order.customer || "").trim().toLowerCase()}`
}

function uniqueCustomerCount(orders) {
  return new Set(orders.map(customerIdentity).filter((key) => key !== "name:")).size
}

const statusTone = {
  Delivered: "bg-primary/10 text-primary",
  Shipped: "bg-secondary/25 text-[#8a6a1e]",
  "Out for delivery": "bg-primary-soft/15 text-primary-soft",
  Processing: "bg-[#f3e8dc] text-primary",
  Pending: "bg-cream-deep text-primary-soft",
  Cancelled: "bg-rose-50 text-rose-700",
}

const navItems = [
  ["overview", "Dashboard"],
  ["orders", "Orders"],
  ["messages", "Messages"],
  ["products", "Products"],
  ["customers", "Customers"],
  ["analytics", "Analytics"],
  ["coupons", "Discounts"],
]

const footItems = [
  ["settings", "Settings"],
  ["help", "Help"],
]

function isAdminSession(session) {
  return session?.user?.app_metadata?.role === "admin"
}

function NavGlyph({ id }) {
  const paths = {
    overview: "M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z",
    orders: "M6 4h12v16H6zM9 8h6M9 12h6M9 16h4",
    messages: "M4 5h16v12H8l-4 3zM8 9h8M8 13h5",
    products: "M4 7h7v7H4zM13 7h7v7h-7zM4 16h7v4H4zM13 16h7v4h-7z",
    customers: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 19c.5-2.5 2.4-4 5-4s4.5 1.5 5 4M16 11a2.5 2.5 0 1 0 0-5M16 15c1.8 0 3.3.9 4 2.5",
    analytics: "M4 19V5M4 19h16M8 15l3-4 3 2 4-6",
    coupons: "M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z",
    settings: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 12h2M18 12h2M12 4v2M12 18v2",
    help: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9a2.5 2.5 0 1 1 3.2 2.4c-.7.3-1.2.9-1.2 1.6V14M12 17h.01",
    signout: "M10 7V5h9v14h-9v-2M4 12h10M7 9l-3 3 3 3",
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d={paths[id] || paths.overview} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { products: storeProducts, refreshProducts, fromDatabase } = useProducts()
  const [ready, setReady] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [tab, setTab] = useState("overview")
  const [query, setQuery] = useState("")
  const [rows, setRows] = useState([])
  const [orders, setOrders] = useState(() => readOrders())
  const [contactMessages, setContactMessages] = useState([])
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const user = readUser()
  const displayName = user?.email
    ? user.email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
    : "Admin"

  useEffect(() => {
    if (!supabase) {
      setAuthed(false)
      setReady(true)
      return undefined
    }
    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (sessionError) setError(sessionError.message)
      setAuthed(isAdminSession(data.session))
      setReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(isAdminSession(session))
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!authed) return undefined
    loadRows()
    return undefined
  }, [authed, storeProducts])

  useEffect(() => {
    if (!authed) return undefined
    const refreshOrders = () => {
      setOrders(readOrders())
      loadOrders().then(setOrders).catch((loadError) => {
        setError(loadError instanceof Error ? loadError.message : "Unable to load saved orders.")
      })
    }
    refreshOrders()
    window.addEventListener("focus", refreshOrders)
    window.addEventListener("storage", refreshOrders)
    window.addEventListener("karanan-orders", refreshOrders)
    return () => {
      window.removeEventListener("focus", refreshOrders)
      window.removeEventListener("storage", refreshOrders)
      window.removeEventListener("karanan-orders", refreshOrders)
    }
  }, [authed])

  useEffect(() => {
    if (!authed || tab !== "messages") return undefined
    let active = true
    loadContactMessages()
      .then((data) => {
        if (active) setContactMessages(data)
      })
      .catch((loadError) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load contact messages.")
        }
      })
      .finally(() => {
        if (active) setMessagesLoading(false)
      })
    return () => {
      active = false
    }
  }, [authed, tab])

  async function changeContactMessageStatus(id, status) {
    setError("")
    try {
      await updateContactMessageStatus(id, status)
      setContactMessages((current) => current.map((message) => (
        message.id === id ? { ...message, status } : message
      )))
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update this message.")
    }
  }

  function changeStatus(id, status) {
    setOrders(updateOrderStatus(id, status))
  }

  const filteredRows = useMemo(() => {
    const text = query.trim().toLowerCase()
    if (!text) return rows
    return rows.filter((product) =>
      `${product.name} ${product.category} ${product.color}`.toLowerCase().includes(text),
    )
  }, [rows, query])

  const filteredOrders = useMemo(() => {
    const text = query.trim().toLowerCase()
    if (!text) return orders
    return orders.filter((order) =>
      `${order.id} ${order.customer} ${order.phone} ${(order.items || []).map((item) => item.name).join(" ")}`.toLowerCase().includes(text),
    )
  }, [orders, query])

  const filteredContactMessages = useMemo(() => {
    const text = query.trim().toLowerCase()
    if (!text) return contactMessages
    return contactMessages.filter((message) =>
      `${message.name} ${message.mobile} ${message.email} ${message.message}`.toLowerCase().includes(text),
    )
  }, [contactMessages, query])

  async function loadRows() {
    setLoading(true)
    setError("")
    if (!supabaseConfigured || !supabase) {
      setRows(storeProducts)
      setLoading(false)
      return
    }
    const { data, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true })
    if (fetchError) {
      setError(
        /schema cache|could not find the table/i.test(fetchError.message)
          ? "The products table is not in Supabase yet. Open the SQL Editor, paste supabase/setup.sql, click Run, then refresh this page."
          : fetchError.message,
      )
      setRows(storeProducts)
    } else if (!data?.length) {
      setRows(storeProducts)
    } else {
      setRows(data.map(mapDbProduct))
    }
    setLoading(false)
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut()
    clearUser()
    navigate("/admin/login", { replace: true })
  }

  function startEdit(product) {
    setEditingId(product.id)
    setTab("products")
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      badge: product.badge || "",
      saleGroup: product.saleGroup || "soft",
      line: product.line || "",
      fabric: product.fabric || "Soft silk",
      length: product.length || "6.3 metres",
      color: product.color || "",
      description: product.description || "",
      image: product.image,
      featured: Boolean(product.featured),
      party: Boolean(product.party),
      active: product.active !== false,
    })
  }

  function resetForm() {
    setEditingId(null)
    setForm(emptyForm)
  }

  async function saveProduct(event) {
    event.preventDefault()
    if (!supabaseConfigured || !supabase) {
      setError("Connect Supabase in .env to save products to the database.")
      return
    }
    setSaving(true)
    setError("")
    const payload = toDbPayload(form)
    const result = editingId
      ? await supabase.from("products").update(payload).eq("id", editingId)
      : await supabase.from("products").insert(payload)
    setSaving(false)
    if (result.error) {
      setError(result.error.message)
      return
    }
    resetForm()
    await loadRows()
    await refreshProducts()
  }

  async function removeProduct(id) {
    if (!window.confirm("Delete this saree from the database?")) return
    if (!supabaseConfigured || !supabase) {
      setError("Connect Supabase in .env to delete products from the database.")
      return
    }
    const { error: deleteError } = await supabase.from("products").delete().eq("id", id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    if (editingId === id) resetForm()
    await loadRows()
    await refreshProducts()
  }

  if (!ready) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f6f1ea] text-sm text-ink/60">Loading dashboard…</div>
  }
  if (!authed) return <Navigate to="/admin/login" replace />

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[radial-gradient(circle_at_top_left,#f3e8dc,transparent_42%),radial-gradient(circle_at_bottom_right,#e7d5c4,transparent_40%),linear-gradient(160deg,#f7f1e8,#f3e8dc_48%,#f6efe4)] text-ink lg:flex-row">
      <aside className="flex shrink-0 flex-col border-white/70 bg-white/55 backdrop-blur-xl lg:h-full lg:w-[240px] lg:border-r">
        <div className="flex items-center gap-3 px-5 py-5">
          <img src={logo} alt="" className="h-10 w-10 rounded-2xl bg-white object-contain p-1 shadow-sm" />
          <div>
            <p className="text-lg leading-none font-semibold text-primary">Karnan Pattu</p>
            <p className="mt-1 text-[11px] text-slate-500">Sarees and more</p>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-visible">
          {navItems.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setTab(id)
                if (id === "messages" && tab !== id) {
                  setMessagesLoading(true)
                  setError("")
                }
                if (id === "orders" || id === "overview" || id === "customers") setOrders(readOrders())
              }}
              className={`flex min-w-fit items-center justify-between rounded-2xl px-3 py-2.5 text-left text-sm lg:w-full ${
                tab === id ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:bg-white/70"
              }`}
            >
              <span className="flex items-center gap-2.5"><NavGlyph id={id} />{label}</span>
              {id === "orders" && orders.length > 0 && (
                <span className="ml-3 rounded-full bg-secondary/25 px-2 py-0.5 text-[11px] text-primary">
                  {orders.length}
                </span>
              )}
              {id === "messages" && contactMessages.some((message) => message.status === "New") && (
                <span className="ml-3 rounded-full bg-secondary/25 px-2 py-0.5 text-[11px] text-primary">
                  {contactMessages.filter((message) => message.status === "New").length}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="flex gap-1 overflow-x-auto px-3 pb-4 lg:mt-auto lg:flex-col">
          {footItems.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex min-w-fit items-center gap-2.5 rounded-2xl px-3 py-2.5 text-left text-sm lg:w-full ${
                tab === id ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:bg-white/70"
              }`}
            >
              <NavGlyph id={id} />
              {label}
            </button>
          ))}
          <button type="button" onClick={signOut} className="flex min-w-fit items-center gap-2.5 rounded-2xl px-3 py-2.5 text-left text-sm text-slate-600 hover:bg-white/70 lg:w-full">
            <NavGlyph id="signout" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto">
        <header className="flex flex-wrap items-center gap-3 px-4 py-4 sm:px-6">
          <label className="flex min-w-[220px] flex-1 items-center gap-2 rounded-2xl border border-white/80 bg-white/70 px-4 py-2.5 shadow-sm">
            <span className="text-slate-400" aria-hidden="true">⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products, orders, messages..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>
          <div className="ml-auto flex items-center gap-2 rounded-2xl border border-white/80 bg-white/70 py-1 pr-3 pl-1 shadow-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-xs text-white">
              {displayName.slice(0, 1)}
            </span>
            <span>
              <span className="block max-w-[140px] truncate text-xs leading-none font-medium">{displayName}</span>
              <span className="text-[10px] text-slate-400">Store admin</span>
            </span>
          </div>
        </header>

        <div className="px-4 pb-8 sm:px-6">
          {error && <p className="mb-4 rounded-2xl bg-white/80 px-4 py-3 text-sm text-red-700">{error}</p>}
          {tab === "overview" && (
            <Overview
              name={/^karnan/i.test(displayName) ? "Karnan" : displayName.split(" ")[0]}
              productCount={rows.length}
              orders={orders}
              onOpenProducts={() => setTab("products")}
              onOpenOrders={() => setTab("orders")}
              onStatus={changeStatus}
            />
          )}
          {tab === "products" && (
            <ProductsPanel
              rows={filteredRows}
              loading={loading}
              form={form}
              setForm={setForm}
              editingId={editingId}
              saving={saving}
              fromDatabase={fromDatabase}
              onRefresh={loadRows}
              onEdit={startEdit}
              onDelete={removeProduct}
              onSave={saveProduct}
              onCancel={resetForm}
            />
          )}
          {tab === "orders" && (
            <section className="rounded-3xl border border-white/80 bg-white/75 p-5 shadow-sm">
              <h3 className="text-lg font-semibold">Orders</h3>
              <OrdersTable orders={filteredOrders} onStatus={changeStatus} />
            </section>
          )}
          {tab === "messages" && (
            <ContactMessagesPanel
              messages={filteredContactMessages}
              loading={messagesLoading}
              onStatus={changeContactMessageStatus}
            />
          )}
          {tab === "customers" && <Customers orders={filteredOrders} />}
          {tab === "coupons" && <CouponsPanel />}
          {tab === "analytics" && <AnalyticsPanel orders={orders} />}
          {tab === "settings" && (
            <SimplePanel
              title="Settings"
              text={supabaseConfigured ? "Supabase is connected. Product photos upload into the product-images folder." : "Add the Supabase URL and publishable key in .env to save the catalogue."}
            />
          )}
          {tab === "help" && (
            <SimplePanel
              title="Help"
              text="Call +91 98944 41500 or +91 99440 55900, or email karnanpattucenter@gmail.com. Orders placed in this browser appear on the dashboard right away."
            />
          )}
        </div>
      </div>
    </div>
  )
}
function monthDelta(current, previous, phrase = "previous month") {
  if (!previous && !current) return { text: `0% vs ${phrase}`, up: true }
  if (!previous) return { text: "New in this range", up: true }
  const pct = Math.round(((current - previous) / previous) * 1000) / 10
  return { text: `${pct > 0 ? "↑" : pct < 0 ? "↓" : ""} ${Math.abs(pct)}% vs ${phrase}`, up: pct >= 0 }
}

function boundsFor(key) {
  const now = new Date()
  if (key === "week") {
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    start.setDate(start.getDate() - 6)
    const end = new Date()
    end.setHours(23, 59, 59, 999)
    return { start, end }
  }
  if (key === "lastMonth") {
    return {
      start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
      end: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999),
    }
  }
  if (key === "all") return { all: true }
  return {
    start: new Date(now.getFullYear(), now.getMonth(), 1),
    end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
  }
}

function previousBoundsFor(key) {
  const now = new Date()
  if (key === "week") {
    const end = new Date()
    end.setDate(end.getDate() - 7)
    end.setHours(23, 59, 59, 999)
    const start = new Date(end)
    start.setHours(0, 0, 0, 0)
    start.setDate(start.getDate() - 6)
    return { start, end }
  }
  if (key === "lastMonth") {
    return {
      start: new Date(now.getFullYear(), now.getMonth() - 2, 1),
      end: new Date(now.getFullYear(), now.getMonth() - 1, 0, 23, 59, 59, 999),
    }
  }
  if (key === "all") return null
  return {
    start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
    end: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999),
  }
}

function withinBounds(order, bounds) {
  if (!bounds || bounds.all) return true
  const created = new Date(order.createdAt)
  if (Number.isNaN(created.getTime())) return false
  return created >= bounds.start && created <= bounds.end
}

function formatRangeDate(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function Overview({ name, productCount, orders, onOpenProducts, onOpenOrders, onStatus }) {
  const [range, setRange] = useState("month")
  const [rangeOpen, setRangeOpen] = useState(false)
  const bounds = boundsFor(range)
  const shown = orders.filter((order) => withinBounds(order, bounds))
  const earlier = previousBoundsFor(range)
  const previous = earlier ? orders.filter((order) => withinBounds(order, earlier) && order.status !== "Cancelled") : []
  const compareLabel = range === "week" ? "previous week" : "previous month"
  const live = shown.filter((order) => order.status !== "Cancelled")
  const revenue = live.reduce((sum, order) => sum + Number(order.amount || 0), 0)
  const customers = uniqueCustomerCount(shown)
  const average = live.length ? Math.round(revenue / live.length) : 0
  const prevCustomers = uniqueCustomerCount(orders.filter((order) => withinBounds(order, earlier)))
  const prevRevenue = previous.reduce((sum, order) => sum + Number(order.amount || 0), 0)
  const prevAverage = previous.length ? Math.round(prevRevenue / previous.length) : 0
  const week = lastSevenDays(shown, range === "lastMonth" ? bounds.end : new Date())
  const weekTotal = week.reduce((sum, day) => sum + day.amount, 0)
  const top = topSelling(shown)
  const statusRows = [
    ["Delivered", "#4a0e17"],
    ["Processing", "#c59b27"],
    ["Pending", "#6b1a26"],
    ["Shipped", "#a67c2d"],
    ["Out for delivery", "#8d3a45"],
    ["Cancelled", "#c4a484"],
  ].map(([label, color]) => ({
    label,
    color,
    count: shown.filter((order) => order.status === label).length,
  }))
  const counted = statusRows.reduce((sum, row) => sum + row.count, 0)
  const payments = [
    ["Cash on delivery", live.filter((order) => /cash/i.test(order.payment || "Cash on delivery")).length, "bg-primary"],
    ["Pay online", live.filter((order) => /online/i.test(order.payment || "")).length, "bg-secondary"],
  ]
  const payTotal = payments.reduce((sum, row) => sum + row[1], 0) || 1
  const delivered = statusRows.find((row) => row.label === "Delivered").count
  const funnel = [
    ["Sarees listed", productCount, "#4a0e17"],
    ["Orders placed", shown.length, "#6b1a26"],
    ["Customers", customers, "#a67c2d"],
    ["Delivered", delivered, "#c59b27"],
  ]
  const cards = [
    ["Total revenue", formatPrice(revenue), range === "all" ? { text: "All saved orders", up: true } : monthDelta(revenue, prevRevenue, compareLabel), "bg-primary/10 text-primary"],
    ["Total orders", String(shown.length), range === "all" ? { text: "All saved orders", up: true } : monthDelta(live.length, previous.length, compareLabel), "bg-secondary/20 text-primary"],
    ["New customers", String(customers), range === "all" ? { text: "All saved orders", up: true } : monthDelta(customers, prevCustomers, compareLabel), "bg-primary-soft/15 text-primary-soft"],
    ["Average order value", formatPrice(average), range === "all" ? { text: "All saved orders", up: true } : monthDelta(average, prevAverage, compareLabel), "bg-secondary/25 text-[#8a6a1e]"],
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">Welcome back, {name}</p>
          <p className="text-sm text-slate-500">Here&apos;s what&apos;s happening with your saree store today.</p>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setRangeOpen((open) => !open)}
            className="flex items-center gap-2 rounded-2xl border border-white/80 bg-white/80 px-3 py-2 text-sm text-slate-600 shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
              <rect x="4" y="5" width="16" height="15" rx="2" />
              <path d="M8 3v4M16 3v4M4 10h16" strokeLinecap="round" />
            </svg>
            <span>{bounds.all ? "All orders" : `${formatRangeDate(bounds.start)} – ${formatRangeDate(bounds.end)}`}</span>
            <span className="text-xs text-slate-400" aria-hidden="true">▾</span>
          </button>
          {rangeOpen && (
            <ul className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-2xl border border-black/5 bg-white py-1 text-sm shadow-lg">
              {[
                ["month", "This month"],
                ["lastMonth", "Last month"],
                ["week", "Last 7 days"],
                ["all", "All orders"],
              ].map(([key, label]) => (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => {
                      setRange(key)
                      setRangeOpen(false)
                    }}
                    className={`block w-full px-3 py-2 text-left hover:bg-cream ${range === key ? "text-primary" : "text-slate-600"}`}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, change, tint]) => (
          <li key={label} className="rounded-3xl border border-white/80 bg-white/75 p-4 shadow-sm">
            <span className={`mb-3 flex h-9 w-9 items-center justify-center rounded-2xl text-sm ${tint}`}>₹</span>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-semibold">{value}</p>
            <p className={`mt-1 text-xs ${change.up ? "text-emerald-600" : "text-rose-600"}`}>{change.text}</p>
          </li>
        ))}
      </ul>
      <div className="grid gap-3 xl:grid-cols-[1.35fr_0.85fr]">
        <section className="rounded-3xl border border-white/80 bg-white/75 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Revenue overview</h3>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">Last 7 days</span>
          </div>
          <p className="mt-3 text-3xl font-semibold">{formatPrice(weekTotal)}</p>
          <p className="text-xs text-slate-400">Total revenue this week</p>
          <SalesChart days={week} />
        </section>
        <section className="rounded-3xl border border-white/80 bg-white/75 p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">Order status mix</h3>
            <button type="button" onClick={onOpenOrders} className="text-xs text-primary">View all</button>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-4 sm:justify-between">
            <PieChart total={shown.length} parts={statusRows} />
            <ul className="min-w-[180px] flex-1 space-y-2 text-sm">
              {statusRows.map((row) => (
                <li key={row.label} className="grid grid-cols-[1fr_auto_auto] items-center gap-3">
                  <span>{row.label}</span>
                  <span className="text-slate-400">{counted ? Math.round((row.count / counted) * 100) : 0}%</span>
                  <span>{row.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
      <div className="grid gap-3 xl:grid-cols-2">
        <section className="rounded-3xl border border-white/80 bg-white/75 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">How they paid</h3>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">All orders</span>
          </div>
          <ul className="mt-5 space-y-4">
            {payments.map(([label, count, bar]) => (
              <li key={label} className="grid grid-cols-[140px_1fr_48px] items-center gap-3 text-sm">
                <span>{label}</span>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className={`h-2 rounded-full ${bar}`} style={{ width: `${Math.max(count ? 8 : 0, Math.round((count / payTotal) * 100))}%` }} />
                </div>
                <span className="text-right text-slate-500">{Math.round((count / payTotal) * 100)}%</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-3xl border border-white/80 bg-white/75 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Order funnel</h3>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">This shop</span>
          </div>
          <BarChart items={funnel} />
        </section>
      </div>
      <div className="grid gap-3 xl:grid-cols-2">
        <section className="rounded-3xl border border-white/80 bg-white/75 p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">Best selling products</h3>
            <button type="button" onClick={onOpenProducts} className="text-xs text-primary">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead className="text-xs text-slate-400">
                <tr>
                  <th className="py-2 font-medium">#</th>
                  <th className="py-2 font-medium">Product</th>
                  <th className="py-2 font-medium">Units sold</th>
                  <th className="py-2 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {top.map((product, index) => (
                  <tr key={product.id || product.name} className="border-t border-slate-100">
                    <td className="py-2.5 text-slate-400">{index + 1}</td>
                    <td className="py-2.5">
                      <span className="flex items-center gap-2">
                        <img src={product.image} alt="" className="h-9 w-7 rounded-md object-cover object-top" />
                        {product.name}
                      </span>
                    </td>
                    <td className="py-2.5">{product.sold || 0}</td>
                    <td className="py-2.5">{formatPrice((product.sold || 0) * Number(product.price || 0))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="rounded-3xl border border-white/80 bg-white/75 p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">Recent orders</h3>
            <button type="button" onClick={onOpenOrders} className="text-xs text-primary">View all</button>
          </div>
          <RecentOrders orders={shown.slice(0, 5)} onStatus={onStatus} />
        </section>
      </div>
    </div>
  )
}

function RecentOrders({ orders, onStatus }) {
  if (!orders.length) {
    return <p className="py-6 text-sm text-slate-400">No orders yet. A checkout from the shop will show up here.</p>
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead className="text-xs text-slate-400">
          <tr>
            <th className="py-2 font-medium">#</th>
            <th className="py-2 font-medium">Customer</th>
            <th className="py-2 font-medium">Product</th>
            <th className="py-2 font-medium">Amount</th>
            <th className="py-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const item = order.items?.[0]
            return (
              <tr key={order.id} className="border-t border-slate-100">
                <td className="py-2.5 text-slate-400">{order.id}</td>
                <td className="py-2.5">{order.customer}</td>
                <td className="py-2.5">
                  <span className="flex items-center gap-2">
                    {item?.image && <img src={item.image} alt="" className="h-8 w-6 rounded object-cover object-top" />}
                    {item?.name || "Saree"}
                  </span>
                </td>
                <td className="py-2.5">{formatPrice(order.amount)}</td>
                <td className="py-2.5">
                  <select
                    value={order.status}
                    onChange={(event) => onStatus(order.id, event.target.value)}
                    className={`rounded-full px-2 py-1 text-[11px] outline-none ${statusTone[order.status] || "bg-slate-100"}`}
                  >
                    {["Pending", "Processing", "Shipped", "Out for delivery", "Delivered", "Cancelled"].map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
function SalesChart({ days }) {
  const max = Math.max(...days.map((day) => day.amount), 1)
  const coords = days.map((day, index) => {
    const x = 24 + (index * 280) / Math.max(days.length - 1, 1)
    const y = 78 - (day.amount / max) * 58
    return [x, y]
  })
  const line = coords.map((point) => point.join(",")).join(" ")
  const area = `${coords[0][0]},88 ${line} ${coords[coords.length - 1][0]},88`
  const peak = coords.reduce((best, point, index) => (point[1] < best.y ? { y: point[1], index, x: point[0] } : best), { y: 999, index: 0, x: 0 })
  return (
    <svg viewBox="0 0 320 110" className="mt-2 h-44 w-full">
      <defs>
        <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c59b27" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#c59b27" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((row) => (
        <line key={row} x1="16" x2="310" y1={16 + row * 20} y2={16 + row * 20} stroke="#e2e8f0" />
      ))}
      <polygon points={area} fill="url(#revenue-fill)" />
      <polyline points={line} fill="none" stroke="#4a0e17" strokeWidth="2.5" />
      <text x={peak.x} y={Math.max(12, peak.y - 8)} fontSize="9" textAnchor="middle" fill="#334155">{formatPrice(days[peak.index].amount)}</text>
      {days.map((day, index) => (
        <text key={day.label} x={coords[index][0]} y="104" fontSize="9" textAnchor="middle" fill="#94a3b8">{day.label.replace(/^[A-Za-z]+ /, "")}</text>
      ))}
    </svg>
  )
}

function PieChart({ total, parts }) {
  let angle = -90
  const slices = parts.filter((part) => part.count > 0).map((part) => {
    const sweep = (part.count / total) * 360
    const start = angle
    angle += sweep
    const end = angle
    const startRadians = (start * Math.PI) / 180
    const endRadians = (end * Math.PI) / 180
    const largeArc = sweep > 180 ? 1 : 0
    const startPoint = [50 + 44 * Math.cos(startRadians), 50 + 44 * Math.sin(startRadians)]
    const endPoint = [50 + 44 * Math.cos(endRadians), 50 + 44 * Math.sin(endRadians)]
    const labelRadians = ((start + sweep / 2) * Math.PI) / 180
    const labelPoint = [50 + 28 * Math.cos(labelRadians), 50 + 28 * Math.sin(labelRadians)]
    const path = sweep >= 359.99
      ? "M 50 6 A 44 44 0 1 1 50 94 A 44 44 0 1 1 50 6 Z"
      : `M 50 50 L ${startPoint[0]} ${startPoint[1]} A 44 44 0 ${largeArc} 1 ${endPoint[0]} ${endPoint[1]} Z`

    return {
      ...part,
      percent: Math.round((part.count / total) * 100),
      labelPoint,
      path,
    }
  })

  return (
    <div className="flex h-44 w-44 shrink-0 items-center justify-center">
      <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label={`Order status pie chart, ${total} orders`}>
        {total ? slices.map((slice) => (
          <g key={slice.label}>
            <path d={slice.path} fill={slice.color} stroke="white" strokeWidth="0.6" />
            {slice.percent >= 8 && (
              <text
                x={slice.labelPoint[0]}
                y={slice.labelPoint[1]}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="5"
                fontWeight="600"
              >
                {slice.percent}%
              </text>
            )}
          </g>
        )) : (
          <circle cx="50" cy="50" r="44" fill="#e7e5e4" />
        )}
      </svg>
    </div>
  )
}

function BarChart({ items }) {
  const maxValue = Math.max(...items.map(([, value]) => value), 1)
  const step = Math.max(1, Math.ceil(maxValue / 5))
  const axisMax = step * 5
  const plot = { left: 28, top: 12, width: 280, height: 150 }
  const barWidth = 38
  const slotWidth = plot.width / items.length

  return (
    <svg
      viewBox="0 0 320 205"
      className="mt-4 h-52 w-full"
      role="img"
      aria-label={`Bar chart: ${items.map(([label, value]) => `${label} ${value}`).join(", ")}`}
    >
      {Array.from({ length: 6 }, (_, index) => {
        const value = axisMax - index * step
        const y = plot.top + (index / 5) * plot.height
        return (
          <g key={value}>
            <line x1={plot.left} x2={plot.left + plot.width} y1={y} y2={y} stroke="#e5e7eb" strokeWidth="1" />
            <text x="21" y={y + 3} textAnchor="end" fill="#64748b" fontSize="9">{value}</text>
          </g>
        )
      })}
      {items.map(([label, value, color], index) => {
        const height = (value / axisMax) * plot.height
        const x = plot.left + slotWidth * index + (slotWidth - barWidth) / 2
        const y = plot.top + plot.height - height
        const [firstWord, ...rest] = label.split(" ")
        return (
          <g key={label}>
            <rect x={x} y={y} width={barWidth} height={height} fill={color} />
            <text x={x + barWidth / 2} y={plot.top + plot.height + 16} textAnchor="middle" fill="#334155" fontSize="9">
              <tspan x={x + barWidth / 2} dy="0">{firstWord}</tspan>
              {rest.length > 0 && <tspan x={x + barWidth / 2} dy="11">{rest.join(" ")}</tspan>}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function OrdersTable({ orders, onStatus }) {
  const [openId, setOpenId] = useState(null)
  if (!orders.length) {
    return <p className="py-6 text-sm text-ink/50">No orders yet. Place one from checkout and it will show here.</p>
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="text-[11px] tracking-wide text-ink/40 uppercase">
          <tr>
            <th className="py-2 font-medium">#</th>
            <th className="py-2 font-medium">Customer</th>
            <th className="py-2 font-medium">Date</th>
            <th className="py-2 font-medium">Amount</th>
            <th className="py-2 font-medium">Status</th>
            <th className="py-2 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <Fragment key={order.id}>
              <tr className="border-t border-black/5">
                <td className="py-3">{order.id}</td>
                <td className="py-3">{order.customer}</td>
                <td className="py-3">{order.date}</td>
                <td className="py-3">{formatPrice(order.amount)}</td>
                <td className="py-3">
                  <select
                    value={order.status}
                    onChange={(event) => onStatus(order.id, event.target.value)}
                    className={`rounded-full px-2 py-1 text-[11px] outline-none ${statusTone[order.status] || "bg-stone-100"}`}
                  >
                    {["Pending", "Processing", "Shipped", "Out for delivery", "Delivered", "Cancelled"].map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </td>
                <td className="py-3">
                  <button type="button" onClick={() => setOpenId(openId === order.id ? null : order.id)} className="text-xs text-ink/50">
                    {openId === order.id ? "Hide" : "View"}
                  </button>
                </td>
              </tr>
              {openId === order.id && (
                <tr className="border-t border-black/5 bg-[#fbf8f4]">
                  <td colSpan={6} className="px-2 py-3 text-xs leading-5 text-ink/70">
                    {order.phone} · {order.address}, {order.city} {order.state} {order.pincode}
                    {order.payment ? ` · ${order.payment}` : ""}
                    <br />
                    {(order.items || []).map((item) => `${item.name} × ${item.qty}`).join(", ")}
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ContactMessagesPanel({ messages, loading, onStatus }) {
  const newCount = messages.filter((message) => message.status === "New").length

  return (
    <section className="rounded-3xl border border-white/80 bg-white/75 p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">Contact messages</h3>
          <p className="mt-1 text-sm text-slate-500">
            {newCount} new {newCount === 1 ? "message" : "messages"}
          </p>
        </div>
      </div>
      {loading ? (
        <p className="py-6 text-sm text-ink/50">Loading contact messages…</p>
      ) : messages.length === 0 ? (
        <p className="py-6 text-sm text-ink/50">No contact messages found.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {messages.map((message) => (
            <li key={message.id} className="rounded-2xl border border-black/5 bg-white/80 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h4 className="font-medium text-primary">{message.name}</h4>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatContactTimestamp(message.created_at)}
                  </p>
                </div>
                <select
                  aria-label={`Status for message from ${message.name}`}
                  value={message.status}
                  onChange={(event) => onStatus(message.id, event.target.value)}
                  className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs text-primary outline-none focus:border-secondary"
                >
                  {["New", "Contacted", "Closed"].map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                <a className="text-primary underline-offset-2 hover:underline" href={`tel:${message.mobile}`}>
                  {message.mobile}
                </a>
                <a className="break-all text-primary underline-offset-2 hover:underline" href={`mailto:${message.email}`}>
                  {message.email}
                </a>
              </div>
              <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-ink/75">
                {message.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function formatContactTimestamp(timestamp) {
  const [date, time = ""] = String(timestamp || "").split("T")
  return date ? `${date} ${time.slice(0, 5)} UTC` : "Date unavailable"
}

function Customers({ orders }) {
  const people = []
  const seen = new Set()
  for (const order of orders) {
    const key = customerIdentity(order)
    if (seen.has(key)) continue
    seen.add(key)
    people.push(order)
  }
  return (
    <section className="rounded-3xl border border-white/80 bg-white/75 p-5 shadow-sm">
      <h3 className="text-lg font-semibold">Customers</h3>
      {!people.length && <p className="mt-4 text-sm text-ink/50">Customers appear here after an order is placed.</p>}
      <ul className="mt-4 divide-y divide-black/5">
        {people.map((order) => (
          <li key={customerIdentity(order)} className="flex items-center justify-between py-3 text-sm">
            <span>{order.customer}</span>
            <span className="text-right text-ink/45">{order.email || order.phone}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function AnalyticsPanel({ orders }) {
  const liveOrders = orders.filter((order) => order.status !== "Cancelled")
  const revenue = liveOrders.reduce((sum, order) => sum + Number(order.amount || 0), 0)
  const customers = uniqueCustomerCount(orders)
  const delivered = liveOrders.filter((order) => order.status === "Delivered").length
  const average = liveOrders.length ? Math.round(revenue / liveOrders.length) : 0
  const salesDays = lastSevenDays(orders, new Date())
  const bestSellers = topSelling(orders)
  const cards = [
    ["Net sales", formatPrice(revenue)],
    ["Orders", String(orders.length)],
    ["Average order value", formatPrice(average)],
    ["Customers", String(customers)],
  ]

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">Store performance across all saved orders. Cancelled orders are excluded from sales.</p>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value]) => (
          <li key={label} className="rounded-3xl border border-white/80 bg-white/75 p-4 shadow-sm">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-primary">{value}</p>
          </li>
        ))}
      </ul>
      <div className="grid gap-3 xl:grid-cols-2">
        <section className="rounded-3xl border border-white/80 bg-white/75 p-5 shadow-sm">
          <h3 className="font-semibold">Sales · last 7 days</h3>
          <p className="mt-1 text-xs text-slate-400">Based on order totals; cancelled orders excluded.</p>
          <SalesChart days={salesDays} />
        </section>
        <section className="rounded-3xl border border-white/80 bg-white/75 p-5 shadow-sm">
          <h3 className="font-semibold">Order fulfilment</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><dt>Delivered</dt><dd>{delivered}</dd></div>
            <div className="flex justify-between"><dt>In progress</dt><dd>{liveOrders.length - delivered}</dd></div>
            <div className="flex justify-between"><dt>Cancelled</dt><dd>{orders.length - liveOrders.length}</dd></div>
          </dl>
          <h4 className="mt-6 font-medium">Top selling products</h4>
          {bestSellers.length ? (
            <ol className="mt-2 space-y-2 text-sm">
              {bestSellers.slice(0, 5).map((product, index) => (
                <li key={product.id || product.name} className="flex justify-between gap-3">
                  <span>{index + 1}. {product.name}</span>
                  <span className="text-slate-500">{product.sold} sold</span>
                </li>
              ))}
            </ol>
          ) : <p className="mt-2 text-sm text-slate-400">No completed sales yet.</p>}
        </section>
      </div>
    </div>
  )
}

function lastSevenDays(orders, endDate) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = endDate ? new Date(endDate) : new Date()
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() - (6 - index))
    const amount = orders
      .filter((order) => order.status !== "Cancelled" && new Date(order.createdAt).toDateString() === date.toDateString())
      .reduce((sum, order) => sum + Number(order.amount || 0), 0)
    return {
      label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      amount,
    }
  })
}

function topSelling(orders) {
  const sold = new Map()
  for (const order of orders) {
    if (order.status === "Cancelled") continue
    for (const item of order.items || []) {
      const current = sold.get(item.id) || { ...item, sold: 0 }
      current.sold += item.qty
      sold.set(item.id, current)
    }
  }
  const ranked = [...sold.values()].sort((a, b) => b.sold - a.sold)
  return ranked.slice(0, 5)
}

function SimplePanel({ title, text }) {
  return (
    <section className="rounded-3xl border border-white/80 bg-white/75 p-6 shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-3 max-w-xl text-sm leading-6 text-ink/65">{text}</p>
    </section>
  )
}

function CouponsPanel() {
  const emptyCoupon = { code: "", discount_type: "percent", discount_value: 10, minimum_order: 0, is_active: true }
  const [coupons, setCoupons] = useState([])
  const [form, setForm] = useState(emptyCoupon)
  const [editingCode, setEditingCode] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true
    async function loadCoupons() {
      if (!supabase) {
        setError("Connect Supabase to manage discount codes.")
        setLoading(false)
        return
      }
      try {
        const { data, error: loadError } = await supabase.from("coupons").select("*").order("created_at", { ascending: false })
        if (loadError) throw loadError
        if (active) setCoupons(data || [])
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : "Unable to load discounts.")
      } finally {
        if (active) setLoading(false)
      }
    }
    loadCoupons()
    return () => {
      active = false
    }
  }, [])

  async function saveCoupon(event) {
    event.preventDefault()
    if (!supabase) {
      setError("Connect Supabase to save discount codes.")
      return
    }
    const code = form.code.trim().toUpperCase()
    const value = Number(form.discount_value)
    const minimum = Number(form.minimum_order)
    if (!/^[A-Z0-9_-]{3,30}$/.test(code) || !Number.isFinite(value) || value <= 0 ||
      (form.discount_type === "percent" && value > 100) || !Number.isFinite(minimum) || minimum < 0) {
      setError("Enter a valid code, discount, and minimum order amount.")
      return
    }

    setSaving(true)
    setError("")
    const payload = {
      code,
      discount_type: form.discount_type,
      discount_value: value,
      minimum_order: Math.round(minimum),
      is_active: Boolean(form.is_active),
    }
    try {
      const result = editingCode
        ? await supabase.from("coupons").update(payload).eq("code", editingCode)
        : await supabase.from("coupons").insert(payload)
      if (result.error) {
        setError(result.error.message)
        return
      }
      setCoupons((current) => editingCode
        ? current.map((coupon) => coupon.code === editingCode ? { ...coupon, ...payload } : coupon)
        : [{ ...payload }, ...current])
      setForm(emptyCoupon)
      setEditingCode("")
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save this discount.")
    } finally {
      setSaving(false)
    }
  }

  function editCoupon(coupon) {
    setEditingCode(coupon.code)
    setForm({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: Number(coupon.discount_value),
      minimum_order: Number(coupon.minimum_order || 0),
      is_active: coupon.is_active,
    })
    setError("")
  }

  async function deleteCoupon(code) {
    if (!supabase || !window.confirm(`Delete the ${code} discount?`)) return
    setError("")
    try {
      const { error: deleteError } = await supabase.from("coupons").delete().eq("code", code)
      if (deleteError) {
        setError(deleteError.message)
        return
      }
      setCoupons((current) => current.filter((coupon) => coupon.code !== code))
      if (editingCode === code) {
        setEditingCode("")
        setForm(emptyCoupon)
      }
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete this discount.")
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <section className="rounded-3xl border border-white/80 bg-white/75 p-5 shadow-sm">
        <h3 className="text-lg font-semibold">Discount codes</h3>
        <p className="mt-1 text-sm text-slate-500">Active codes can be applied by customers at checkout.</p>
        {loading ? <p className="mt-5 text-sm text-slate-500">Loading discounts…</p> : coupons.length ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="text-xs text-slate-400">
                <tr><th className="py-2">Code</th><th>Offer</th><th>Minimum</th><th>Status</th><th /></tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.code} className="border-t border-slate-100">
                    <td className="py-3 font-semibold">{coupon.code}</td>
                    <td>{coupon.discount_type === "percent" ? `${coupon.discount_value}% off` : `${formatPrice(coupon.discount_value)} off`}</td>
                    <td>{formatPrice(coupon.minimum_order || 0)}</td>
                    <td>{coupon.is_active ? "Active" : "Inactive"}</td>
                    <td className="space-x-3 text-right">
                      <button type="button" onClick={() => editCoupon(coupon)} className="text-primary underline">Edit</button>
                      <button type="button" onClick={() => deleteCoupon(coupon.code)} className="text-red-700 underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : !error && <p className="mt-5 text-sm text-slate-500">No discounts created yet.</p>}
      </section>
      <form onSubmit={saveCoupon} className="h-fit space-y-3 rounded-3xl border border-white/80 bg-white/75 p-5 shadow-sm">
        <h3 className="text-lg font-semibold">{editingCode ? "Edit discount" : "Create discount"}</h3>
        <label className="block text-xs text-slate-500">Code
          <input required minLength={3} maxLength={30} value={form.code} onChange={(event) => setForm((current) => ({ ...current, code: event.target.value.toUpperCase() }))} className="mt-1 w-full rounded border border-black/10 px-3 py-2 text-sm text-ink outline-none" placeholder="KARNAN10" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs text-slate-500">Discount type
            <select value={form.discount_type} onChange={(event) => setForm((current) => ({ ...current, discount_type: event.target.value }))} className="mt-1 w-full rounded border border-black/10 bg-white px-3 py-2 text-sm text-ink">
              <option value="percent">Percent</option>
              <option value="fixed">Fixed amount</option>
            </select>
          </label>
          <label className="block text-xs text-slate-500">{form.discount_type === "percent" ? "Percent off" : "Amount off"}
            <input required type="number" min="0.01" max={form.discount_type === "percent" ? 100 : undefined} step="0.01" value={form.discount_value} onChange={(event) => setForm((current) => ({ ...current, discount_value: event.target.value }))} className="mt-1 w-full rounded border border-black/10 px-3 py-2 text-sm text-ink" />
          </label>
        </div>
        <label className="block text-xs text-slate-500">Minimum order (₹)
          <input type="number" min="0" step="1" value={form.minimum_order} onChange={(event) => setForm((current) => ({ ...current, minimum_order: event.target.value }))} className="mt-1 w-full rounded border border-black/10 px-3 py-2 text-sm text-ink" />
        </label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_active} onChange={(event) => setForm((current) => ({ ...current, is_active: event.target.checked }))} />Active at checkout</label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={saving} className="w-full rounded bg-primary py-2.5 text-sm text-cream disabled:opacity-60">{saving ? "Saving…" : editingCode ? "Update discount" : "Create discount"}</button>
        {editingCode && <button type="button" onClick={() => { setEditingCode(""); setForm(emptyCoupon) }} className="w-full border border-black/10 py-2 text-sm">Cancel</button>}
      </form>
    </div>
  )
}

function ProductsPanel({
  rows, loading, form, setForm, editingId, saving, fromDatabase,
  onRefresh, onEdit, onDelete, onSave, onCancel,
}) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")

  async function choosePhoto(event) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    setUploading(true)
    setUploadError("")
    try {
      const url = await uploadProductImage(file)
      setForm((current) => ({ ...current, image: url }))
    } catch (error) {
      setUploadError(error.message || "The photo could not be uploaded.")
    }
    setUploading(false)
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
      <section className="rounded-3xl border border-white/80 bg-white/75 p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Products</h3>
          <button type="button" onClick={onRefresh} className="text-xs underline">Refresh</button>
        </div>
        <p className="mb-3 text-xs text-ink/45">{fromDatabase ? "Saved in Supabase" : "Local catalogue"}</p>
        {loading ? <p className="text-sm text-ink/50">Loading…</p> : (
          <ul className="space-y-3">
            {rows.map((product) => (
              <li key={product.id} className="flex flex-wrap items-center gap-3 border-b border-black/5 pb-3">
                <img src={product.image} alt="" className="h-14 w-11 rounded object-cover object-top" />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-xl">{product.name}</p>
                  <p className="text-xs text-ink/45">{formatPrice(product.price)}</p>
                </div>
                <button type="button" onClick={() => onEdit(product)} className="text-xs uppercase">Edit</button>
                <button type="button" onClick={() => onDelete(product.id)} className="text-xs text-red-700 uppercase">Delete</button>
              </li>
            ))}
          </ul>
        )}
      </section>
      <aside className="h-fit rounded-3xl border border-white/80 bg-white/75 p-5 shadow-sm">
        <h3 className="text-lg font-semibold">{editingId ? "Edit saree" : "Add saree"}</h3>
        <form onSubmit={onSave} className="mt-4 space-y-3">
          <label className="block text-[10px] tracking-wide text-ink/45 uppercase">
            Photo
            <input type="file" accept="image/*" onChange={choosePhoto} className="mt-1 block w-full text-sm" />
          </label>
          {uploading && <p className="text-xs text-ink/50">Uploading photo…</p>}
          {uploadError && <p className="text-xs text-red-700">{uploadError}</p>}
          {form.image && <img src={form.image} alt="" className="h-28 w-20 rounded object-cover object-top" />}
          {[["name", "Name", "text"], ["price", "Price", "number"], ["badge", "Badge", "text"], ["category", "Category", "text"], ["color", "Colour", "text"], ["fabric", "Fabric", "text"], ["length", "Length", "text"], ["line", "Short line", "text"]].map(([key, label, type]) => (
            <label key={key} className="block text-[10px] tracking-wide text-ink/45 uppercase">
              {label}
              <input
                type={type}
                required={key === "name" || key === "price"}
                value={form[key]}
                onChange={(event) => setForm((current) => ({
                  ...current,
                  [key]: type === "number" ? Number(event.target.value) : event.target.value,
                }))}
                className="mt-1 w-full rounded border border-black/10 px-2.5 py-2 text-sm normal-case outline-none"
              />
            </label>
          ))}
          <label className="block text-[10px] tracking-wide text-ink/45 uppercase">
            Description
            <textarea
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              rows={4}
              className="mt-1 w-full rounded border border-black/10 px-2.5 py-2 text-sm normal-case outline-none"
            />
          </label>
          <label className="flex items-center gap-2 text-sm normal-case text-ink">
            <input type="checkbox" checked={form.featured} onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))} />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm normal-case text-ink">
            <input type="checkbox" checked={form.active} onChange={(event) => setForm((current) => ({ ...current, active: event.target.checked }))} />
            Show in the shop
          </label>
          <button type="submit" disabled={saving} className="w-full bg-[#102117] py-2.5 text-xs tracking-wide text-[#f6efe4] uppercase">
            {saving ? "Saving…" : editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button type="button" onClick={onCancel} className="w-full border border-black/10 py-2 text-xs uppercase">Cancel</button>
          )}
        </form>
      </aside>
    </div>
  )
}
