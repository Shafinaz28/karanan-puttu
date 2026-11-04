import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const heroBanners = [
  {
    id: "banner-1",
    // Desktop images
    avif: "/hero/slides/Bannerr-1.avif?v=3",
    webp: "/hero/slides/Bannerr-1.webp?v=3",
    alt: "Traditional silk sarees at Karnan Pattu Centre",
    width: 1086,
    height: 1900,
    // Separate Mobile images (Update these paths with your mobile assets)
    mobileAvif: "/hero/mobileimg/Bannerr-1-mobile.avif?v=3",
    mobileWebp: "/hero/mobileimg/Bannerr-1-mobile.webp?v=3",
    mobileWidth: 768,
    mobileHeight: 1024,
    bg: "#b1121a",
    imageClass: "object-contain object-center",
    displayAspect: "1086/1900",
    copy: {
      align: "right",
      eyebrow: "Karnan Pattu Centre",
      title: ["BEAUTIFUL TRADITIONAL", "SILK SAREES"],
      body: "Explore Pattu, Kanchipuram, Mysore, Banarasi and wedding silk sarees, woven with tradition and care.",
      primaryCta: { label: "EXPLORE SAREES", to: "/shop" },
    },
  },
  {
    id: "banner-2",
    avif: "/hero/slides/bannerr-2.avif",
    webp: "/hero/slides/bannerr-2.webp",
    alt: "Sell old silk and Zari sarees at Karnan Pattu Centre in Bangalore",
    width: 1800,
    height: 874,
    mobileAvif: "/hero/mobileimg/Bannerr-2-mobile.avif?v=3",
    mobileWebp: "/hero/mobileimg/Bannerr-2-mobile.webp?v=3",
    mobileWidth: 768,
    mobileHeight: 1024,
    bg: "#2c1814",
    imageClass: "object-contain object-center",
    displayAspect: "1800/874",
    copy: {
      align: "left",
      eyebrow: "Old Saree Buyers in Bangalore",
      title: ["WE BUY OLD SILK", "& ZARI SAREES"],
      body: "Enquire about selling old Pattu, Kanchipuram, Mysore silk, Banarasi and wedding sarees.",
      contact: "+91 98944 41500",
      primaryCta: { label: "SELL YOUR OLD SAREES", to: "/old-silk" },
    },
  },
  {
    id: "banner-3",
    avif: "/hero/slides/banner-3.avif",
    webp: "/hero/slides/banner-3.webp",
    alt: "Traditional silk saree at Karnan Pattu Centre",
    width: 1800,
    height: 874,
    mobileAvif: "/hero/mobileimg/Bannerr-3-mobile.avif?v=3",
    mobileWebp: "/hero/mobileimg/Bannerr-3-mobile.webp?v=3",
    mobileWidth: 768,
    mobileHeight: 1024,
    bg: "#e8dcc8",
    imageClass: "object-contain object-center",
    displayAspect: "1800/874",
    copy: {
      align: "left",
      eyebrow: "Karnan Pattu Centre",
      title: ["A TRUST BUILT", "ON TRADITION"],
      body: "We value every traditional saree through personal service, individual assessment and trusted relationships.",
      primaryCta: { label: "ABOUT US", to: "/about" },
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
              {/* Mobile screen sources (screens <= 767px) */}
              {banner.mobileAvif && (
                <source media="(max-width: 767px)" srcSet={banner.mobileAvif} type="image/avif" />
              )}
              {banner.mobileWebp && (
                <source media="(max-width: 767px)" srcSet={banner.mobileWebp} type="image/webp" />
              )}

              {/* Desktop screen sources */}
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
          className={`absolute inset-0 z-[3] flex items-end max-md:justify-start max-md:pt-8 max-md:pb-[max(3.75rem,calc(3rem+env(safe-area-inset-bottom)))] md:items-center md:pb-0 ${
            alignRight ? "md:justify-end" : "md:justify-start"
          }`}
        >
          <div className="site-container min-w-0 max-md:px-17">
            <div
              className={`w-full min-w-0 text-left text-[#f6efe4] max-md:max-w-[17.25rem] sm:max-w-xs md:max-w-xl ${
                alignRight
                  ? "md:ml-auto md:max-w-lg lg:max-w-xl"
                  : "md:max-w-lg lg:max-w-xl"
              } ${index > 0 ? "max-md:ml-6 md:ml-10 lg:ml-14" : ""} ${copy.contentClass ?? ""}`}
            >
              <p className="text-[10px] tracking-[0.22em] text-[#e8d5b5] uppercase sm:text-[11px] sm:tracking-[0.28em]">
                {copy.eyebrow}
              </p>
              <Heading className="mt-2 font-display text-[1.4rem] leading-[1.1] text-[#faf6f0] drop-shadow-sm sm:mt-3 sm:text-3xl md:mt-4 md:text-6xl lg:text-7xl">
                {copy.title.map((line, lineIndex) => (
                  <span
                    key={line}
                    className={`block ${lineIndex > 0 ? "mt-1" : ""} ${
                      active.id === "banner-1"
                        ? "max-md:whitespace-nowrap max-md:tracking-normal"
                        : ""
                    }`}
                  >
                    {line}
                  </span>
                ))}
              </Heading>
              <p className="mt-2 hidden max-w-md text-xs font-medium leading-5 text-[#f6efe4] sm:mt-4 sm:text-sm sm:leading-7 md:mt-5 md:block md:text-base md:line-clamp-none">
                {copy.body}
              </p>

              <div className="mt-4 max-md:max-w-[11.5rem] md:mt-8">
                <Link
                  to={copy.primaryCta.to}
                  className="motion-btn motion-gold inline-flex w-full items-center justify-center gap-1.5 bg-secondary px-2.5 py-1.5 text-[8px] font-semibold tracking-[0.1em] text-ink uppercase sm:w-auto sm:max-w-[14rem] md:px-3.5 md:py-2 md:text-[9px] md:tracking-[0.12em]"
                >
                  {copy.primaryCta.label}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              {copy.brandLine && (
                <p className="mt-3 text-[9px] font-semibold tracking-[0.12em] text-[#e8d5b5] uppercase sm:text-[10px]">
                  {copy.brandLine}
                </p>
              )}
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