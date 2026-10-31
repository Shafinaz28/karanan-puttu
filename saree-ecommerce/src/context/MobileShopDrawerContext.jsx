import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"

const MobileShopDrawerContext = createContext(null)

export function MobileShopDrawerProvider({ children }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  const openDrawer = useCallback(() => setOpen(true), [])
  const closeDrawer = useCallback(() => setOpen(false), [])
  const toggleDrawer = useCallback(() => setOpen((value) => !value), [])

  useEffect(() => {
    if (!pathname.startsWith("/shop")) setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  const value = useMemo(
    () => ({ open, openDrawer, closeDrawer, toggleDrawer }),
    [open, openDrawer, closeDrawer, toggleDrawer],
  )

  return <MobileShopDrawerContext.Provider value={value}>{children}</MobileShopDrawerContext.Provider>
}

export function useMobileShopDrawer() {
  const context = useContext(MobileShopDrawerContext)
  if (!context) {
    throw new Error("useMobileShopDrawer must be used within MobileShopDrawerProvider")
  }
  return context
}
