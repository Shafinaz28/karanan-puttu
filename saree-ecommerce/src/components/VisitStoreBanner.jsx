import { Link } from "react-router-dom"

const bannerSrc = "/hero/visit-store-banner.png"

export default function VisitStoreBanner() {
  return (
    <section
      className="site-section w-full max-w-full overflow-x-clip bg-[#3a1216]"
      aria-label="Visit our showrooms"
    >
      <Link
        to="/locations"
        className="block w-full max-w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
      >
        <div className="relative h-[240px] w-full max-w-full overflow-hidden sm:h-[280px] md:h-[320px] lg:h-[360px]">
          <img
            src={bannerSrc}
            alt="Handcrafted elegance, woven in India — visit Karnan Pattu Centre showrooms in Bengaluru"
            width={1024}
            height={384}
            decoding="async"
            className="absolute inset-0 h-full w-full max-w-none object-cover object-left object-top"
          />
        </div>
      </Link>
    </section>
  )
}
