import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const HERO_IMAGE = "/hero/slides/banner-1.webp"
const LOADER_SLIDE_MS = 1200
const LOADER_MIN_MS = 380
const LOADER_MAX_MS = 3200
const HOME_HERO_MAX_MS = 2200

function isHomeRoute() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/"
  return path === "/"
}

function withTimeout(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.decoding = "async"
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = src
  })
}

function waitForPaint() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve))
  })
}

function waitForHomeHero() {
  if (!isHomeRoute()) return Promise.resolve()

  return Promise.race([
    new Promise((resolve) => {
      const finish = (img) => {
        if (!img || (img.complete && img.naturalWidth > 0)) {
          resolve()
          return
        }
        img.addEventListener("load", () => resolve(), { once: true })
        img.addEventListener("error", () => resolve(), { once: true })
      }

      const findHero = () => {
        const section = document.querySelector("[data-page-hero]")
        const img =
          section?.querySelector("[data-page-hero] picture img") ??
          section?.querySelector(`img[src*="${HERO_IMAGE.slice(1)}"]`)
        if (img) {
          finish(img)
          return true
        }
        return false
      }

      if (findHero()) return

      const root = document.getElementById("root")
      const observer = new MutationObserver(() => {
        if (findHero()) observer.disconnect()
      })
      if (root) observer.observe(root, { childList: true, subtree: true })

      const deadline = Date.now() + HOME_HERO_MAX_MS
      const poll = () => {
        if (findHero()) {
          observer.disconnect()
          return
        }
        if (Date.now() > deadline) {
          observer.disconnect()
          resolve()
          return
        }
        requestAnimationFrame(poll)
      }
      poll()
    }),
    withTimeout(HOME_HERO_MAX_MS),
  ])
}

function dismissLoader(loader) {
  loader.classList.add("is-hidden")
  window.setTimeout(() => {
    loader.remove()
    window.dispatchEvent(new Event("kpc:loader-done"))
  }, LOADER_SLIDE_MS + 80)
}

const loader = document.getElementById("initial-loader")
if (loader) {
  const domReady =
    document.readyState !== "loading"
      ? Promise.resolve()
      : new Promise((resolve) => document.addEventListener("DOMContentLoaded", resolve, { once: true }))
  const minimumDisplayTime = withTimeout(LOADER_MIN_MS)

  Promise.race([
    withTimeout(LOADER_MAX_MS),
    Promise.all([domReady, minimumDisplayTime, waitForPaint(), waitForHomeHero()]),
  ]).then(() => {
    preloadImage(HERO_IMAGE)
    dismissLoader(loader)
  })
}
