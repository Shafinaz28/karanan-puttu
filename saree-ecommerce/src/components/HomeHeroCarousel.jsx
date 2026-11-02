import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const heroBanners = [
  {
    id: "banner-1",
    avif: "/hero/slides/banner-1.avif",
    webp: "/hero/slides/banner-1.webp",
    alt: "Karnan Pattu Centre founder at the silk showroom",
    width: 1800,
    height: 874,
    bg: "#3a1216",
    imageClass: "object-cover object-left object-top",
    displayAspect: "1800/874",
    copy: {
      align: "right",
      eyebrow: "Karnan Pattu Centre",
      title: ["Four decades of silk.", "Still face to face."],
      body: "From our founder’s counter in Jayanagar — handpicked soft silks, honest prices, and the same welcome every time you walk in.",
      primaryCta: { label: "Our story", to: "/about" },
    },
  },
  {
    id: "banner-2",
    avif: "/hero/slides/banner-2.avif",
    webp: "/hero/slides/banner-2.webp",
    alt: "Cash for old silk sarees at Karnan Pattu Centre",
    width: 1800,
    height: 874,
    bg: "#2c1814",
    imageClass: "object-cover object-[18%_top] sm:object-[22%_top]",
    displayAspect: "1800/874",
    copy: {
      align: "left",
      eyebrow: "Old silk buyers",
      title: ["Old sarees.", "Cash today."],
      body: "We buy all types of used and old sarees — soft silk, Kanjivaram, Banarasi, cotton silk, and more. Fair valuation and payment at the counter.",
      primaryCta: { label: "Sell old sarees", to: "/old-silk" },
    },
  },
  {
    id: "banner-3",
    avif: "/hero/slides/banner-3.avif",
    webp: "/hero/slides/banner-3.webp",
    alt: "Heritage silk saree — special offer",
    width: 1800,
    height: 874,
    bg: "#e8dcc8",
    imageClass: "object-cover object-right object-top",
    displayAspect: "1800/874",
    copy: {
      align: "left",
      eyebrow: "Limited time",
      title: ["50% off", "select sarees."],
      body: "Celebration-ready soft silks and classic weaves at half price — shop the offer while stocks last.",
      primaryCta: { label: "Shop the sale", to: "/shop" },
    },
  },
]

const AUTO_MS = 6500

export default function HomeHeroCarousel() {
  const [index, setIndex] = useState(0)
  const total = heroBanners.length
  const active = heroBanners[index]
  const copy = active.copy
  const alignRight = copy.align === "right"
  const Heading = index === 0 ? "h1" : "h2"

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % total)
    }, AUTO_MS)
    return () => window.clearInterval(timer)
  }, [total])

  function goTo(next) {
    setIndex((next + total) % total)
  }

  const aspectClass = "aspect-[1800/874]"

  return (
    <section
      data-page-hero
      className={`relative w-full max-w-full overflow-hidden transition-[aspect-ratio] duration-500 ease-out ${aspectClass}`}
      style={{ backgroundColor: active.bg }}
      aria-roledescription="carousel"
      aria-label="Homepage banners"
    >
      <div className="relative h-full w-full">
        {heroBanners.map((banner, slideIndex) => {
          const isActive = slideIndex === index
          const image = (
            <picture
              className={`block h-full w-full max-w-full transition-opacity duration-700 ease-out ${
                isActive
                  ? "relative z-[1] opacity-100"
                  : "pointer-events-none absolute inset-0 z-0 opacity-0"
              }`}
            >
              <source srcSet={banner.avif} type="image/avif" />
              <source srcSet={banner.webp} type="image/webp" />
              <img
                src={banner.webp}
                alt={banner.alt}
                width={banner.width}
                height={banner.height}
                decoding="async"
                fetchPriority={slideIndex === 0 ? "high" : "low"}
                className={`block h-full w-full max-w-full ${banner.imageClass}`}
              />
            </picture>
          )

          return (
            <div
              key={banner.id}
              className={isActive ? "relative h-full w-full" : "absolute inset-0 h-full w-full"}
              aria-hidden={!isActive}
            >
              {image}
            </div>
          )
        })}

        <div
          className={`pointer-events-none absolute inset-0 z-[2] hidden md:block ${
            alignRight
              ? "bg-[linear-gradient(to_left,rgba(42,10,16,0.78)_0%,rgba(42,10,16,0.4)_36%,rgba(42,10,16,0.1)_55%,transparent_72%)]"
              : "bg-[linear-gradient(to_right,rgba(28,8,12,0.82)_0%,rgba(28,8,12,0.45)_34%,rgba(28,8,12,0.1)_52%,transparent_70%)]"
          }`}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(to_top,rgba(28,8,12,0.92)_0%,rgba(28,8,12,0.5)_36%,transparent_68%)] md:hidden"
          aria-hidden
        />

        <div
          className={`absolute inset-0 z-[3] flex items-end pb-10 md:items-center md:pb-0 ${
            alignRight ? "md:justify-end" : "md:justify-start"
          }`}
        >
          <div className="site-container min-w-0">
            <div
              className={`w-full min-w-0 max-w-xl text-left text-[#f6efe4] ${
                alignRight ? "md:ml-auto md:max-w-lg lg:max-w-xl" : "md:max-w-lg lg:max-w-xl"
              }`}
            >
              <p className="text-[11px] tracking-[0.28em] text-[#e8d5b5] uppercase">{copy.eyebrow}</p>
              <Heading className="mt-3 font-display text-3xl leading-[1.08] text-[#faf6f0] drop-shadow-sm sm:mt-4 sm:text-5xl md:text-6xl lg:text-7xl">
                {copy.title.map((line, lineIndex) => (
                  <span key={line} className={lineIndex > 0 ? "mt-1 block" : "block"}>
                    {line}
                  </span>
                ))}
              </Heading>
              <p className="mt-4 max-w-md text-sm font-medium leading-7 text-[#f6efe4] md:mt-5 md:text-base">
                {copy.body}
              </p>
              <div className="mt-6 md:mt-8">
                <Link
                  to={copy.primaryCta.to}
                  className="motion-btn motion-gold inline-flex w-full max-w-[16rem] items-center justify-center gap-2 bg-secondary px-4 py-2.5 text-[10px] font-semibold tracking-[0.14em] text-ink uppercase sm:w-auto md:px-5 md:py-3 md:text-[11px] md:tracking-[0.16em]"
                >
                  {copy.primaryCta.label}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-between px-3 sm:px-5 md:px-8 lg:px-10">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            className="pointer-events-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/50 bg-[#210a0c]/55 text-white shadow-lg backdrop-blur-sm transition hover:bg-[#210a0c]/80 md:h-12 md:w-12"
            aria-label="Previous banner"
          >
            <HeroArrow direction="prev" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            className="pointer-events-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/50 bg-[#210a0c]/55 text-white shadow-lg backdrop-blur-sm transition hover:bg-[#210a0c]/80 md:h-12 md:w-12"
            aria-label="Next banner"
          >
            <HeroArrow direction="next" />
          </button>
        </div>

        <div className="absolute bottom-3 left-1/2 z-[4] flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/30 bg-[#210a0c]/40 px-2.5 py-1.5 backdrop-blur-sm sm:bottom-4">
          {heroBanners.map((banner, dotIndex) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => goTo(dotIndex)}
              className={`h-2 rounded-full transition-all ${
                dotIndex === index ? "w-6 bg-secondary" : "w-2 bg-white/55 hover:bg-white/80"
              }`}
              aria-label={`Go to banner ${dotIndex + 1}`}
              aria-current={dotIndex === index ? "true" : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function HeroArrow({ direction }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      {direction === "prev" ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
    </svg>
  )
}
