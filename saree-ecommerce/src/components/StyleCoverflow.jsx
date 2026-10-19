import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const slides = [
  { image: "/sarees/worn/worn-mustard-rose.jpg", to: "/product/8" },
  { image: "/sarees/worn/worn-fuchsia.jpg", to: "/product/3" },
  { image: "/sarees/worn/worn-purple.jpg", to: "/product/1" },
  { image: "/sarees/worn/worn-magenta-check.jpg", to: "/product/4" },
  { image: "/sarees/worn/worn-crimson.jpg", to: "/product/2" },
  { image: "/sarees/worn/worn-green-plum.jpg", to: "/product/10" },
  { image: "/sarees/worn/worn-lime-pink.jpg", to: "/product/7" },
  { image: "/sarees/worn/worn-mustard-coral.jpg", to: "/product/5" },
  { image: "/sarees/worn/worn-mustard-teal.jpg", to: "/product/11" },
  { image: "/sarees/worn/worn-plum-leaf.jpg", to: "/product/9" },
]

const STEP_DEG = 32

function wrapOffset(index, active, length) {
  let offset = index - active
  if (offset > length / 2) offset -= length
  if (offset < -length / 2) offset += length
  return offset
}

function cardTransform(offset, radius) {
  const angle = offset * STEP_DEG
  const rad = (angle * Math.PI) / 180
  const x = Math.sin(rad) * radius
  const z = (Math.cos(rad) - 1) * radius
  const abs = Math.abs(offset)
  const scale = Math.max(0.72, 1 - abs * 0.08)
  return `translate(-50%, -50%) translate3d(${x}px, 0, ${z}px) rotateY(${-angle}deg) scale(${scale})`
}

export default function StyleCoverflow() {
  const [active, setActive] = useState(0)
  const [radius, setRadius] = useState(380)
  const total = slides.length

  useEffect(() => {
    function syncRadius() {
      const width = window.innerWidth
      if (width < 640) setRadius(200)
      else if (width < 1024) setRadius(300)
      else setRadius(420)
    }
    syncRadius()
    window.addEventListener("resize", syncRadius)
    return () => window.removeEventListener("resize", syncRadius)
  }, [])

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % total)
    }, 3800)
    return () => window.clearInterval(id)
  }, [total])

  function go(step) {
    setActive((current) => (current + step + total) % total)
  }

  return (
    <section className="overflow-hidden bg-[#f4f1ec] px-4 py-16 md:py-20">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="font-display text-4xl tracking-[0.04em] text-[#2c1814] uppercase md:text-5xl">
          Discover Your Style
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-ink/60 md:text-base">
          From light day drapes to wedding soft silks, find the edit made for you.
        </p>
      </div>

      <div className="relative mx-auto mt-10 max-w-6xl">
        <div className="coverflow" aria-roledescription="carousel">
          <div className="coverflow-stage">
            {slides.map((slide, index) => {
              const offset = wrapOffset(index, active, total)
              const abs = Math.abs(offset)
              const isActive = offset === 0
              const hidden = abs > 2
              return (
                <article
                  key={slide.image}
                  className={`coverflow-card ${isActive ? "is-active" : ""}`}
                  style={{
                    transform: cardTransform(offset, radius),
                    zIndex: total - abs,
                    opacity: hidden ? 0 : 1 - abs * 0.15,
                    pointerEvents: hidden ? "none" : "auto",
                  }}
                  aria-hidden={!isActive}
                >
                  {isActive ? (
                    <Link to={slide.to} className="coverflow-link" aria-label="View saree">
                      <img src={slide.image} alt="" decoding="async" className="coverflow-image" />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="coverflow-link"
                      onClick={() => setActive(index)}
                      aria-label="Show saree"
                    >
                      <img src={slide.image} alt="" decoding="async" className="coverflow-image" />
                    </button>
                  )}
                </article>
              )
            })}
          </div>
        </div>

        <button
          type="button"
          aria-label="Previous style"
          onClick={() => go(-1)}
          className="absolute top-1/2 left-1 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-white text-primary shadow-sm md:left-4 md:h-12 md:w-12"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next style"
          onClick={() => go(1)}
          className="absolute top-1/2 right-1 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-white text-primary shadow-sm md:right-4 md:h-12 md:w-12"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  )
}
