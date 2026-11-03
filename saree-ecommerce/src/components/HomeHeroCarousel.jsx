import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const heroBanners = [
  {
    id: "banner-1",
    avif: "/hero/slides/banner-1.avif?v=3",
    webp: "/hero/slides/banner-1.webp?v=3",
    alt: "Karnan Pattu Centre founder at the silk showroom",
    width: 1024,
    height: 768,
    bg: "#b1121a",
    imageClass: "object-contain object-center",
    displayAspect: "1024/768",
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
    imageClass: "object-contain object-center",
    displayAspect: "1800/874",
    copy: {
      align: "left",
      contentClass: "md:ml-6 lg:ml-12 xl:ml-16",
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
    imageClass: "object-contain object-center",
    displayAspect: "1800/874",
    copy: {
      align: "left",
      contentClass: "md:ml-8 lg:ml-16 xl:ml-24",
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

  return (
    <section
      data-page-hero
      className="relative w-full max-w-full overflow-hidden bg-black max-md:h-[80dvh] md:aspect-[1800/874]"
      style={{ backgroundColor: active.bg }}
      aria-roledescription="carousel"
      aria-label="Homepage banners"
    >
      <div className="absolute inset-0 flex items-center justify-center">
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
                className={`block h-full w-full max-w-full ${banner.imageClass} !object-cover ${
                  banner.id === "banner-1" ? "max-md:!object-left" : "max-md:!object-right"
                } md:!object-center`}
              />
            </picture>
          )

          return (
            <div
              key={banner.id}
              className={isActive ? "relative h-full w-full flex items-center justify-center" : "absolute inset-0 h-full w-full flex items-center justify-center"}
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
          className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(to_top,rgba(28,8,12,0.96)_0%,rgba(28,8,12,0.72)_32%,rgba(28,8,12,0.25)_58%,transparent_78%)] md:hidden"
          aria-hidden
        />

        <div
          className={`absolute inset-0 z-[3] flex items-end max-md:justify-start max-md:pb-[max(5.75rem,calc(4.75rem+env(safe-area-inset-bottom)))] md:items-center md:pb-0 ${
            alignRight ? "md:justify-end" : "md:justify-start"
          }`}
        >
          <div className="site-container min-w-0 max-md:px-17">
            <div
              className={`w-full min-w-0 text-left text-[#f6efe4] max-md:max-w-[17.25rem] sm:max-w-xs md:max-w-xl ${
                alignRight
                  ? "md:ml-auto md:max-w-lg lg:max-w-xl"
                  : "md:max-w-lg lg:max-w-xl"
              } ${copy.contentClass ?? ""}`}
            >
              <p className="text-[10px] tracking-[0.22em] text-[#e8d5b5] uppercase sm:text-[11px] sm:tracking-[0.28em]">
                {copy.eyebrow}
              </p>
              <Heading className="mt-2 font-display text-[1.65rem] leading-[1.1] text-[#faf6f0] drop-shadow-sm sm:mt-3 sm:text-3xl md:mt-4 md:text-6xl lg:text-7xl">
                {copy.title.map((line, lineIndex) => (
                  <span key={line} className={lineIndex > 0 ? "mt-1 block" : "block"}>
                    {line}
                  </span>
                ))}
              </Heading>
              <p className="mt-2 max-w-md text-xs font-medium leading-6 text-[#f6efe4] max-md:line-clamp-3 sm:mt-4 sm:text-sm sm:leading-7 md:mt-5 md:text-base md:line-clamp-none">
                {copy.body}
              </p>
              <div className="mt-4 max-md:max-w-[14.5rem] md:mt-8">
                <Link
                  to={copy.primaryCta.to}
                  className="motion-btn motion-gold inline-flex w-full items-center justify-center gap-2 bg-secondary px-4 py-2.5 text-[10px] font-semibold tracking-[0.14em] text-ink uppercase sm:w-auto sm:max-w-[16rem] md:px-5 md:py-3 md:text-[11px] md:tracking-[0.16em]"
                >
                  {copy.primaryCta.label}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-between px-2 sm:px-5 md:px-8 lg:px-10">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            className="pointer-events-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/50 bg-[#210a0c]/55 text-white shadow-lg backdrop-blur-sm transition hover:bg-[#210a0c]/80 sm:h-10 sm:w-10 md:h-12 md:w-12"
            aria-label="Previous banner"
          >
            <HeroArrow direction="prev" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            className="pointer-events-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/50 bg-[#210a0c]/55 text-white shadow-lg backdrop-blur-sm transition hover:bg-[#210a0c]/80 sm:h-10 sm:w-10 md:h-12 md:w-12"
            aria-label="Next banner"
          >
            <HeroArrow direction="next" />
          </button>
        </div>

        <div className="absolute bottom-[max(1.25rem,env(safe-area-inset-bottom,0px))] left-1/2 z-[4] flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/30 bg-[#210a0c]/40 px-2.5 py-1.5 backdrop-blur-sm md:bottom-4">
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