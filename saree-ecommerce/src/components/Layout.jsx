import { useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import Footer from "./Footer"
import Navbar from "./Navbar"

export default function Layout({ children }) {
  const { hash, pathname } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    const section = document.querySelector(hash)
    if (section) section.scrollIntoView({ behavior: "smooth" })
  }, [hash, pathname])

  return (
    <div className="min-h-screen bg-paper font-sans text-ink">
      <Navbar />
      <main>{children}</main>
      <Footer />
      <Link
        to="/contact"
        aria-label="Contact the showroom"
        className="motion-btn motion-fill fixed right-5 bottom-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-cream shadow-lg"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M6 7h12v8H8l-2 2z" />
        </svg>
      </Link>
    </div>
  )
}
