import { Fragment, useEffect, useMemo, useRef, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import logo from "../../assets/images/kpc-logo.avif"
import { clearUser, readUser } from "../Login"
import { formatPrice } from "../../data/products"
import {
  createProduct,
  deleteProduct as deleteProductRow,
  setProductActive,
  updateProduct,
  validateProductForm,
} from "../../lib/adminProducts"
import { mapDbProduct, productImageSrc } from "../../lib/productMap"
import { uploadProductImage } from "../../lib/uploadProductImage"
import { loadOrders, readOrders, updateOrderStatus } from "../../lib/orders"
import {
  loadContactMessages,
  updateContactMessageStatus,
} from "../../lib/contactMessages"
import { supabase, supabaseConfigured } from "../../lib/supabase"
import { PRODUCTS_UPDATED_EVENT, useProducts } from "../../context/ProductsContext"
import {
  DASHBOARD,
  FUNNEL_BAR_COLORS,
  METRIC_CARD_TINTS,
  ORDER_STATUS_THEME,
  buildOrderStatusRows,
  MESSAGE_STATUS_THEME,
  orderStatusPillClass,
} from "../../lib/dashboardTheme"

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
  image: "",
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

const statusTone = Object.fromEntries(
  Object.entries(ORDER_STATUS_THEME).map(([label, theme]) => [label, theme.pill]),
)

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

const tabMeta = {
  overview: { title: "Dashboard", subtitle: "Store overview and quick actions" },
  orders: { title: "Orders", subtitle: "Track and update customer orders" },
  messages: { title: "Messages", subtitle: "Contact form enquiries" },
  products: { title: "Products", subtitle: "Add, edit, and hide sarees in the shop" },
  customers: { title: "Customers", subtitle: "Buyers from saved orders" },
  analytics: { title: "Analytics", subtitle: "Sales trends and performance" },
  coupons: { title: "Discounts", subtitle: "Checkout coupon codes" },
  settings: { title: "Settings", subtitle: "Connection and store tools" },
  help: { title: "Help", subtitle: "Support contacts" },
}

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
  const { products: storeProducts, refreshProducts } = useProducts()
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
  const [productNotice, setProductNotice] = useState("")
  const [scrollToProductForm, setScrollToProductForm] = useState(false)
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
    if (!authed) return undefined
    loadContactMessages()
      .then(setContactMessages)
      .catch(() => {})
    return undefined
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

  const visibleProductCount = useMemo(() => rows.filter((product) => product.active !== false).length, [rows])
  const hiddenProductCount = rows.length - visibleProductCount
  const newMessageCount = useMemo(
    () => contactMessages.filter((message) => message.status === "New").length,
    [contactMessages],
  )
  const page = tabMeta[tab] || tabMeta.overview

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
      setRows([])
    } else {
      setRows((data || []).map(mapDbProduct))
    }
    setLoading(false)
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut()
    clearUser()
    navigate("/admin/login", { replace: true })
  }

  function startEdit(product) {
    setProductNotice("")
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
    setProductNotice("")
  }

  function startAddProduct() {
    setError("")
    resetForm()
    setScrollToProductForm(true)
    setTab("products")
  }

  useEffect(() => {
    if (tab !== "products" || !scrollToProductForm) return undefined
    setScrollToProductForm(false)
    const frame = window.requestAnimationFrame(() => {
      document.getElementById("admin-product-form")?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [tab, scrollToProductForm])

  async function saveProduct(event) {
    event.preventDefault()
    if (!supabaseConfigured || !supabase) {
      setError("Connect Supabase in .env to save products to the database.")
      return
    }
    const validationError = validateProductForm(form)
    if (validationError) {
      setError(validationError)
      return
    }
    setSaving(true)
    setError("")
    setProductNotice("")
    try {
      if (editingId) {
        await updateProduct(editingId, form)
        setProductNotice("Product updated.")
      } else {
        await createProduct(form)
        setProductNotice("Product added.")
      }
      resetForm()
      await loadRows()
      await refreshProducts()
      window.dispatchEvent(new Event(PRODUCTS_UPDATED_EVENT))
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save this product.")
    } finally {
      setSaving(false)
    }
  }

  async function removeProduct(id) {
    if (!window.confirm("Delete this saree from the database? This cannot be undone.")) return
    if (!supabaseConfigured || !supabase) {
      setError("Connect Supabase in .env to delete products from the database.")
      return
    }
    setError("")
    setProductNotice("")
    try {
      await deleteProductRow(id)
      if (editingId === id) resetForm()
      setProductNotice("Product deleted.")
      await loadRows()
      await refreshProducts()
      window.dispatchEvent(new Event(PRODUCTS_UPDATED_EVENT))
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete this product.")
    }
  }

  async function toggleProductActive(product) {
    if (!supabaseConfigured || !supabase) return
    setError("")
    try {
      await setProductActive(product.id, !product.active)
      await loadRows()
      await refreshProducts()
      window.dispatchEvent(new Event(PRODUCTS_UPDATED_EVENT))
      if (editingId === product.id) {
        setForm((current) => ({ ...current, active: !product.active }))
      }
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : "Unable to update visibility.")
    }
  }

  if (!ready) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f6f1ea] text-sm text-ink/60">Loading dashboard…</div>
  }
  if (!authed) return <Navigate to="/admin/login" replace />

  return (
    <div className="admin-dashboard flex h-dvh flex-col overflow-hidden bg-[radial-gradient(circle_at_top_left,#f3e8dc,transparent_42%),radial-gradient(circle_at_bottom_right,#e7d5c4,transparent_40%),linear-gradient(160deg,#f7f1e8,#f3e8dc_48%,#f6efe4)] text-ink lg:flex-row">
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
              {id === "products" && rows.length > 0 && (
                <span className="ml-3 rounded-full bg-secondary/25 px-2 py-0.5 text-[11px] text-primary">
                  {rows.length}
                </span>
              )}
              {id === "messages" && newMessageCount > 0 && (
                <span className="ml-3 rounded-full bg-secondary/25 px-2 py-0.5 text-[11px] text-primary">
                  {newMessageCount}
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
        <header className="flex flex-wrap items-center gap-3 border-b border-white/50 px-4 py-4 sm:px-6">
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl text-primary">{page.title}</h1>
            <p className="mt-0.5 text-xs text-slate-500">{page.subtitle}</p>
          </div>
          <label className="flex min-w-[200px] flex-1 items-center gap-2 rounded-2xl border border-white/80 bg-white/70 px-4 py-2.5 shadow-sm lg:max-w-xs">
            <span className="text-slate-400" aria-hidden="true">⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products, orders, messages..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>
          <button
            type="button"
            onClick={startAddProduct}
            className="hidden rounded-full bg-primary px-4 py-2 text-xs font-semibold tracking-wide text-cream uppercase sm:inline-flex"
          >
            + Add product
          </button>
          <div className="flex items-center gap-2">
            <span
              className={`hidden rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide sm:inline ${
                supabaseConfigured ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"
              }`}
            >
              {supabaseConfigured ? "Online" : "Local only"}
            </span>
            <div className="flex items-center gap-2 rounded-2xl border border-white/80 bg-white/70 py-1 pr-3 pl-1 shadow-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-xs text-white">
              {displayName.slice(0, 1)}
            </span>
            <span>
              <span className="block max-w-[140px] truncate text-xs leading-none font-medium">{displayName}</span>
              <span className="text-[10px] text-slate-400">Store admin</span>
            </span>
          </div>
          </div>
        </header>

        <div className="px-4 pb-8 sm:px-6">
          {error && <p className="mb-4 rounded-2xl bg-white/80 px-4 py-3 text-sm text-red-700">{error}</p>}
          {tab === "overview" && (
            <Overview
              name={/^karnan/i.test(displayName) ? "Karnan" : displayName.split(" ")[0]}
              productCount={rows.length}
              visibleProductCount={visibleProductCount}
              hiddenProductCount={hiddenProductCount}
              newMessageCount={newMessageCount}
              supabaseReady={supabaseConfigured}
              orders={orders}
              onOpenProducts={() => setTab("products")}
              onOpenOrders={() => setTab("orders")}
              onOpenMessages={() => setTab("messages")}
              onAddProduct={startAddProduct}
              onStatus={changeStatus}
            />
          )}
          {tab === "products" && (
            <ProductsPanel
              rows={filteredRows}
              loading={loading}
              totalCount={rows.length}
              visibleCount={visibleProductCount}
              hiddenCount={hiddenProductCount}
              form={form}
              setForm={setForm}
              editingId={editingId}
              saving={saving}
              notice={productNotice}
              supabaseReady={supabaseConfigured}
              onRefresh={loadRows}
              onAdd={startAddProduct}
              onEdit={startEdit}
              onDelete={removeProduct}
              onToggleActive={toggleProductActive}
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
            <SettingsPanel
              supabaseReady={supabaseConfigured}
              productCount={rows.length}
              visibleCount={visibleProductCount}
              onRefreshProducts={async () => {
                await loadRows()
                await refreshProducts()
              }}
              onOpenProducts={() => setTab("products")}
            />
          )}
          {tab === "help" && (
            <SimplePanel
              title="Help"
              text="Call +91 72000 15300 or +91 99440 55900, or email karnanpattucenter@gmail.com. Orders placed in this browser appear on the dashboard right away."
            />
          )}
        </div>
      </div>
    </div>
  )
}
function monthDelta(current, previous, phrase = "previous month") {
  if (current === 0 && previous === 0) return { text: `No activity vs ${phrase}`, up: true }
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
  const fallback = Number.isNaN(created.getTime()) ? new Date(order.date) : created
  if (Number.isNaN(fallback.getTime())) return false
  return fallback >= bounds.start && fallback <= bounds.end
}

function formatRangeDate(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function Overview({
  name,
  productCount,
  visibleProductCount,
  hiddenProductCount,
  newMessageCount,
  supabaseReady,
  orders,
  onOpenProducts,
  onOpenOrders,
  onOpenMessages,
  onAddProduct,
  onStatus,
}) {
  const [range, setRange] = useState("all")
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
  const statusRowsAll = buildOrderStatusRows((label) => orders.filter((order) => order.status === label).length)
  const catalogueRows = [
    { label: "In shop", count: visibleProductCount, color: DASHBOARD.primary },
    { label: "Hidden", count: hiddenProductCount, color: DASHBOARD.catalogueHidden },
  ]
  const chartUsesCatalogue = orders.length === 0 && productCount > 0
  const donutTotal = chartUsesCatalogue ? productCount : orders.length
  const donutParts = chartUsesCatalogue ? catalogueRows : statusRowsAll
  const legendRows = chartUsesCatalogue ? catalogueRows : statusRowsAll
  const payments = [
    ["Cash on delivery", live.filter((order) => /cash/i.test(order.payment || "Cash on delivery")).length, DASHBOARD.primary],
    ["Pay online", live.filter((order) => /online/i.test(order.payment || "")).length, DASHBOARD.secondary],
  ]
  const delivered = statusRowsAll.find((row) => row.label === "Delivered").count
  const funnel = [
    ["Sarees listed", productCount, FUNNEL_BAR_COLORS[0]],
    ["Orders placed", orders.length, FUNNEL_BAR_COLORS[1]],
    ["Customers", uniqueCustomerCount(orders), FUNNEL_BAR_COLORS[2]],
    ["Delivered", delivered, FUNNEL_BAR_COLORS[3]],
  ]
  const cards = [
    ["Total revenue", formatPrice(revenue), range === "all" ? { text: "All saved orders", up: true } : monthDelta(revenue, prevRevenue, compareLabel), METRIC_CARD_TINTS[0]],
    ["Total orders", String(shown.length), range === "all" ? { text: "All saved orders", up: true } : monthDelta(live.length, previous.length, compareLabel), METRIC_CARD_TINTS[1]],
    ["New customers", String(customers), range === "all" ? { text: "All saved orders", up: true } : monthDelta(customers, prevCustomers, compareLabel), METRIC_CARD_TINTS[2]],
    ["Average order value", formatPrice(average), range === "all" ? { text: "All saved orders", up: true } : monthDelta(average, prevAverage, compareLabel), METRIC_CARD_TINTS[3]],
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">Welcome back, {name}</p>
          <p className="text-sm text-slate-500">Here&apos;s what&apos;s happening with your saree store today.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onAddProduct?.()}
            className="rounded-full bg-primary px-4 py-2 text-xs font-semibold tracking-wide text-cream uppercase"
          >
            + Add product
          </button>
          <Link
            to="/shop"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-primary/20 bg-white/80 px-4 py-2 text-xs font-semibold tracking-wide text-primary uppercase"
          >
            View shop
          </Link>
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
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["In shop", String(visibleProductCount), "Visible on website", onOpenProducts],
          ["Hidden", String(hiddenProductCount), "Not shown in shop", onOpenProducts],
          ["New messages", String(newMessageCount), "Contact form", onOpenMessages],
          ["Catalogue", supabaseReady ? "Live" : "Offline", supabaseReady ? "Supabase connected" : "Add .env keys", onOpenProducts],
        ].map(([label, value, hint, onClick]) => (
          <li key={label}>
            <button
              type="button"
              onClick={onClick}
              className="w-full rounded-2xl border border-white/80 bg-white/60 px-3 py-3 text-left shadow-sm transition hover:bg-white/90"
            >
              <p className="text-[10px] tracking-wide text-slate-400 uppercase">{label}</p>
              <p className="mt-1 text-lg font-semibold text-primary">{value}</p>
              <p className="text-[11px] text-slate-400">{hint}</p>
            </button>
          </li>
        ))}
      </ul>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, change, tint]) => (
          <li key={label} className={`rounded-3xl border p-4 shadow-sm ${tint}`}>
            <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-2xl bg-white/80 text-sm shadow-sm">
              ₹
            </span>
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
          <SalesChart days={week} emptyHint={weekTotal === 0 ? "No revenue yet — orders will plot here." : ""} />
        </section>
        <section className="rounded-3xl border border-white/80 bg-white/75 p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">{chartUsesCatalogue ? "Catalogue mix" : "Order status mix"}</h3>
            <button type="button" onClick={chartUsesCatalogue ? onOpenProducts : onOpenOrders} className="text-xs text-primary">
              {chartUsesCatalogue ? "Manage products" : "View all"}
            </button>
          </div>
          <p className="mb-2 text-xs text-slate-400">
            {chartUsesCatalogue
              ? "No orders yet — showing in-shop vs hidden products."
              : `${orders.length} order${orders.length === 1 ? "" : "s"} total${
                  shown.length !== orders.length
                    ? ` · ${shown.length} in selected date range`
                    : ""
                }`}
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-4 sm:justify-between">
            <RadialRingChart
              total={donutTotal}
              parts={donutParts}
              centerValue={donutTotal}
              centerLabel={chartUsesCatalogue ? "Products" : "Orders"}
            />
            <ul className="min-w-[180px] flex-1 space-y-2 text-sm">
              {legendRows.map((row) => (
                <li key={row.label} className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: row.color }} aria-hidden />
                  <span>{row.label}</span>
                  <span className="font-medium tabular-nums">{row.count}</span>
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
              <li key={label} className="grid grid-cols-[140px_1fr_auto] items-center gap-3 text-sm">
                <span title={`${count} order${count === 1 ? "" : "s"}`}>{label}</span>
                  <div
                    className="h-2.5 rounded-full bg-slate-100"
                    title={`${label}: ${count} (${live.length ? Math.round((count / live.length) * 100) : 0}%)`}
                  >
                    <div
                      className="h-2.5 rounded-full transition-all"
                      style={{
                        width: `${live.length ? Math.max(count ? 6 : 0, Math.round((count / live.length) * 100)) : 0}%`,
                        backgroundColor: bar,
                      }}
                    />
                  </div>
                <span className="text-right tabular-nums text-slate-500" title={`${count} orders`}>
                  {count} · {live.length ? Math.round((count / live.length) * 100) : 0}%
                </span>
              </li>
            ))}
          </ul>
          {!live.length && <p className="mt-3 text-xs text-slate-400">No orders in range — payment split appears after checkout.</p>}
        </section>
        <section className="rounded-3xl border border-white/80 bg-white/75 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Order funnel</h3>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">This shop</span>
          </div>
          <BarChart items={funnel} valueSuffix={chartUsesCatalogue ? " in catalogue" : ""} />
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
          <RecentOrders orders={orders} onStatus={onStatus} />
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
            const image = productImageSrc(item)
            return (
              <tr key={order.id} className="border-t border-slate-100">
                <td className="py-2.5 text-slate-400">{order.id}</td>
                <td className="py-2.5">{order.customer}</td>
                <td className="py-2.5">
                  <span className="flex items-center gap-2">
                    {image && (
                      <img
                        src={image}
                        alt=""
                        className="h-8 w-6 rounded object-cover object-top"
                        onError={(event) => {
                          const fallback = productImageSrc({ ...item, image: "" })
                          if (fallback && fallback !== image) {
                            event.currentTarget.src = fallback
                          } else {
                            event.currentTarget.hidden = true
                          }
                        }}
                      />
                    )}
                    {item?.name || "Saree"}
                  </span>
                </td>
                <td className="py-2.5">{formatPrice(order.amount)}</td>
                <td className="py-2.5">
                  <select
                    value={order.status}
                    onChange={(event) => onStatus(order.id, event.target.value)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium outline-none ${statusTone[order.status] || orderStatusPillClass(order.status)}`}
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
function SalesChart({ days, emptyHint = "" }) {
  const max = Math.max(...days.map((day) => day.amount), 1)
  const allZero = days.every((day) => day.amount === 0)
  const coords = days.map((day, index) => {
    const x = 24 + (index * 280) / Math.max(days.length - 1, 1)
    const y = 78 - (day.amount / max) * 58
    return [x, y]
  })
  const line = coords.map((point) => point.join(",")).join(" ")
  const area = `${coords[0][0]},88 ${line} ${coords[coords.length - 1][0]},88`
  const peak = coords.reduce(
    (best, point, index) => (point[1] < best.y ? { y: point[1], index, x: point[0] } : best),
    { y: 999, index: 0, x: 0 },
  )
  return (
    <div className="relative">
      {emptyHint && allZero && <p className="mb-2 text-xs text-slate-400">{emptyHint}</p>}
      <svg viewBox="0 0 320 110" className="mt-2 h-44 w-full">
        <defs>
          <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={DASHBOARD.secondary} stopOpacity="0.45" />
          <stop offset="100%" stopColor={DASHBOARD.secondary} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((row) => (
          <line key={row} x1="16" x2="310" y1={16 + row * 20} y2={16 + row * 20} stroke={DASHBOARD.grid} />
        ))}
        {!allZero && (
          <>
            <polygon points={area} fill="url(#revenue-fill)" />
            <polyline points={line} fill="none" stroke={DASHBOARD.primary} strokeWidth="2.5" />
          </>
        )}
        {allZero && (
          <line x1="24" x2="304" y1="78" y2="78" stroke={DASHBOARD.primary} strokeWidth="2" strokeDasharray="4 4" opacity="0.35" />
        )}
        {!allZero && days[peak.index].amount > 0 && (
          <text x={peak.x} y={Math.max(12, peak.y - 8)} fontSize="9" textAnchor="middle" fill="#334155">
            {formatPrice(days[peak.index].amount)}
          </text>
        )}
        {days.map((day, index) => (
          <g key={day.label}>
            <circle cx={coords[index][0]} cy={coords[index][1]} r="4" fill={DASHBOARD.primary}>
              <title>{`${day.label}: ${formatPrice(day.amount)}`}</title>
            </circle>
            <text x={coords[index][0]} y="104" fontSize="9" textAnchor="middle" fill={DASHBOARD.inkMuted}>
              {day.label.replace(/^[A-Za-z]+ /, "")}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

function RadialRingChart({ total, parts, centerLabel, centerValue }) {
  const cx = 60
  const cy = 60
  const stroke = 6
  const trackColor = DASHBOARD.grid
  const ringStep = parts.length <= 2 ? 14 : parts.length <= 4 ? 10 : 7.2
  const outerRadius = 52
  const sorted = [...parts].sort((a, b) => b.count - a.count)

  const rings = sorted.map((part, index) => {
    const radius = outerRadius - index * ringStep
    const percent = total ? Math.round((part.count / total) * 100) : 0
    const circumference = 2 * Math.PI * radius
    const dash = (percent / 100) * circumference
    return {
      ...part,
      radius,
      percent,
      circumference,
      dash,
    }
  })

  return (
    <div className="flex h-48 w-48 shrink-0 items-center justify-center sm:h-52 sm:w-52">
      <svg viewBox="0 0 120 120" className="h-full w-full" role="img" aria-label={`${centerLabel} radial chart, ${centerValue} total`}>
        {rings.map((ring) => (
          <g key={ring.label}>
            <circle cx={cx} cy={cy} r={ring.radius} fill="none" stroke={trackColor} strokeWidth={stroke} opacity="0.85" />
            {ring.percent > 0 && (
              <circle
                cx={cx}
                cy={cy}
                r={ring.radius}
                fill="none"
                stroke={ring.color}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={`${ring.dash} ${Math.max(ring.circumference - ring.dash, 0.001)}`}
                transform={`rotate(-90 ${cx} ${cy})`}
              >
                <title>{`${ring.label}: ${ring.count}`}</title>
              </circle>
            )}
          </g>
        ))}
        {!total && (
          <circle cx={cx} cy={cy} r={outerRadius} fill="none" stroke={DASHBOARD.donutEmpty} strokeWidth={stroke} />
        )}
        <text x={cx} y={cy - 3} textAnchor="middle" dominantBaseline="middle" fill={DASHBOARD.primary} fontSize="16" fontWeight="700">
          {centerValue}
        </text>
        <text x={cx} y={cy + 11} textAnchor="middle" dominantBaseline="middle" fill={DASHBOARD.inkMuted} fontSize="7">
          {centerLabel}
        </text>
      </svg>
    </div>
  )
}

function DonutChart({ total, parts, centerLabel, centerValue }) {
  return (
    <RadialRingChart total={total} parts={parts} centerLabel={centerLabel} centerValue={centerValue} />
  )
}

function PieChart({ total, parts }) {
  return <DonutChart total={total} parts={parts} centerLabel="Orders" centerValue={total} />
}

function BarChart({ items, valueSuffix = "" }) {
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
            <line x1={plot.left} x2={plot.left + plot.width} y1={y} y2={y} stroke={DASHBOARD.grid} strokeWidth="1" />
            <text x="21" y={y + 3} textAnchor="end" fill={DASHBOARD.inkMuted} fontSize="9">
              {value}
            </text>
          </g>
        )
      })}
      {items.map(([label, value, color], index) => {
        const height = value > 0 ? Math.max((value / axisMax) * plot.height, 6) : 0
        const x = plot.left + slotWidth * index + (slotWidth - barWidth) / 2
        const y = plot.top + plot.height - height
        const [firstWord, ...rest] = label.split(" ")
        const tooltip = `${label}: ${value}${valueSuffix}`
        return (
          <g key={label}>
            <rect x={x} y={y} width={barWidth} height={height} fill={color} rx="2">
              <title>{tooltip}</title>
            </rect>
            {value > 0 && (
              <text x={x + barWidth / 2} y={y - 4} textAnchor="middle" fill={DASHBOARD.primary} fontSize="9" fontWeight="600">
                {value}
              </text>
            )}
            <text x={x + barWidth / 2} y={plot.top + plot.height + 16} textAnchor="middle" fill="#334155" fontSize="9">
              <tspan x={x + barWidth / 2} dy="0">
                {firstWord}
              </tspan>
              {rest.length > 0 && (
                <tspan x={x + barWidth / 2} dy="11">
                  {rest.join(" ")}
                </tspan>
              )}
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
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium outline-none ${statusTone[order.status] || orderStatusPillClass(order.status)}`}
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
                  className={`rounded-full px-3 py-1.5 text-xs outline-none focus:border-secondary ${MESSAGE_STATUS_THEME[message.status] || MESSAGE_STATUS_THEME.New}`}
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
                {message.email && (
                  <a className="break-all text-primary underline-offset-2 hover:underline" href={`mailto:${message.email}`}>
                    {message.email}
                  </a>
                )}
              </div>
              <p className="mt-3 text-sm text-ink/75">
                Saree type: {message.saree_type || "Not specified"} · Quantity: {message.saree_count || 1}
              </p>
              <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-ink/75">
                {message.message}
              </p>
              {message.photos?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {message.photos.map((photo, index) => (
                    <a
                      key={photo}
                      href={photo}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-secondary/30 px-3 py-2 text-xs font-medium text-primary underline-offset-2 hover:underline"
                    >
                      View saree photo {index + 1}
                    </a>
                  ))}
                </div>
              )}
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

function SettingsPanel({ supabaseReady, productCount, visibleCount, onRefreshProducts, onOpenProducts }) {
  const [refreshing, setRefreshing] = useState(false)

  async function refresh() {
    setRefreshing(true)
    try {
      await onRefreshProducts()
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-3xl border border-white/80 bg-white/75 p-6 shadow-sm">
        <h3 className="text-lg font-semibold">Store connection</h3>
        <p className="mt-2 text-sm text-slate-600">
          {supabaseReady
            ? "Supabase is connected. Products, photos, orders, and messages sync when you save from this dashboard."
            : "Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env, then restart the dev server."}
        </p>
        <p
          className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
            supabaseReady ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"
          }`}
        >
          {supabaseReady ? "Status: Online" : "Status: Local only"}
        </p>
      </section>
      <section className="rounded-3xl border border-white/80 bg-white/75 p-6 shadow-sm">
        <h3 className="text-lg font-semibold">Catalogue</h3>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          <li>
            <span className="text-slate-400">Total products:</span> {productCount}
          </li>
          <li>
            <span className="text-slate-400">Visible in shop:</span> {visibleCount}
          </li>
          <li>
            <span className="text-slate-400">Photo uploads:</span> product-images bucket (admin login required)
          </li>
        </ul>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onOpenProducts}
            className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-cream uppercase"
          >
            Manage products
          </button>
          <button
            type="button"
            onClick={refresh}
            disabled={refreshing}
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs uppercase disabled:opacity-50"
          >
            {refreshing ? "Refreshing…" : "Refresh catalogue"}
          </button>
          <Link
            to="/shop"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-primary/20 px-4 py-2 text-xs font-semibold text-primary uppercase"
          >
            Open shop
          </Link>
        </div>
      </section>
    </div>
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

const saleGroupOptions = [
  ["soft", "Soft silk"],
  ["tissue", "Tissue"],
  ["traditional", "Traditional"],
  ["party", "Party wear"],
  ["wedding", "Wedding"],
  ["new", "New arrivals"],
]

function ProductsPanel({
  rows,
  loading,
  totalCount,
  visibleCount,
  hiddenCount,
  form,
  setForm,
  editingId,
  saving,
  notice,
  supabaseReady,
  onRefresh,
  onAdd,
  onEdit,
  onDelete,
  onToggleActive,
  onSave,
  onCancel,
}) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const fileInputRef = useRef(null)

  function openFilePicker() {
    if (uploading) return
    fileInputRef.current?.click()
  }

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
    <div className="grid gap-4 lg:grid-cols-[1fr_400px]">
      <section className="rounded-3xl border border-white/80 bg-white/75 p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap gap-2">
          {[
            ["Total", totalCount],
            ["In shop", visibleCount],
            ["Hidden", hiddenCount],
          ].map(([label, count]) => (
            <span key={label} className="rounded-full bg-[#faf8f4] px-3 py-1 text-[11px] text-ink/70">
              {label}: <strong className="text-primary">{count}</strong>
            </span>
          ))}
        </div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Products</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={onAdd} className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-cream">
              + Add product
            </button>
            <button type="button" onClick={onRefresh} className="rounded-full border border-black/10 px-4 py-2 text-xs">
              Refresh
            </button>
          </div>
        </div>
        {notice && <p className="mb-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{notice}</p>}
        {loading ? (
          <p className="text-sm text-ink/50">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="rounded-xl border border-dashed border-black/10 px-4 py-8 text-center text-sm text-ink/55">
            No products yet. Use <strong>Add product</strong> and fill in the form on the right.
          </p>
        ) : (
          <ul className="space-y-3">
            {rows.map((product) => (
              <li
                key={product.id}
                className="flex flex-wrap items-center gap-3 rounded-2xl border border-black/[0.06] bg-white/80 px-3 py-3"
              >
                <img src={product.image} alt="" className="h-16 w-12 rounded-lg object-cover object-top" />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-xl leading-tight text-primary">{product.name}</p>
                  <p className="text-xs text-ink/45">
                    {formatPrice(product.price)}
                    {product.badge ? ` · ${product.badge}` : ""}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {!product.active && (
                      <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium uppercase">Hidden</span>
                    )}
                    {product.featured && (
                      <span className="rounded bg-secondary/20 px-1.5 py-0.5 text-[10px] font-medium uppercase">Featured</span>
                    )}
                    {product.party && (
                      <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium uppercase">Party</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide">
                  <button type="button" onClick={() => onEdit(product)} className="text-primary underline">
                    Edit
                  </button>
                  <button type="button" onClick={() => onToggleActive(product)} className="text-ink/70 underline">
                    {product.active ? "Hide" : "Show"}
                  </button>
                  <button type="button" onClick={() => onDelete(product.id)} className="text-red-700 underline">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      <aside id="admin-product-form" className="h-fit scroll-mt-24 rounded-3xl border border-white/80 bg-white/75 p-5 shadow-sm lg:sticky lg:top-4">
        <h3 className="text-lg font-semibold">{editingId ? "Edit product" : "Add product"}</h3>
        <p className="mt-1 text-xs text-ink/50">Fields marked with * are required.</p>
        <form onSubmit={onSave} className="mt-4 space-y-3">
          <p className="text-[10px] tracking-wide text-ink/45 uppercase">Product photo *</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={choosePhoto}
            className="sr-only"
            tabIndex={-1}
            aria-hidden
          />
          <button
            type="button"
            onClick={openFilePicker}
            disabled={uploading}
            className="group relative flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/25 bg-white py-8 transition hover:border-primary/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-70"
          >
            {form.image ? (
              <span className="flex flex-col items-center gap-3 px-4 text-center">
                <span className="h-24 w-[4.5rem] shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-black/10">
                  <img
                    src={form.image}
                    alt=""
                    className="h-full w-full object-cover object-top"
                  />
                </span>
                <span className="text-sm font-medium text-primary">
                  {uploading ? "Uploading…" : "Click to change photo"}
                </span>
              </span>
            ) : (
              <span className="flex flex-col items-center gap-2 px-4 py-2 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl text-primary" aria-hidden>
                  +
                </span>
                <span className="text-sm font-medium text-primary">
                  {uploading ? "Uploading…" : "Click to upload image"}
                </span>
                <span className="text-xs normal-case text-ink/45">Opens your files — JPG, PNG, WebP</span>
              </span>
            )}
          </button>
          {uploadError && <p className="text-xs text-red-700">{uploadError}</p>}
          <label className="block text-[10px] tracking-wide text-ink/45 uppercase">
            Or paste image URL
            <input
              type="text"
              required
              value={form.image}
              onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))}
              placeholder="/sarees/… or https://…"
              className="mt-1 w-full rounded border border-black/10 px-2.5 py-2 text-sm normal-case outline-none focus:border-primary"
            />
          </label>
          {[["name", "Name *", "text"], ["price", "Price (₹) *", "number"], ["badge", "Badge", "text"], ["category", "Category", "text"], ["color", "Colour", "text"], ["fabric", "Fabric", "text"], ["length", "Length", "text"], ["line", "Short line", "text"]].map(
            ([key, label, type]) => (
              <label key={key} className="block text-[10px] tracking-wide text-ink/45 uppercase">
                {label}
                <input
                  type={type}
                  required={key === "name" || key === "price"}
                  value={form[key]}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [key]: type === "number" ? Number(event.target.value) : event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded border border-black/10 px-2.5 py-2 text-sm normal-case outline-none focus:border-primary"
                />
              </label>
            ),
          )}
          <label className="block text-[10px] tracking-wide text-ink/45 uppercase">
            Shop collection
            <select
              value={form.saleGroup}
              onChange={(event) => setForm((current) => ({ ...current, saleGroup: event.target.value }))}
              className="mt-1 w-full rounded border border-black/10 px-2.5 py-2 text-sm normal-case outline-none focus:border-primary"
            >
              {saleGroupOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-[10px] tracking-wide text-ink/45 uppercase">
            Description
            <textarea
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              rows={4}
              className="mt-1 w-full rounded border border-black/10 px-2.5 py-2 text-sm normal-case outline-none focus:border-primary"
            />
          </label>
          <div className="space-y-2 rounded-xl border border-black/[0.06] bg-[#faf8f4] px-3 py-3">
            <label className="flex items-center gap-2 text-sm normal-case text-ink">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))}
              />
              Featured on home
            </label>
            <label className="flex items-center gap-2 text-sm normal-case text-ink">
              <input
                type="checkbox"
                checked={form.party}
                onChange={(event) => setForm((current) => ({ ...current, party: event.target.checked }))}
              />
              Party wear filter
            </label>
            <label className="flex items-center gap-2 text-sm normal-case text-ink">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(event) => setForm((current) => ({ ...current, active: event.target.checked }))}
              />
              Visible in shop
            </label>
          </div>
          <button
            type="submit"
            disabled={saving || !supabaseReady}
            className="w-full rounded-lg bg-primary py-2.5 text-xs font-semibold tracking-wide text-cream uppercase disabled:opacity-50"
          >
            {saving ? "Saving…" : editingId ? "Update product" : "Add product"}
          </button>
          {editingId && (
            <button type="button" onClick={onCancel} className="w-full rounded-lg border border-black/10 py-2 text-xs uppercase">
              Cancel edit
            </button>
          )}
        </form>
      </aside>
    </div>
  )
}
