import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const HERO_IMAGE = "/hero/hero-mustard1.png"

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

const loader = document.getElementById("initial-loader")
if (loader) {
  const domReady =
    document.readyState !== "loading"
      ? Promise.resolve()
      : new Promise((resolve) => document.addEventListener("DOMContentLoaded", resolve, { once: true }))
  const minimumDisplayTime = new Promise((resolve) => window.setTimeout(resolve, 500))

  Promise.all([
    domReady,
    preloadImage(HERO_IMAGE),
    minimumDisplayTime,
  ]).then(() => {
    loader.classList.add("is-hidden")
    window.setTimeout(() => loader.remove(), 1720)
  })
}
