import { useEffect, useRef, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import MobileNavDrawer from "./MobileNavDrawer"
import { mainNavLinks } from "./navLinks"
import LocationPinIcon from "./LocationPinIcon"
import logo from "../assets/images/kpc-logo.avif"

export default function Navbar() {
  const { count } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [drawerSearchOpen, setDrawerSearchOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
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
      const desktop = window.matchMedia("(min-width: 1024px)").matches
      setPinned(desktop && y > height && scrollingUp)
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
    setDrawerSearchOpen(false)
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
    setDrawerSearchOpen(false)
  }

  return (
    <>
      {pinned && <div style={{ height: barHeight }} aria-hidden="true" />}
      <header
        ref={headerRef}
        className={`${pinned ? "fixed inset-x-0 top-0 shadow-md" : "relative"} z-[80] w-full text-ink ${menuOpen ? "overflow-visible" : "overflow-x-clip"}`}
      >
      <div className="hidden bg-primary xl:block">
        <div className="site-container flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-2.5 text-[11px] text-[#f6efe4] lg:text-[12px]">
        <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-1 lg:gap-7">
          <a href="tel:+917200015300" className="inline-flex items-center gap-1.5 hover:text-secondary">
            <PhoneIcon />
            +91 72000 15300
          </a>
          <a href="tel:+919944055900" className="inline-flex items-center gap-1.5 hover:text-secondary">
            <PhoneIcon />
            +91 98944 41500
          </a>
          <a href="mailto:karnanpattucenter@gmail.com" className="inline-flex min-w-0 items-center gap-1.5 hover:text-secondary">
            <MailIcon />
            <span className="truncate">karnanpattucenter@gmail.com</span>
          </a>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-1">
          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/karnan_pattu_centre_karnataka"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="inline-flex items-center hover:text-secondary"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://youtube.com/@karnanpattucenterkarnataka"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="inline-flex items-center hover:text-secondary"
            >
              <YouTubeIcon />
            </a>
          </div>
          <Link to="/locations" className="inline-flex items-center gap-1.5 whitespace-nowrap hover:text-secondary">
            <LocationPinIcon />
           
          </Link>
        </div>
        </div>
      </div>
      <div className="relative w-full border-b border-primary/10 bg-shell text-primary">
        <div className="site-container relative flex min-h-[72px] items-center justify-between py-2 lg:min-h-[100px] lg:py-3">
        <Link
          to="/"
          className="text-left"
          aria-label="Karnan Pattu Centre"
        >
          <span className="flex items-center justify-center gap-2 lg:justify-start lg:gap-2.5">
            <img src={logo} alt="" className="h-10 w-10 object-contain lg:h-14 lg:w-14" />
            <span className="text-left leading-none">
              <span className="block font-display text-[26px] leading-none font-medium text-primary lg:text-[36px]">
                Karnan
              </span>
              <span className="mt-1 block text-[8px] tracking-[0.22em] text-primary lg:text-[9px]">
                PATTU CENTRE
              </span>
            </span>
          </span>
        </Link>
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-5 text-base whitespace-nowrap text-primary xl:gap-7 lg:flex">
          {mainNavLinks.map(({ to, label, icon }) => (
            <Link key={to} to={to} className="inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-secondary">
              {icon === "location" && <LocationPinIcon />}
              {label}
            </Link>
          ))}
        </nav>
        <div className="z-10 ml-auto flex items-center text-primary lg:gap-3">
          <button type="button" aria-label="Search" className="hidden p-2.5 lg:block" onClick={() => setSearchOpen((open) => !open)}>
            <SearchIcon />
          </button>
          <Link to="/login" aria-label="Login" className="hidden p-2.5 lg:block">
            <UserIcon />
          </Link>
          <Link to="/cart" aria-label={`Cart, ${count} items`} className="relative hidden p-2.5 lg:block">
            <CartIcon />
            <span className="absolute top-0 right-0 flex h-[15px] w-[15px] items-center justify-center rounded-full bg-primary text-[9px] text-[#f6efe4]">
              {count}
            </span>
          </Link>
          <button
            type="button"
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 lg:hidden"
            aria-expanded={menuOpen}
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <span className="block h-px w-4 bg-primary" />
            <span className="block h-px w-4 bg-primary" />
            <span className="block h-px w-4 bg-primary" />
          </button>
        </div>
      </div>
      </div>
      {searchOpen && (
        <form onSubmit={searchSarees} className="border-t border-primary/15 bg-shell py-3">
          <div className="site-container">
            <div className="mx-auto flex max-w-md items-center border border-primary/20 bg-white px-4">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search sarees"
              aria-label="Search sarees"
              className="w-full bg-transparent py-2.5 text-sm text-primary outline-none"
            />
            <button type="submit" aria-label="Search" className="text-primary/60">
              <SearchIcon />
            </button>
          </div>
          </div>
        </form>
      )}

    </header>
      <MobileNavDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        count={count}
        query={query}
        setQuery={setQuery}
        onSearch={searchSarees}
        drawerSearchOpen={drawerSearchOpen}
        setDrawerSearchOpen={setDrawerSearchOpen}
      />
    </>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M7 3.5h3l1.2 3.2-1.8 1.1a12 12 0 0 0 6.8 6.8l1.1-1.8 3.2 1.2v3A1.5 1.5 0 0 1 19 18 16 16 0 0 1 6 5a1.5 1.5 0 0 1 1-1.5z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
      <path d="M14.2 8.2H16V5.4h-1.8c-2.2 0-3.6 1.4-3.6 3.6v1.6H8.4V14h2.2v5h2.6v-5h2.2l.4-3.4h-2.6V9.2c0-.6.3-1 1-1z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3.4" />
      <circle cx="17" cy="7" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
      <path d="M20.2 8.2a2.2 2.2 0 0 0-1.6-1.6C17 6.2 12 6.2 12 6.2s-5 0-6.6.4a2.2 2.2 0 0 0-1.6 1.6A23 23 0 0 0 3.4 12a23 23 0 0 0 .4 3.8 2.2 2.2 0 0 0 1.6 1.6c1.6.4 6.6.4 6.6.4s5 0 6.6-.4a2.2 2.2 0 0 0 1.6-1.6 23 23 0 0 0 .4-3.8 23 23 0 0 0-.4-3.8zM10.4 14.8V9.2L15.2 12l-4.8 2.8z" />
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

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 19.2c1.8-3.2 4-4.8 6.5-4.8s4.7 1.6 6.5 4.8" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M6 8h14l-1.2 8H8z" />
      <path d="M6 8 5 5H3" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </svg>
  )
}
