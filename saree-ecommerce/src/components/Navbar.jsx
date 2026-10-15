import { useEffect, useRef, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import logo from "../assets/images/kpc-logo.avif"

const weaves = [
  { label: "Traditional Sarees", to: "/shop?collection=traditional" },
  { label: "Banarasi Sarees", to: "/shop?collection=banarasi" },
  { label: "Handloom Sarees", to: "/shop?collection=handloom" },
  { label: "Wedding Sarees", to: "/shop?collection=wedding" },
]

const fabrics = [
  { label: "Silk Sarees", to: "/shop?collection=silk" },
  { label: "Cotton Sarees", to: "/shop?collection=cotton" },
  { label: "Designer Sarees", to: "/shop?collection=designer" },
  { label: "Party Wear Sarees", to: "/shop?collection=party" },
]

export default function Navbar() {
  const { count } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState("")
  const [query, setQuery] = useState("")
  const [pinned, setPinned] = useState(false)
  const [barHeight, setBarHeight] = useState(0)
  const headerRef = useRef(null)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const header = headerRef.current
    if (!header) return undefined

    function measure() {
      setBarHeight(header.offsetHeight)
    }

    function onScroll() {
      const y = window.scrollY
      const height = header.offsetHeight
      const scrollingUp = y < lastScrollY.current
      lastScrollY.current = y
      setBarHeight(height)
      setPinned(y > height && scrollingUp)
    }

    measure()
    lastScrollY.current = window.scrollY
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", measure)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", measure)
    }
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setOpenMenu("")
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
    setMenuOpen(false)
  }

  return (
    <>
      {pinned && <div style={{ height: barHeight }} aria-hidden="true" />}
      <header
        ref={headerRef}
        className={pinned ? "fixed inset-x-0 top-0 z-40 text-ink shadow-md" : "z-40 text-ink"}
      >
      <div className="hidden bg-[#f3e3b8] text-[12px] text-[#4a0e17] lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-5 px-4 py-2 lg:px-8">
          <a href="tel:+917200016300" className="inline-flex items-center gap-1.5 hover:text-[#8a6a16]">
            <PhoneIcon />
            +91 72000 16300
          </a>
          <a href="mailto:care@karananpattucentre.com" className="inline-flex items-center gap-1.5 hover:text-[#8a6a16]">
            <MailIcon />
            care@karananpattucentre.com
          </a>
          <SocialText href="https://facebook.com" label="Like us">
            <FacebookIcon />
          </SocialText>
          <SocialText href="https://instagram.com" label="Follow us">
            <InstagramIcon />
          </SocialText>
          <SocialText href="https://youtube.com" label="Watch">
            <YouTubeIcon />
          </SocialText>
          <Link to="/locations" className="ml-auto inline-flex items-center gap-1.5 hover:text-[#8a6a16]">
            <PinIcon />
            Locate Us
          </Link>
        </div>
      </div>
      <div className="hidden h-px bg-[#d4b15a] lg:block" aria-hidden="true" />

      <div className="bg-[#4a0e17]">
      <div className="relative mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="Karnan Pattu Centre">
            <img src={logo} alt="" className="h-[72px] w-[72px] object-contain lg:h-[84px] lg:w-[84px]" />
            <span className="whitespace-nowrap text-left text-[13px] font-semibold tracking-wide text-[#f4e6c8] sm:text-sm">
              Karnan Pattu Centre
            </span>
          </Link>
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-3 whitespace-nowrap text-[12px] text-[#e6c98a] lg:flex xl:gap-4 xl:text-[13px]">
            <NavLink to="/" label="Home" current={isCurrent("/", location)} />
            <NavLink to="/about" label="About" current={isCurrent("/about", location)} />
            <MenuDrop
              label="Shop by Weave"
              open={openMenu === "weave"}
              active={weaves.some((item) => item.to.endsWith(location.search))}
              onToggle={() => setOpenMenu((current) => (current === "weave" ? "" : "weave"))}
              onEnter={() => setOpenMenu("weave")}
              onLeave={() => setOpenMenu("")}
              items={weaves}
            />
            <MenuDrop
              label="Shop by Fabric"
              open={openMenu === "fabric"}
              active={fabrics.some((item) => item.to.endsWith(location.search))}
              onToggle={() => setOpenMenu((current) => (current === "fabric" ? "" : "fabric"))}
              onEnter={() => setOpenMenu("fabric")}
              onLeave={() => setOpenMenu("")}
              items={fabrics}
            />
            <NavLink to="/shop?collection=new" label="New Arrivals" current={location.search === "?collection=new"} />
            <NavLink to="/blog" label="Blog" current={isCurrent("/blog", location)} />
            <NavLink to="/contact" label="Contact" current={isCurrent("/contact", location)} />
          </nav>
          <form onSubmit={searchSarees} className="ml-auto hidden w-32 shrink-0 lg:block xl:w-40">
            <div className="flex items-center rounded-full bg-[#f7f4ef] px-3">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search sarees"
                aria-label="Search sarees"
                className="w-full bg-transparent py-2 text-sm text-ink outline-none"
              />
              <button type="submit" aria-label="Search" className="text-ink/50">
                <SearchIcon />
              </button>
            </div>
          </form>
          <div className="ml-auto flex items-center gap-4 text-[#e8d5a3] lg:ml-0 xl:gap-5">
            <Link to="/account" aria-label="Account" className="motion-icon hidden lg:inline-flex">
              <UserIcon />
            </Link>
            <Link to="/wishlist" aria-label="Wishlist" className="motion-icon hidden lg:inline-flex">
              <HeartIcon />
            </Link>
            <Link to="/cart" aria-label={`Cart, ${count} items`} className="motion-icon relative hidden lg:inline-flex">
              <CartIcon />
              <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-[10px] text-ink">
                {count}
              </span>
            </Link>
            <button
              type="button"
              className="motion-icon flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-lg border border-[#f7f1e8]/40 lg:hidden"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="block h-px w-4 bg-[#f7f1e8]" />
              <span className="block h-px w-4 bg-[#f7f1e8]" />
              <span className="block h-px w-4 bg-[#f7f1e8]" />
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="max-h-[75vh] overflow-y-auto border-t border-ink/10 bg-white px-4 py-3 lg:hidden">
          <form onSubmit={searchSarees} className="mb-3 flex items-center rounded-full border border-ink/15 bg-[#f7f4ef] px-4">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search sarees"
              aria-label="Search sarees"
              className="w-full bg-transparent py-2.5 text-sm outline-none"
            />
            <button type="submit" aria-label="Search">
              <SearchIcon />
            </button>
          </form>
          <Link to="/" className="block border-b border-ink/10 py-3 text-sm">Home</Link>
          <Link to="/about" className="block border-b border-ink/10 py-3 text-sm">About</Link>
          <MobileGroup label="Shop by Weave" name="weave" openMenu={openMenu} setOpenMenu={setOpenMenu} items={weaves} />
          <MobileGroup label="Shop by Fabric" name="fabric" openMenu={openMenu} setOpenMenu={setOpenMenu} items={fabrics} />
          <Link to="/shop?collection=new" className="block border-b border-ink/10 py-3 text-sm">New Arrivals</Link>
          <Link to="/blog" className="block border-b border-ink/10 py-3 text-sm">Blog</Link>
          <Link to="/locations" className="block border-b border-ink/10 py-3 text-sm">Locate Us</Link>
          <Link to="/contact" className="block border-b border-ink/10 py-3 text-sm">Contact</Link>
          <Link to="/wishlist" className="block border-b border-ink/10 py-3 text-sm">Wishlist</Link>
          <Link to="/account" className="block py-3 text-sm">Account</Link>
        </div>
      )}
    </header>
    </>
  )
}

function MenuDrop({ label, open, active, onToggle, onEnter, onLeave, items }) {
  return (
    <div className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className={`inline-flex items-center gap-1 hover:text-[#f4e6c8] ${active ? "text-[#f4e6c8]" : "text-[#e6c98a]"}`}
      >
        {label}
        <Chevron open={open} />
      </button>
      {open && (
        <div className="absolute top-full left-1/2 z-50 w-56 -translate-x-1/2 pt-3">
          <ul className="rounded-xl border border-ink/10 bg-white py-2 text-ink shadow-lg">
            {items.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="block px-4 py-2 text-sm hover:bg-[#f7f1e8] hover:text-primary">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function MobileGroup({ label, name, openMenu, setOpenMenu, items }) {
  const open = openMenu === name
  return (
    <div className="border-b border-ink/10">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpenMenu(open ? "" : name)}
        className="flex w-full items-center justify-between py-3 text-left text-sm"
      >
        {label}
        <Chevron open={open} />
      </button>
      {open && (
        <div className="pb-2 pl-3">
          {items.map((item) => (
            <Link key={item.label} to={item.to} className="block py-2 text-sm text-ink/70">
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function SocialText({ href, label, children }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-[#8a6a16]">
      {children}
      {label}
    </a>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M8 4.5h2.2l1.2 3-1.6 1a12 12 0 0 0 5.7 5.7l1-1.6 3 1.2V16a2 2 0 0 1-2.2 2A14.5 14.5 0 0 1 6 6.7 2 2 0 0 1 8 4.5z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z" />
      <circle cx="12" cy="11" r="2" />
    </svg>
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

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
      <path d="M22 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C18.2 5.4 12 5.4 12 5.4s-6.2 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 9 2 12.2 2 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6zM10 15.5v-6.6l5.2 3.3-5.2 3.3z" />
    </svg>
  )
}

function NavLink({ to, label, current }) {
  return (
    <Link
      to={to}
      className={
        current
          ? "text-[#f4e6c8] transition-colors duration-300"
          : "text-[#e6c98a] transition-colors duration-300 hover:text-[#f4e6c8]"
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
