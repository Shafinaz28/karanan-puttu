import { useEffect } from "react"
import { createPortal } from "react-dom"
import { useLocation } from "react-router-dom"
import usePageMotion from "../hooks/usePageMotion"
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

  usePageMotion(pathname)

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-shell font-sans text-ink">
      <Navbar />
      <main className="w-full max-w-full overflow-x-clip pb-24 md:pb-0">{children}</main>
      <Footer />
      {createPortal(
        <a
          href="https://wa.me/917200016300"
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp"
          className="fixed z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#1ebe5d]"
          style={{
            right: "max(16px, env(safe-area-inset-right))",
            bottom: "max(16px, env(safe-area-inset-bottom))",
          }}
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
            <path d="M20.5 3.5A11 11 0 0 0 2.1 17.2L1 23l5.9-1.1A11 11 0 0 0 12 22a11 11 0 0 0 8.5-18.5zM12 20.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3.5.6.7-3.4-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.7.9-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.4.1-.3a.5.5 0 0 0 0-.4c0-.1-.5-1.3-.7-1.7s-.4-.4-.5-.4h-.4a.8.8 0 0 0-.6.3 2.5 2.5 0 0 0-.8 1.8 4.3 4.3 0 0 0 .9 2.3 9.8 9.8 0 0 0 3.8 3.3 4.3 4.3 0 0 0 2.6.7 2.4 2.4 0 0 0 1.6-.7 2 2 0 0 0 .4-1.4c-.1-.1-.1-.3-.2-.4z" />
          </svg>
        </a>,
        document.body,
      )}
    </div>
  )
}
