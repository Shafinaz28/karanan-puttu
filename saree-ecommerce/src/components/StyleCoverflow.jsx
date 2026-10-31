import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const slides = [
  { image: "/sarees/worn/worn-mustard-rose.avif", to: "/product/8" },
  { image: "/sarees/worn/worn-fuchsia.avif", to: "/product/3" },
  { image: "/sarees/worn/worn-purple.avif", to: "/product/1" },
  { image: "/sarees/worn/worn-magenta-check.avif", to: "/product/4" },
  { image: "/sarees/worn/worn-crimson.avif", to: "/product/2" },
  { image: "/sarees/worn/worn-green-plum.avif", to: "/product/10" },
  { image: "/sarees/worn/worn-lime-pink.avif", to: "/product/7" },
  { image: "/sarees/worn/worn-mustard-coral.avif", to: "/product/5" },
  { image: "/sarees/worn/worn-mustard-teal.avif", to: "/product/11" },
  { image: "/sarees/worn/worn-plum-leaf.avif", to: "/product/9" },
]

function wrapOffset(index, active, length) {
  let offset = index - active
  if (offset > length / 2) offset -= length
  if (offset < -length / 2) offset += length
  return offset
}

function cardStyle(offset, gap) {
  const abs = Math.abs(offset)
  const x = offset * gap
  const rotate = offset * -28
  const scale = abs === 0 ? 1 : abs === 1 ? 0.88 : 0.78
  const z = abs === 0 ? 40 : abs === 1 ? 20 : 0
  return {
    transform: `translate(-50%, -50%) translateX(${x}px) translateZ(${z}px) rotateY(${rotate}deg) scale(${scale})`,
    zIndex: 10 - abs,
    opacity: abs > 2 ? 0 : abs === 2 ? 0.55 : 1,
    pointerEvents: abs > 2 ? "none" : "auto",
  }
}

export default function StyleCoverflow() {
  const [active, setActive] = useState(0)
  const [gap, setGap] = useState(160)
  const total = slides.length

  useEffect(() => {
    function syncGap() {
      const width = window.innerWidth
      if (width < 640) setGap(110)
      else if (width < 1024) setGap(150)
      else setGap(190)
    }
    syncGap()
    window.addEventListener("resize", syncGap)
    return () => window.removeEventListener("resize", syncGap)
  }, [])

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % total)
    }, 4000)
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

      <div className="relative mx-auto mt-10 max-w-5xl">
        <div className="coverflow" aria-roledescription="carousel">
          <div className="coverflow-stage">
            {slides.map((slide, index) => {
              const offset = wrapOffset(index, active, total)
              const abs = Math.abs(offset)
              const isActive = offset === 0
              if (abs > 2) return null
              return (
                <article
                  key={slide.image}
                  className={`coverflow-card ${isActive ? "is-active" : ""}`}
                  style={cardStyle(offset, gap)}
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
          className="absolute top-1/2 left-0 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-white text-primary shadow-sm md:left-2 md:h-12 md:w-12"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next style"
          onClick={() => go(1)}
          className="absolute top-1/2 right-0 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-white text-primary shadow-sm md:right-2 md:h-12 md:w-12"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  )
}
