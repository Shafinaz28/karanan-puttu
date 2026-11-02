import { useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

function afterLoader(run) {
  if (document.getElementById("initial-loader")) {
    window.addEventListener("kpc:loader-done", run, { once: true })
    return () => window.removeEventListener("kpc:loader-done", run)
  }
  run()
  return undefined
}

function revealBlock(section, selector, options = {}) {
  const nodes = section.querySelectorAll(selector)
  if (!nodes.length) return

  gsap.from(nodes, {
    y: options.y ?? 40,
    autoAlpha: 0,
    duration: options.duration ?? 0.8,
    stagger: options.stagger ?? 0.1,
    ease: "power3.out",
    clearProps: "transform,opacity,visibility",
    scrollTrigger: {
      trigger: section,
      start: "top 82%",
      once: true,
    },
  })
}

export default function useOldSilkMotion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) return undefined

    let cancelled = false
    let ctx

    const run = () => {
      if (cancelled) return
      ctx = gsap.context(() => {
        document.querySelectorAll("[data-old-silk-section]").forEach((section) => {
          revealBlock(section, "[data-old-silk-intro] > *", { y: 32, stagger: 0.08 })

          const cards = section.querySelectorAll("[data-old-silk-card]")
          if (cards.length) {
            gsap.from(cards, {
              y: 56,
              autoAlpha: 0,
              duration: 0.75,
              stagger: { amount: 0.5, from: "start" },
              ease: "power3.out",
              clearProps: "transform,opacity,visibility",
              scrollTrigger: {
                trigger: section.querySelector("[data-old-silk-grid]") || section,
                start: "top 78%",
                once: true,
              },
            })
            gsap.from(section.querySelectorAll("[data-old-silk-card] img"), {
              scale: 1.1,
              duration: 0.95,
              stagger: { amount: 0.5, from: "start" },
              ease: "power2.out",
              delay: 0.06,
              clearProps: "transform",
              scrollTrigger: {
                trigger: section.querySelector("[data-old-silk-grid]") || section,
                start: "top 78%",
                once: true,
              },
            })
          }

          const videos = section.querySelectorAll("[data-old-silk-video]")
          if (videos.length) {
            gsap.from(videos, {
              y: 48,
              autoAlpha: 0,
              duration: 0.7,
              stagger: 0.12,
              ease: "power3.out",
              clearProps: "transform,opacity,visibility",
              scrollTrigger: {
                trigger: section.querySelector("[data-old-silk-videos]") || section,
                start: "top 80%",
                once: true,
              },
            })
          }
        })
      })
      ScrollTrigger.refresh()
    }

    const cleanupLoader = afterLoader(run)
    return () => {
      cancelled = true
      cleanupLoader?.()
      ctx?.revert()
    }
  }, [])
}
