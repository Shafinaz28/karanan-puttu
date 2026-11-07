import { useEffect } from "react"
import { createPortal } from "react-dom"
import { Link, useLocation } from "react-router-dom"
import usePageMotion from "../hooks/usePageMotion"
import Footer from "./Footer"
import MobileTabBar from "./MobileTabBar"
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

  usePageMotion(pathname)

  return (
    <div className="min-h-[100dvh] w-full min-w-0 bg-shell font-sans text-ink">
      <Navbar />
      <main className="w-full min-w-0">{children}</main>
      <Footer />
      <MobileTabBar />
      {createPortal(
        <>
          {/* Sell Old Sarees Button */}
          <Link
            to="/old-silk"
            className="fixed top-1/2 right-0 z-[9999] rounded-l-md bg-secondary px-3 py-4 text-xs font-semibold tracking-wide text-primary shadow-2xl transition-colors hover:bg-[#b08822] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-3.5 sm:py-5 sm:text-sm md:top-[55%]"
            style={{ 
              writingMode: "vertical-rl", 
              transform: "translateY(-50%)",
              position: "fixed" 
            }}
          >
            Sell Old Sarees
          </Link>

          {/* WhatsApp Floating Button with Your Image (No Border) */}
          <a
            href="https://wa.me/917200015300"
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="fixed z-[9999] flex h-12 w-12 items-center justify-center transition-transform hover:scale-110 drop-shadow-lg"
            style={{
              right: "max(16px, env(safe-area-inset-right))",
              bottom: "6.5rem",
              position: "fixed"
            }}
          >
            <img 
              src="/whatsapp.png" 
              alt="WhatsApp" 
              className="h-full w-full object-contain"
            />
          </a>
        </>,
        document.body,
      )}
    </div>
  )
}