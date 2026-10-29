import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import logo from "./assets/images/kpc-logo.avif"

const loaderLogo = document.querySelector(".initial-loader-logo")
if (loaderLogo) loaderLogo.src = logo

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

const loader = document.getElementById("initial-loader")
if (loader) {
  const pageLoaded =
    document.readyState === "complete"
      ? Promise.resolve()
      : new Promise((resolve) => window.addEventListener("load", resolve, { once: true }))
  const minimumDisplayTime = new Promise((resolve) => window.setTimeout(resolve, 700))

  Promise.all([pageLoaded, minimumDisplayTime]).then(() => {
    loader.classList.add("is-hidden")
    window.setTimeout(() => loader.remove(), 300)
  })
}
