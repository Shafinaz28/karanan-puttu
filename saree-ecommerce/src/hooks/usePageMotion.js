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

function scrollTriggerFor(section, onScreen) {
  return onScreen
    ? undefined
    : {
        trigger: section,
        start: "top 82%",
        once: true,
      }
}

function animateMotionSection(section, onScreen) {
  const hero = section.querySelector("[data-motion-hero]")
  if (hero) {
    gsap.from(hero.querySelectorAll("[data-motion-item]"), {
      y: 32,
      autoAlpha: 0,
      duration: 0.9,
      stagger: 0.1,
      delay: onScreen ? 0.08 : 0,
      ease: "power3.out",
      clearProps: "transform,opacity,visibility",
      scrollTrigger: scrollTriggerFor(section, onScreen),
    })
    return true
  }

  const textCol = section.querySelector("[data-motion-text]")
  const imageCol = section.querySelector("[data-motion-image]")
  const staggerRoot = section.querySelector("[data-motion-stagger]")
  if (!textCol && !imageCol && !staggerRoot) return false

  const scrollTrigger = scrollTriggerFor(section, onScreen)
  const imageFromLeft = imageCol?.dataset.motionImage === "left"

  if (imageCol) {
    gsap.from(imageCol, {
      x: imageFromLeft ? -64 : 64,
      autoAlpha: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger,
      clearProps: "transform,opacity,visibility",
    })
    const img = imageCol.querySelector("img")
    if (img) {
      gsap.from(img, {
        scale: 1.1,
        duration: 1.1,
        ease: "power2.out",
        scrollTrigger,
        clearProps: "transform",
      })
    }
    const badge = imageCol.querySelector("figcaption")
    if (badge) {
      gsap.from(badge, {
        scale: 0.6,
        autoAlpha: 0,
        duration: 0.65,
        delay: 0.25,
        ease: "back.out(1.6)",
        scrollTrigger,
        clearProps: "transform,opacity,visibility",
      })
    }
  }

  if (textCol) {
    const items = [...textCol.querySelectorAll("[data-motion-item]")]
    gsap.from(items.length ? items : textCol.children, {
      y: 36,
      autoAlpha: 0,
      duration: 0.85,
      stagger: 0.08,
      ease: "power3.out",
      scrollTrigger,
      clearProps: "transform,opacity,visibility",
    })
  }

  if (staggerRoot) {
    gsap.from(staggerRoot.querySelectorAll(":scope > [data-motion-item]"), {
      y: 40,
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger,
      clearProps: "transform,opacity,visibility",
    })
  }

  return true
}

export default function usePageMotion(pathname) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) return undefined

    let cancelled = false
    let ctx

    const runHeaderIntro = () => {
      if (cancelled) return
      ctx = gsap.context(() => {
        gsap.from("header", {
          y: -18,
          autoAlpha: 0,
          duration: 0.55,
          ease: "power2.out",
          clearProps: "transform",
        })
      })
    }

    if (document.getElementById("initial-loader")) {
      window.addEventListener("kpc:loader-done", runHeaderIntro, { once: true })
    } else {
      runHeaderIntro()
    }

    return () => {
      cancelled = true
      window.removeEventListener("kpc:loader-done", runHeaderIntro)
      ctx?.revert()
    }
  }, [])

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) return undefined

    let cancelled = false
    let ctx
    let loadRefresh

    const runPageMotion = () => {
      if (cancelled) return
      ctx = gsap.context(() => {
        gsap.utils.toArray("main section").forEach((section, index) => {
          if (section.hasAttribute("data-shop-section") || section.hasAttribute("data-old-silk-section")) return
          const onScreen = index === 0
          if (animateMotionSection(section, onScreen)) return

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
            y: 20,
            duration: 0.7,
            ease: "power2.out",
            clearProps: "transform",
            scrollTrigger: {
              trigger: footer,
              start: "top bottom",
              once: true,
            },
          })
        }
      })

      ScrollTrigger.refresh()
      loadRefresh = () => ScrollTrigger.refresh()
      window.addEventListener("load", loadRefresh)
    }

    if (document.getElementById("initial-loader")) {
      window.addEventListener("kpc:loader-done", runPageMotion, { once: true })
    } else {
      runPageMotion()
    }

    return () => {
      cancelled = true
      window.removeEventListener("kpc:loader-done", runPageMotion)
      if (loadRefresh) window.removeEventListener("load", loadRefresh)
      ctx?.revert()
    }
  }, [pathname])
}
