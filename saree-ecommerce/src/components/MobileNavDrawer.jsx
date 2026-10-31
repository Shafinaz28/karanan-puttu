import { useState } from "react"
import { Link } from "react-router-dom"
import { shopCategoryCards } from "../data/shopCategories"
import logo from "../assets/images/kpc-logo.avif"

const shopByWeave = shopCategoryCards.filter((item) => item.id === "soft" || item.id === "traditional")
const shopByFabric = shopCategoryCards.filter((item) => item.id === "tissue" || item.id === "party")

export default function MobileNavDrawer({
  open,
  onClose,
  count,
  query,
  setQuery,
  onSearch,
  drawerSearchOpen,
  setDrawerSearchOpen,
}) {
  const [expanded, setExpanded] = useState(null)

  if (!open) return null

  function toggleSection(id) {
    setExpanded((current) => (current === id ? null : id))
  }

  function closeAndReset() {
    setExpanded(null)
    setDrawerSearchOpen(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[95] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <button
        type="button"
        aria-label="Close menu"
        className="mobile-nav-backdrop absolute inset-0 bg-black/45"
        onClick={closeAndReset}
      />

      <aside className="mobile-nav-panel absolute inset-y-0 left-0 flex h-full w-[min(88vw,360px)] flex-col bg-white shadow-2xl">
        <div className="flex shrink-0 items-center gap-2 border-b border-black/10 px-4 py-3">
          <button
            type="button"
            onClick={closeAndReset}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center text-2xl leading-none text-ink"
          >
            ×
          </button>
          <Link to="/" onClick={closeAndReset} className="flex min-w-0 flex-1 items-center justify-center gap-2">
            <img src={logo} alt="" className="h-9 w-9 object-contain" />
            <span className="truncate font-display text-xl text-primary">Karnan</span>
          </Link>
          <button
            type="button"
            aria-label="Search"
            aria-expanded={drawerSearchOpen}
            onClick={() => setDrawerSearchOpen((value) => !value)}
            className="p-2 text-primary"
          >
            <SearchIcon />
          </button>
          <Link to="/cart" onClick={closeAndReset} aria-label={`Cart, ${count} items`} className="relative p-2 text-primary">
            <BagIcon />
            {count > 0 && (
              <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e53935] px-1 text-[10px] font-semibold text-white">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Link>
        </div>

        {drawerSearchOpen && (
          <form onSubmit={onSearch} className="shrink-0 border-b border-black/10 px-4 py-3">
            <div className="flex items-center gap-2 rounded-full border border-black/15 bg-[#f7f4ef] px-3">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search sarees"
                aria-label="Search sarees"
                autoFocus
                className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none"
              />
              <button type="submit" className="text-xs font-medium text-primary">
                Go
              </button>
            </div>
          </form>
        )}

        <nav className="min-h-0 flex-1 overflow-y-auto px-5 py-2">
          <MobileNavLink to="/" onNavigate={closeAndReset}>
            Home
          </MobileNavLink>

          <ExpandableNavRow
            label="Shop by Weave"
            open={expanded === "weave"}
            onToggle={() => toggleSection("weave")}
          >
            {shopByWeave.map((item) => (
              <MobileSubLink key={item.id} to={`/shop?collection=${item.id}`} onNavigate={closeAndReset}>
                {item.label}
              </MobileSubLink>
            ))}
          </ExpandableNavRow>

          <ExpandableNavRow
            label="Shop by Fabric"
            open={expanded === "fabric"}
            onToggle={() => toggleSection("fabric")}
          >
            {shopByFabric.map((item) => (
              <MobileSubLink key={item.id} to={`/shop?collection=${item.id}`} onNavigate={closeAndReset}>
                {item.label}
              </MobileSubLink>
            ))}
          </ExpandableNavRow>

          <MobileNavLink to="/shop?collection=new" onNavigate={closeAndReset}>
            New Arrivals
          </MobileNavLink>
          <MobileNavLink to="/shop" onNavigate={closeAndReset}>
            All Sarees
          </MobileNavLink>
          <MobileNavLink to="/about" onNavigate={closeAndReset}>
            Our Story
          </MobileNavLink>
          <MobileNavLink to="/old-silk" onNavigate={closeAndReset}>
            Old silk
          </MobileNavLink>
          <MobileNavLink to="/blog" onNavigate={closeAndReset}>
            Blog
          </MobileNavLink>
          <MobileNavLink to="/contact" onNavigate={closeAndReset}>
            Contact
          </MobileNavLink>
          <MobileNavLink to="/locations" onNavigate={closeAndReset}>
            Locate Us
          </MobileNavLink>
        </nav>

        <div className="shrink-0 border-t border-black/10 px-5 py-6">
          <p className="text-sm font-semibold text-ink">My Account</p>
          <Link
            to="/login"
            onClick={closeAndReset}
            className="motion-btn mt-4 flex w-full items-center justify-center bg-ink py-3.5 text-sm font-medium text-white"
          >
            Log in
          </Link>
          <Link
            to="/login"
            state={{ signUp: true }}
            onClick={closeAndReset}
            className="motion-btn mt-3 flex w-full items-center justify-center border border-ink bg-white py-3.5 text-sm font-medium text-ink"
          >
            Register
          </Link>
        </div>
      </aside>
    </div>
  )
}

function MobileNavLink({ to, onNavigate, children }) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className="block border-b border-black/8 py-4 text-[15px] text-ink hover:text-primary"
    >
      {children}
    </Link>
  )
}

function MobileSubLink({ to, onNavigate, children }) {
  return (
    <Link to={to} onClick={onNavigate} className="block py-2.5 pl-1 text-sm text-ink/75 hover:text-primary">
      {children}
    </Link>
  )
}

function ExpandableNavRow({ label, open, onToggle, children }) {
  return (
    <div className="border-b border-black/8">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left text-[15px] text-ink"
      >
        {label}
        <ChevronIcon open={open} />
      </button>
      {open && <div className="pb-3 pl-2">{children}</div>}
    </div>
  )
}

function ChevronIcon({ open }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 text-ink/45 transition-transform ${open ? "rotate-90" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <circle cx="11" cy="11" r="6" />
      <path d="M16 16 20 20" />
    </svg>
  )
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M6 8h14l-1.2 8H8z" />
      <path d="M6 8 5 5H3" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </svg>
  )
}
