import { useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

function introNodes(section) {
  const heading = section.querySelector("h1, h2")
  if (!heading) return []
  const nodes = []
  const eyebrow = heading.previousElementSibling
  if (eyebrow && (eyebrow.tagName === "P" || eyebrow.tagName === "SPAN")) nodes.push(eyebrow)
  nodes.push(heading)
  const sub = heading.nextElementSibling
  if (sub && sub.tagName === "P") nodes.push(sub)
  return nodes
}

function revealTargets(section) {
  if (section.querySelector(".arch-rail")) return []

  return [...section.querySelectorAll("li, article")].filter((el) => {
    if (el.closest(".arch-rail")) return false
    if (el.classList.contains("motion-card") || el.classList.contains("motion-btn") || el.classList.contains("motion-circle")) {
      return false
    }
    if (el.closest(".motion-card, .motion-btn, .motion-circle")) return false
    const parentBlock = el.parentElement?.closest("li, article")
    if (parentBlock && section.contains(parentBlock)) return false
    return true
  })
}

function rise(targets, section, immediate, extraDelay = 0) {
  if (!targets.length) return
  const count = targets.length
  const stagger = count > 3 ? 0.12 : count > 1 ? 0.08 : 0
  const delay = (immediate ? 0.08 : 0) + extraDelay
  const scrollTrigger = immediate
    ? undefined
    : {
        trigger: section,
        start: "top 85%",
        once: true,
      }

  gsap.from(targets, {
    y: count > 3 ? 70 : 36,
    autoAlpha: 0,
    duration: 0.85,
    ease: "power3.out",
    stagger,
    delay,
    scrollTrigger,
  })

  const photos = targets.flatMap((node) => [...node.querySelectorAll("img")]).filter((img) => !img.closest(".arch-photo"))
  if (photos.length > 1) {
    gsap.from(photos, {
      scale: 1.18,
      duration: 1.05,
      ease: "power2.out",
      stagger,
      delay,
      clearProps: "transform",
      scrollTrigger,
    })
  }
}

export default function usePageMotion(pathname) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) return undefined

    const ctx = gsap.context(() => {
      gsap.from("header", {
        y: -18,
        autoAlpha: 0,
        duration: 0.55,
        ease: "power2.out",
        clearProps: "transform",
      })
    })

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) return undefined

    const ctx = gsap.context(() => {
      gsap.utils.toArray("main section").forEach((section, index) => {
        const onScreen = index === 0
        const blocks = revealTargets(section)

        const slides = [...section.querySelectorAll("[data-slide]")]
        if (slides.length) {
          const narrow = window.matchMedia("(max-width: 767px)").matches
          slides.forEach((node, slideIndex) => {
            const dir = node.dataset.slide
            const from = !narrow && dir === "left" ? { x: -84 } : !narrow && dir === "right" ? { x: 84 } : { y: 48 }
            gsap.from(node, {
              ...from,
              autoAlpha: 0,
              duration: 0.95,
              ease: "power3.out",
              delay: (onScreen ? 0.06 : 0) + slideIndex * 0.1,
              clearProps: "transform,opacity,visibility",
              scrollTrigger: onScreen
                ? undefined
                : {
                    trigger: section,
                    start: "top 86%",
                    once: true,
                  },
            })
          })
          return
        }

        if (onScreen) {
          const heading = section.querySelector("h1")
          const parent = heading?.parentElement
          if (parent && parent !== section) rise([parent], section, true)
          else rise(introNodes(section), section, true)
        }

        if (blocks.length > 1) {
          rise(blocks, section, onScreen, onScreen ? 0 : 0.12)
          if (!onScreen) {
            const bits = introNodes(section).filter(
              (el) => !blocks.some((block) => block === el || block.contains(el)),
            )
            rise(bits, section, false)
          }
          return
        }

        if (!onScreen) rise([section], section, false)
      })

      const footer = document.querySelector("footer")
      if (footer) {
        gsap.from(footer, {
          y: 24,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footer,
            start: "top 94%",
            once: true,
          },
        })
      }
    })

    ScrollTrigger.refresh()
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener("load", refresh)

    return () => {
      window.removeEventListener("load", refresh)
      ctx.revert()
    }
  }, [pathname])
}
