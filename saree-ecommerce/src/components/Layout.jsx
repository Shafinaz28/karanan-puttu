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
          <Link
            to="/old-silk"
            className="fixed top-1/2 right-0 z-[80] rounded-l-md bg-secondary px-2 py-3 text-[10px] font-semibold tracking-wide text-primary shadow-lg transition-colors hover:bg-[#b08822] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-2.5 sm:py-4 sm:text-xs md:top-[55%]"
            style={{ writingMode: "vertical-rl", translate: "0 -50%" }}
          >
            Sell Old Sarees
          </Link>
          <a
            href="https://wa.me/917200015300"
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="fixed bottom-[calc(3.5rem+28px+env(safe-area-inset-bottom,0px))] z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#1ebe5d] lg:bottom-[max(16px,env(safe-area-inset-bottom))]"
            style={{
              right: "max(16px, env(safe-area-inset-right))",
            }}
          >
            <svg viewBox="0 0 24 24" className="h-12 w-12" aria-hidden="true">
              <path
                d="M12 3.25a8.75 8.75 0 0 0-7.5 13.25l-.85 3.25 3.35-.88A8.75 8.75 0 1 0 12 3.25Z"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.6"
              />
              <path
                d="M16.58 13.93c-.25-.13-1.48-.73-1.71-.81-.23-.09-.4-.13-.57.12-.17.25-.65.81-.8.98-.15.17-.3.19-.55.06-.25-.12-1.06-.39-2.02-1.25-.75-.67-1.25-1.5-1.4-1.75-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.57-1.38-.78-1.89-.2-.49-.41-.42-.57-.43h-.49c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.08s.89 2.41 1.02 2.58c.12.17 1.75 2.67 4.23 3.74.59.25 1.04.4 1.4.51.59.19 1.13.16 1.55.1.47-.07 1.48-.61 1.69-1.2.21-.59.21-1.09.15-1.2-.06-.1-.23-.17-.48-.29Z"
                fill="currentColor"
              />
            </svg>
          </a>
        </>,
        document.body,
      )}
    </div>
  )
}
