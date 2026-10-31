import { useEffect, useState } from "react"

const reviews = [
  {
    quote: "I found a beautiful silk saree, and the team helped me choose just the right one.",
    name: "Ananya R.",
    timeAgo: "3 days ago",
    avatar: "https://ui-avatars.com/api/?name=Ananya+R&size=96&background=e8dcc8&color=4a0e17",
  },
  {
    quote: "The store visit was lovely. I appreciated the warm welcome and thoughtful service.",
    name: "Meera S.",
    timeAgo: "1 week ago",
    avatar: "https://ui-avatars.com/api/?name=Meera+S&size=96&background=f0e6d8&color=4a0e17",
  },
  {
    quote: "Selling my old soft silk was simple. The process and price were clearly explained.",
    name: "Lakshmi K.",
    timeAgo: "2 weeks ago",
    avatar: "https://ui-avatars.com/api/?name=Lakshmi+K&size=96&background=ead9bf&color=4a0e17",
  },
  {
    quote: "The saree is even more beautiful in person. I loved the soft fabric and fine details.",
    name: "Divya M.",
    timeAgo: "3 weeks ago",
    avatar: "https://ui-avatars.com/api/?name=Divya+M&size=96&background=e8dcc8&color=4a0e17",
  },
  {
    quote: "The team was kind and patient while helping me find a saree for a family occasion.",
    name: "Kavitha P.",
    timeAgo: "1 month ago",
    avatar: "https://ui-avatars.com/api/?name=Kavitha+P&size=96&background=f0e6d8&color=4a0e17",
  },
  {
    quote: "A smooth experience from choosing my saree to taking it home. I would visit again.",
    name: "Priya S.",
    timeAgo: "1 month ago",
    avatar: "https://ui-avatars.com/api/?name=Priya+S&size=96&background=ead9bf&color=4a0e17",
  },
]

function GoogleMark() {
  return (
    <svg className="h-[18px] w-[18px] shrink-0" viewBox="0 0 24 24" aria-label="Google review" role="img">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.95H1.2v3.14C3.17 21.36 7.24 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.25c-.25-.72-.38-1.49-.38-2.25s.13-1.53.38-2.25V6.61H1.2C.43 8.15 0 9.89 0 12s.43 3.85 1.2 5.39l4.08-3.14z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.24 0 3.17 2.64 1.2 6.61l4.08 3.14c.95-2.84 3.6-4.95 6.72-4.95z"
      />
    </svg>
  )
}

function Stars() {
  return (
    <div className="mt-3 flex gap-0.5 text-[#ea4335]" aria-label="5 out of 5 stars">
      {[...Array(5)].map((_, index) => (
        <span key={index} className="text-[15px] leading-none">
          ★
        </span>
      ))}
    </div>
  )
}

export default function GoogleReviewsSection() {
  const [slidesPerView, setSlidesPerView] = useState(1)
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const maxIndex = Math.max(0, reviews.length - slidesPerView)
  const pageCount = maxIndex + 1

  useEffect(() => {
    const mediaLg = window.matchMedia("(min-width: 1024px)")
    const mediaMd = window.matchMedia("(min-width: 768px)")
    const sync = () => {
      if (mediaLg.matches) setSlidesPerView(3)
      else if (mediaMd.matches) setSlidesPerView(2)
      else setSlidesPerView(1)
    }
    sync()
    mediaLg.addEventListener("change", sync)
    mediaMd.addEventListener("change", sync)
    return () => {
      mediaLg.removeEventListener("change", sync)
      mediaMd.removeEventListener("change", sync)
    }
  }, [])

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, maxIndex))
  }, [maxIndex])

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current >= maxIndex ? 0 : current + 1))
    }, 6000)
    return () => window.clearInterval(timer)
  }, [maxIndex, paused])

  function goTo(index) {
    setActiveIndex(((index % pageCount) + pageCount) % pageCount)
  }

  const slideWidth = 100 / slidesPerView

  return (
    <section className="bg-white px-4 py-14 md:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-[#8a6230] uppercase">Google reviews</p>
          <h2 className="mt-2 font-display text-3xl text-primary md:text-4xl">What customers say</h2>
        </div>

        <div
          className="relative mt-10"
          role="region"
          aria-roledescription="carousel"
          aria-label="Customer reviews"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            aria-label="Previous reviews"
            className="absolute top-1/2 left-0 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/15 bg-white text-lg text-ink shadow-sm transition hover:border-primary hover:text-primary md:flex md:-left-5 lg:-left-6"
          >
            ‹
          </button>

          <div className="overflow-hidden border border-black/10 bg-white md:mx-6 lg:mx-8">
            <ul
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * slideWidth}%)` }}
            >
              {reviews.map((review) => (
                <li
                  key={review.name}
                  className="box-border shrink-0 border-r border-black/10 px-5 py-6 last:border-r-0 sm:px-6 sm:py-7"
                  style={{ width: `${slideWidth}%` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <img
                        src={review.avatar}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">{review.name}</p>
                        <p className="text-xs text-ink/45">{review.timeAgo}</p>
                      </div>
                    </div>
                    <GoogleMark />
                  </div>
                  <Stars />
                  <p className="mt-3 text-sm leading-relaxed text-ink/80">{review.quote}</p>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            aria-label="Next reviews"
            className="absolute top-1/2 right-0 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/15 bg-white text-lg text-ink shadow-sm transition hover:border-primary hover:text-primary md:flex md:-right-5 lg:-right-6"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  )
}
