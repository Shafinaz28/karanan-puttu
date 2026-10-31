import { useEffect, useRef, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import logo from "../assets/images/kpc-logo.avif"

export default function Navbar() {
  const { count } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
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
        className={pinned ? "fixed inset-x-0 top-0 z-50 w-full overflow-x-clip text-ink shadow-md" : "relative z-50 w-full overflow-x-clip text-ink"}
      >
      <div className="hidden items-center justify-between gap-4 bg-primary px-4 py-2 text-[11px] whitespace-nowrap text-[#f6efe4] lg:flex lg:px-12 lg:text-[12px]">
        <div className="flex items-center gap-5 lg:gap-7">
          <a href="tel:+919894441500" className="inline-flex items-center gap-1.5 hover:text-secondary">
            <PhoneIcon />
            +91 98944 41500
          </a>
          <a href="tel:+919944055900" className="inline-flex items-center gap-1.5 hover:text-secondary">
            <PhoneIcon />
            +91 99440 55900
          </a>
          <a href="mailto:karnanpattucenter@gmail.com" className="inline-flex items-center gap-1.5 hover:text-secondary">
            <MailIcon />
            karnanpattucenter@gmail.com
          </a>
        </div>
        <div className="flex items-center gap-5">
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
          <Link to="/locations" className="inline-flex items-center gap-1.5 hover:text-secondary">
            <PinIcon />
            Locate Us
          </Link>
        </div>
      </div>
      <div className="relative flex h-[72px] items-center justify-between bg-shell px-3 text-primary lg:h-[100px] lg:px-12">
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
          <Link to="/" className="transition-colors duration-200 hover:text-secondary">Home</Link>
          <Link to="/about" className="transition-colors duration-200 hover:text-secondary">Our Story</Link>
          <Link to="/shop" className="transition-colors duration-200 hover:text-secondary">Shop</Link>
          <Link to="/old-silk" className="transition-colors duration-200 hover:text-secondary">Old silk</Link>
          <Link to="/blog" className="transition-colors duration-200 hover:text-secondary">Blog</Link>
          <Link to="/contact" className="transition-colors duration-200 hover:text-secondary">Contact</Link>
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
          <Link to="/login" aria-label="Login" className="p-2.5 lg:hidden">
            <UserIcon />
          </Link>
          <button
            type="button"
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 lg:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="block h-px w-4 bg-primary" />
            <span className="block h-px w-4 bg-primary" />
            <span className="block h-px w-4 bg-primary" />
          </button>
        </div>
      </div>
      {searchOpen && (
        <form onSubmit={searchSarees} className="border-t border-primary/15 bg-shell px-4 py-3 lg:px-12">
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
        </form>
      )}

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
          <Link to="/about" className="block border-b border-ink/10 py-3 text-sm">Our Story</Link>
          <Link to="/shop" className="block border-b border-ink/10 py-3 text-sm">Shop</Link>
          <Link to="/old-silk" className="block border-b border-ink/10 py-3 text-sm">Old silk</Link>
          <Link to="/blog" className="block border-b border-ink/10 py-3 text-sm">Blog</Link>
          <Link to="/contact" className="block border-b border-ink/10 py-3 text-sm">Contact</Link>
          <Link to="/locations" className="block border-b border-ink/10 py-3 text-sm">Locate Us</Link>
          <Link to="/cart" className="block border-b border-ink/10 py-3 text-sm">Cart ({count})</Link>
          <Link to="/login" className="block border-b border-ink/10 py-3 text-sm">Login</Link>
          <Link to="/account" className="block py-3 text-sm">Account</Link>
        </div>
      )}
    </header>
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

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z" />
      <circle cx="12" cy="11" r="2" />
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
