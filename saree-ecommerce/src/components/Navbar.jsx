import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import logo from "../assets/images/kpc-logo.png"

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/shop?collection=new", label: "New Arrivals" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact Us" },
]

const collections = [
  { label: "Traditional Sarees", to: "/shop?collection=traditional" },
  { label: "Silk Sarees", to: "/shop?collection=silk" },
  { label: "Banarasi Sarees", to: "/shop?collection=banarasi" },
  { label: "Cotton Sarees", to: "/shop?collection=cotton" },
  { label: "Handloom Sarees", to: "/shop?collection=handloom" },
  { label: "Designer Sarees", to: "/shop?collection=designer" },
  { label: "Wedding Sarees", to: "/shop?collection=wedding" },
  { label: "Party Wear Sarees", to: "/shop?collection=party" },
]

export default function Navbar() {
  const { count } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [collectionsOpen, setCollectionsOpen] = useState(false)
  const [query, setQuery] = useState("")

  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
    setCollectionsOpen(false)
    setQuery("")
  }, [location.pathname, location.search])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  function searchSarees(event) {
    event.preventDefault()
    const text = query.trim()
    navigate(text ? `/shop?search=${encodeURIComponent(text)}` : "/shop")
  }

  const collectionActive = collections.some((item) => item.to.endsWith(location.search))

  return (
    <header className="sticky top-0 z-40 text-primary">
      <div className="hidden border-b border-primary/10 bg-paper text-primary md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 text-[11px] lg:px-8">
          <div className="flex items-center gap-3">
            <SocialLink href="https://instagram.com" label="Instagram">
              <InstagramIcon />
            </SocialLink>
            <SocialLink href="https://facebook.com" label="Facebook">
              <FacebookIcon />
            </SocialLink>
            <SocialLink href="https://wa.me/917200016300" label="WhatsApp">
              <WhatsAppIcon />
            </SocialLink>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <a href="tel:+917200016300" className="transition-colors duration-300 hover:text-secondary">
              +91 72000 16300
            </a>
            <a href="tel:+914424441875" className="hidden transition-colors duration-300 hover:text-secondary sm:inline">
              044-2444-1875
            </a>
            <a href="mailto:care@karananpattucentre.com" className="hidden transition-colors duration-300 hover:text-secondary md:inline">
              care@karananpattucentre.com
            </a>
          </div>
        </div>
      </div>
      <div className="border-b border-secondary/50 bg-primary text-cream">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="Saree Store">
          <img
            src={logo}
            alt=""
            className="h-14 w-14 object-contain sm:h-16 sm:w-16"
          />
          <span className="hidden font-display text-lg tracking-[0.16em] text-cream md:inline">
            SAREE STORE
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-6 text-[13px] lg:flex">
          <NavLink to="/" label="Home" current={isCurrent("/", location)} />
          <NavLink to="/shop" label="Shop" current={isShop(location)} />

          <div
            className="relative"
            onMouseEnter={() => setCollectionsOpen(true)}
            onMouseLeave={() => setCollectionsOpen(false)}
          >
            <button
              type="button"
              aria-expanded={collectionsOpen}
              aria-haspopup="true"
              onClick={() => setCollectionsOpen((open) => !open)}
              className={`inline-flex items-center gap-1 transition-colors duration-300 ${
                collectionActive ? "text-secondary" : "hover:text-secondary"
              }`}
            >
              Collections
              <Chevron open={collectionsOpen} />
            </button>
            {collectionsOpen && (
              <div className="absolute top-full left-1/2 z-50 w-56 -translate-x-1/2 pt-3">
                <ul className="rounded-xl border border-secondary/30 bg-[#f7f1e8] py-2 shadow-lg">
                  {collections.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.to}
                        className="block px-4 py-2 text-sm text-primary transition-colors duration-300 hover:bg-white hover:text-secondary"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <NavLink
            to="/shop?collection=new"
            label="New Arrivals"
            current={location.search === "?collection=new"}
          />
          <NavLink to="/about" label="About Us" current={isCurrent("/about", location)} />
          <NavLink to="/contact" label="Contact Us" current={isCurrent("/contact", location)} />
        </nav>

        <div className="ml-auto flex items-center gap-3 text-cream sm:gap-4">
          <button
            type="button"
            aria-label="Search sarees"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((open) => !open)}
            className="motion-icon hidden lg:inline-flex"
          >
            <SearchIcon />
          </button>
          <Link to="/wishlist" aria-label="Wishlist" className="motion-icon hidden lg:inline-flex">
            <HeartIcon />
          </Link>
          <Link to="/account" aria-label="Account" className="motion-icon hidden lg:inline-flex">
            <UserIcon />
          </Link>
          <Link to="/cart" aria-label={`Cart, ${count} items`} className="motion-icon relative hidden lg:inline-flex">
            <CartIcon />
            <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-[10px] text-ink">
              {count}
            </span>
          </Link>
          <button
            type="button"
            className="motion-icon flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-lg border border-cream/40 lg:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="block h-px w-4 bg-cream" />
            <span className="block h-px w-4 bg-cream" />
            <span className="block h-px w-4 bg-cream" />
          </button>
        </div>
      </div>

      {searchOpen && (
        <form onSubmit={searchSarees} className="border-t border-cream/15 px-4 py-3 lg:px-8">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search classic and modern sarees..."
            aria-label="Search sarees"
            className="w-full rounded-lg border border-ink/10 bg-white px-4 py-2 text-sm text-ink outline-none focus:border-secondary"
          />
        </form>
      )}

      {menuOpen && (
        <nav className="max-h-[70vh] overflow-y-auto border-t border-cream/15 px-4 py-2 lg:hidden">
          {links
            .filter((link) => ["Home", "Shop"].includes(link.label))
            .map((link) => (
              <Link key={link.label} to={link.to} className="block border-b border-cream/15 py-3 text-sm">
                {link.label}
              </Link>
            ))}

          <button
            type="button"
            aria-expanded={collectionsOpen}
            onClick={() => setCollectionsOpen((open) => !open)}
            className="flex w-full items-center justify-between border-b border-cream/15 py-3 text-left text-sm"
          >
            Collections
            <Chevron open={collectionsOpen} />
          </button>
          {collectionsOpen && (
            <div className="bg-[#f7f1e8] px-3 py-1">
              {collections.map((item) => (
                <Link key={item.label} to={item.to} className="block py-2.5 text-sm text-primary/80">
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          {links
            .filter((link) => ["New Arrivals", "About Us", "Contact Us"].includes(link.label))
            .map((link) => (
            <Link key={link.label} to={link.to} className="block border-b border-cream/15 py-3 text-sm">
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            className="block w-full border-b border-cream/15 py-3 text-left text-sm"
            onClick={() => {
              setMenuOpen(false)
              setSearchOpen(true)
            }}
          >
            Search
          </button>
          <Link to="/wishlist" className="block border-b border-cream/15 py-3 text-sm">
            Wishlist
          </Link>
          <Link to="/account" className="block border-b border-cream/15 py-3 text-sm">
            Account
          </Link>
          <Link to="/cart" className="block border-b border-cream/15 py-3 text-sm">
            Cart ({count})
          </Link>
        </nav>
      )}
      </div>
    </header>
  )
}

function SocialLink({ href, label, children }) {
  return (
    <a href={href} aria-label={label} className="inline-flex transition-colors duration-300 hover:text-secondary">
      {children}
    </a>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
      <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
      <path d="M12 4a8 8 0 0 0-6.9 12L4 20l4.1-1.1A8 8 0 1 0 12 4zm4.2 11.2c-.2.5-1 .9-1.6.9-.4 0-.9.1-2.8-.8-2.3-1.1-3.7-3.4-3.8-3.6-.1-.2-1-1.3-1-2.5s.6-1.8.8-2 .4-.4.6-.4h.5c.1 0 .3 0 .5.4.2.5.6 1.6.7 1.7.1.1.1.3 0 .5l-.3.4c-.1.2-.3.3-.1.6.2.3.7 1.2 1.5 1.9 1 .9 1.8 1.1 2.1 1.2.3.1.4 0 .6-.2l.4-.5c.1-.2.3-.2.5-.1l1.6.8c.2.1.3.2.4.3.1.3 0 .7-.2.9z" />
    </svg>
  )
}

function NavLink({ to, label, current }) {
  return (
    <Link
      to={to}
      className={
        current
          ? "text-secondary transition-colors duration-300"
          : "text-cream transition-colors duration-300 hover:text-secondary"
      }
    >
      {label}
    </Link>
  )
}

function Chevron({ open }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function isCurrent(to, location) {
  if (to === "/") return location.pathname === "/"
  return location.pathname === to
}

function isShop(location) {
  return location.pathname === "/shop" && !location.search.includes("collection=")
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="11" cy="11" r="6" />
      <path d="M16 16 20 20" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 19s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="8" r="3" />
      <path d="M5 19c1.4-3 3.6-4.5 7-4.5s5.6 1.5 7 4.5" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M6 8h14l-1.2 8H8z" />
      <path d="M6 8 5 5H3" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </svg>
  )
}
