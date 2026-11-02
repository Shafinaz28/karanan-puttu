import { useEffect } from "react"
import gsap from "gsap"

function afterLoader(run) {
  if (document.getElementById("initial-loader")) {
    window.addEventListener("kpc:loader-done", run, { once: true })
    return () => window.removeEventListener("kpc:loader-done", run)
  }
  run()
  return undefined
}

export default function useShopMotion(catalogKey) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) return undefined

    let cancelled = false
    let ctx

    const runIntro = () => {
      if (cancelled) return
      ctx = gsap.context(() => {
        const section = document.querySelector("[data-shop-section]")
        if (!section) return

        const toolbar = section.querySelector("[data-shop-toolbar]")
        if (toolbar) {
          gsap.from(toolbar.children, {
            y: 24,
            autoAlpha: 0,
            duration: 0.65,
            stagger: 0.08,
            ease: "power3.out",
            delay: 0.12,
            clearProps: "transform,opacity,visibility",
          })
        }

        const meta = section.querySelector("[data-shop-meta]")
        if (meta) {
          gsap.from(meta, {
            y: 16,
            autoAlpha: 0,
            duration: 0.55,
            ease: "power3.out",
            delay: 0.22,
            clearProps: "transform,opacity,visibility",
          })
        }

        const filters = section.querySelector("[data-shop-filters]")
        if (filters) {
          gsap.from(filters, {
            x: -36,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: 0.18,
            clearProps: "transform,opacity,visibility",
          })
        }
      })
    }

    const cleanupLoader = afterLoader(runIntro)
    return () => {
      cancelled = true
      cleanupLoader?.()
      ctx?.revert()
    }
  }, [])

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce || !catalogKey) return undefined

    let ctx

    const runGrid = () => {
      ctx = gsap.context(() => {
        const section = document.querySelector("[data-shop-section]")
        if (!section) return

        const products = section.querySelectorAll("[data-shop-product]")
        if (products.length) {
          gsap.from(products, {
            y: 52,
            autoAlpha: 0,
            duration: 0.68,
            stagger: { amount: 0.42, from: "start" },
            ease: "power3.out",
            clearProps: "transform,opacity,visibility",
          })
          gsap.from(section.querySelectorAll("[data-shop-product] .arch-photo img"), {
            scale: 1.12,
            duration: 0.88,
            stagger: { amount: 0.42, from: "start" },
            ease: "power2.out",
            delay: 0.04,
            clearProps: "transform",
          })
        }

        const pagination = section.querySelector("[data-shop-pagination]")
        if (pagination) {
          gsap.from(pagination, {
            y: 18,
            autoAlpha: 0,
            duration: 0.5,
            ease: "power2.out",
            delay: 0.2,
            clearProps: "transform,opacity,visibility",
          })
        }
      })
    }

    const frame = window.requestAnimationFrame(runGrid)
    return () => {
      window.cancelAnimationFrame(frame)
      ctx?.revert()
    }
  }, [catalogKey])
}
