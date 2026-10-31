import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useMobileShopDrawer } from "../context/MobileShopDrawerContext"

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 19v-8.5z" />
      <path d="M9.5 20.5V14h5v6.5" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="5" y="5" width="6" height="6" rx="0.5" />
      <rect x="13" y="5" width="6" height="6" rx="0.5" />
      <rect x="5" y="13" width="6" height="6" rx="0.5" />
      <rect x="13" y="13" width="6" height="6" rx="0.5" />
    </svg>
  )
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M7 9V7a5 5 0 0 1 10 0v2" />
      <path d="M6 9h12l-1 12H7L6 9z" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="11" cy="11" r="6" />
      <path d="M16.5 16.5 20 20" />
    </svg>
  )
}

function TabCell({ children, className = "" }) {
  return (
    <div
      className={`flex flex-1 items-center justify-center border-r border-black/10 py-3 last:border-r-0 ${className}`}
    >
      {children}
    </div>
  )
}

export default function MobileTabBar() {
  const { count } = useCart()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { open, toggleDrawer } = useMobileShopDrawer()
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState("")

  function openShopFilters() {
    setSearchOpen(false)
    if (pathname.startsWith("/shop")) {
      toggleDrawer()
      return
    }
    navigate("/shop", { state: { openMobileFilters: true } })
  }

  function submitSearch(event) {
    event.preventDefault()
    const text = query.trim()
    navigate(text ? `/shop?search=${encodeURIComponent(text)}` : "/shop")
    setSearchOpen(false)
    setQuery("")
  }

  const homeActive = pathname === "/"
  const shopActive = pathname.startsWith("/shop") || open
  const cartActive = pathname.startsWith("/cart") || pathname.startsWith("/checkout")

  return (
    <>
      {searchOpen && (
        <div
          className="fixed inset-x-0 z-[75] border-b border-black/10 bg-white px-4 py-3 lg:hidden"
          style={{ bottom: "calc(3.25rem + env(safe-area-inset-bottom, 0px))" }}
        >
          <form onSubmit={submitSearch} className="flex items-center gap-2">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the collection"
              aria-label="Search"
              autoFocus
              className="min-w-0 flex-1 rounded border border-black/15 px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
            <button type="submit" className="rounded bg-primary px-4 py-2.5 text-xs font-medium text-cream">
              Go
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="px-2 text-sm text-ink/50"
              aria-label="Close search"
            >
              ×
            </button>
          </form>
        </div>
      )}

      <nav
        className="fixed inset-x-0 bottom-0 z-[75] flex border-t border-black/10 bg-white lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        aria-label="Mobile navigation"
      >
        <TabCell>
          <Link
            to="/"
            aria-label="Home"
            aria-current={homeActive ? "page" : undefined}
            className={`flex items-center justify-center ${homeActive ? "text-primary" : "text-ink"}`}
          >
            <HomeIcon />
          </Link>
        </TabCell>
        <TabCell>
          <button
            type="button"
            aria-label="Categories and filters"
            aria-expanded={open}
            onClick={openShopFilters}
            className={`flex items-center justify-center ${shopActive ? "text-primary" : "text-ink"}`}
          >
            <GridIcon />
          </button>
        </TabCell>
        <TabCell>
          <Link
            to="/cart"
            aria-label={`Cart, ${count} items`}
            aria-current={cartActive ? "page" : undefined}
            className={`relative flex items-center justify-center ${cartActive ? "text-primary" : "text-ink"}`}
          >
            <BagIcon />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#e53935] px-1 text-[10px] font-semibold text-white">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Link>
        </TabCell>
        <TabCell>
          <button
            type="button"
            aria-label="Search"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((open) => !open)}
            className={`flex items-center justify-center ${searchOpen ? "text-primary" : "text-ink"}`}
          >
            <SearchIcon />
          </button>
        </TabCell>
      </nav>
    </>
  )
}
