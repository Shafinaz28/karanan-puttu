
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const heroBanners = [
  {
    id: "banner-1",
    avif: "/hero/slides/Bannerr-1.avif?v=3",
    webp: "/hero/slides/Bannerr-1.webp?v=3",
    mobileAvif: "/hero/mobileimg/Bannerr-1-mobile.avif?v=3",
    mobileWebp: "/hero/mobileimg/Bannerr-1-mobile.webp?v=3",
    alt: "Traditional silk sarees at Karnan Pattu Centre",
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
    mobileAvif: "/hero/mobileimg/Bannerr-2-mobile.avif?v=3",
    mobileWebp: "/hero/mobileimg/Bannerr-2-mobile.webp?v=3",
    alt: "Sell old silk and Zari sarees",
    copy: {
      align: "left",
      eyebrow: "Old Saree Buyers in Bangalore",
      title: ["WE BUY OLD SILK", "& ZARI SAREES"],
      body: "Enquire about selling old Pattu, Kanchipuram, Mysore silk, Banarasi and wedding sarees.",
      primaryCta: { label: "SELL YOUR OLD SAREES", to: "/old-silk" },
    },
  },
  {
    id: "banner-3",
    avif: "/hero/slides/banner-3.avif",
    webp: "/hero/slides/banner-3.webp",
    mobileAvif: "/hero/mobileimg/Bannerr-3-mobile.avif?v=3",
    mobileWebp: "/hero/mobileimg/Bannerr-3-mobile.webp?v=3",
    alt: "Traditional silk saree at Karnan Pattu Centre",
    copy: {
      align: "left",
      eyebrow: "Karnan Pattu Centre",
      title: ["A TRUST BUILT", "ON TRADITION"],
      body: "We value every traditional saree through personal service, individual assessment and trusted relationships.",
      primaryCta: { label: "ABOUT US", to: "/about" },
    },
  },
]

const AUTO_MS = 6000

export default function HomeHeroCarousel() {
  const [index, setIndex] = useState(0)
  const total = heroBanners.length

  const active = heroBanners[index]
  const copy = active.copy
  const alignRight = copy.align === "right"
  const Heading = index === 0 ? "h1" : "h2"

  const goTo = (next) => {
    setIndex((next + total) % total)
  }

  // Automatic slide movement
  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % total)
    }, AUTO_MS)

    return () => window.clearInterval(timer)
  }, [total])

  return (
    <section
      data-page-hero
      className="relative isolate h-[85svh] w-full overflow-hidden bg-[#f5eee5] md:h-auto md:aspect-[1800/874]"
      aria-roledescription="carousel"
      aria-label="Homepage banners"
    >
      {/* SLIDES */}
      <div className="absolute inset-0 overflow-hidden">
        {heroBanners.map((banner, slideIndex) => {
          const isActive = index === slideIndex

          const slideDistance =
            (slideIndex - index + total) % total

          const offset =
            slideDistance > total / 2
              ? slideDistance - total
              : slideDistance

          return (
            <div
              key={banner.id}
              className="absolute inset-0 h-full w-full transition-transform duration-[1200ms] ease-in-out"
              style={{
                transform: `translateX(${offset * 100}%)`,
                zIndex: isActive ? 1 : 0,
              }}
              aria-hidden={!isActive}
            >
              <picture className="block h-full w-full">
                <source
                  media="(max-width: 767px)"
                  srcSet={banner.mobileAvif}
                  type="image/avif"
                />

                <source
                  media="(max-width: 767px)"
                  srcSet={banner.mobileWebp}
                  type="image/webp"
                />

                <source
                  srcSet={banner.avif}
                  type="image/avif"
                />

                <source
                  srcSet={banner.webp}
                  type="image/webp"
                />

                <img
                  src={banner.webp}
                  alt={banner.alt}
                  className="block h-full w-full object-cover object-center"
                  loading={slideIndex === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </picture>
            </div>
          )
        })}
      </div>

      {/* DESKTOP BACKGROUND OVERLAY */}
      <div
        className={`pointer-events-none absolute inset-0 z-[2] hidden md:block ${
          alignRight
            ? "bg-gradient-to-l from-[#210a0c]/75 via-[#210a0c]/25 to-transparent"
            : "bg-gradient-to-r from-[#210a0c]/75 via-[#210a0c]/25 to-transparent"
        }`}
      />

      {/* MOBILE BACKGROUND OVERLAY */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-[#210a0c]/90 via-[#210a0c]/25 to-transparent md:hidden" />

      {/* TEXT CONTENT */}
      <div
        className={`absolute inset-0 z-[3] flex items-center ${
          alignRight ? "justify-end" : "justify-start"
        } max-md:items-end max-md:justify-start`}
      >
        <div className="site-container w-full px-6 md:px-12 lg:px-20 py-12 max-md:pb-24">
          <div
            key={active.id}
            className={`hero-copy-enter max-w-xl text-[#faf6f0] max-md:mx-auto max-md:text-center ${
              alignRight ? "md:ml-auto" : ""
            }`}
          >
            <p className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#e8d5b5]">
              {copy.eyebrow}
            </p>

            <Heading className="mt-3 font-display text-2xl sm:text-4xl md:text-6xl lg:text-7xl leading-[1.1]">
              {copy.title.map((line) => (
                <span key={line} className="block mt-1">
                  {line}
                </span>
              ))}
            </Heading>

            <p className="mt-4 hidden max-w-md text-xs leading-7 text-[#f6efe4] md:block md:text-base">
              {copy.body}
            </p>

            <div className="mt-6 max-md:flex max-md:justify-center">
              <Link
                to={copy.primaryCta.to}
                className="motion-btn motion-gold inline-flex items-center gap-3 bg-secondary px-5 py-3 text-[10px] sm:text-xs font-semibold tracking-widest text-ink uppercase transition hover:opacity-90"
              >
                {copy.primaryCta.label}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* PREVIOUS AND NEXT BUTTONS */}
      <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-between px-3 sm:px-6 md:px-10">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          aria-label="Previous banner"
          className="pointer-events-auto flex h-9 w-9 md:h-12 md:w-12 items-center justify-center rounded-full border border-white/50 bg-[#210a0c]/55 text-white shadow-lg backdrop-blur-sm transition hover:bg-[#210a0c]/85"
        >
          <HeroArrow direction="prev" />
        </button>

        <button
          type="button"
          onClick={() => goTo(index + 1)}
          aria-label="Next banner"
          className="pointer-events-auto flex h-9 w-9 md:h-12 md:w-12 items-center justify-center rounded-full border border-white/50 bg-[#210a0c]/55 text-white shadow-lg backdrop-blur-sm transition hover:bg-[#210a0c]/85"
        >
          <HeroArrow direction="next" />
        </button>
      </div>

      {/* SLIDE INDICATORS */}
      <div className="absolute bottom-10 left-1/2 z-[6] flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/20 bg-[#210a0c]/50 px-4 py-2 backdrop-blur-sm md:bottom-5">
        {heroBanners.map((banner, dotIndex) => (
          <button
            key={banner.id}
            type="button"
            onClick={() => goTo(dotIndex)}
            aria-label={`Go to banner ${dotIndex + 1}`}
            aria-current={dotIndex === index ? "true" : undefined}
            className={`h-2 rounded-full transition-all duration-500 ${
              dotIndex === index
                ? "w-7 bg-secondary"
                : "w-2 bg-white/60 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  )
}

function HeroArrow({ direction }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 md:h-6 md:w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      {direction === "prev" ? (
        <path d="M15 6l-6 6 6 6" />
      ) : (
        <path d="M9 6l6 6-6 6" />
      )}
    </svg>
  )
}
