import { Link } from "react-router-dom"
import { storePhone, storePhoneLabel, stores } from "../data/locations"

export default function Locations() {
  return (
    <div className="w-full min-w-0 overflow-x-clip">
      <section className="relative flex min-h-[320px] items-center overflow-hidden bg-[#210a0c] sm:min-h-[380px]">
        <img
          src="/hero/image.avif"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#210a0c]/85" aria-hidden="true" />
        <div className="site-container relative z-10 py-16 text-center text-[#f7f1e8]">
          <p className="text-xs tracking-[0.16em] text-[#f7f1e8]/80 uppercase">
            <Link to="/" className="transition-colors duration-300 hover:text-[#d7c4a2]">
              Home
            </Link>
            <span className="mx-2 text-[#d7c4a2]">/</span>
            Our Locations
          </p>
          <h1 className="mt-4 font-display text-5xl font-bold tracking-wide text-[#faf6f0] md:text-7xl">
            Our Locations
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#f7f1e8]/85 md:text-base">
            Visit Karnan Pattu Centre at our three Bengaluru locations. For assistance, call {storePhoneLabel}.
          </p>
          <span className="mx-auto mt-6 block h-px w-16 bg-[#d7c4a2]" />
        </div>
      </section>

      <section className="py-16 text-[#4a0e17] md:py-24">
        <div className="site-container min-w-0">
          <div className="text-center" data-slide="up">
            <p className="text-[11px] font-semibold tracking-[0.24em] text-[#4a0e17]/80 uppercase">
              Visit Our Stores
            </p>
            <h2 className="mt-2 font-display text-4xl font-bold text-[#4a0e17] md:text-5xl">
              Three Locations in Bengaluru
            </h2>
          </div>

          <ul className="mt-12 grid min-w-0 grid-cols-1 gap-8 md:grid-cols-2">
            {stores.map((store, index) => {
              const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(store.address)}`
              const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(store.address)}&output=embed`

              return (
                <li
                  key={store.name}
                  className="flex min-w-0 flex-col justify-between border border-[#4a0e17]/10 bg-[#fdf8f4] p-6 shadow-md"
                  data-slide={index % 2 === 0 ? "left" : "right"}
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-display text-xl font-bold text-[#4a0e17]">{store.name}</h3>
                      <span className="text-xs tracking-widest text-[#4a0e17]/70 uppercase">
                        Bengaluru
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#4a0e17]/90">{store.address}</p>
                    <a
                      className="mt-2 inline-block text-xs font-medium text-[#4a0e17] underline underline-offset-2"
                      href={`tel:${storePhone}`}
                    >
                      Call: {storePhoneLabel}
                    </a>
                  </div>

                  <div className="mt-6 flex flex-col gap-3">
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-fit items-center gap-1.5 bg-[#4a0e17] px-3 py-2 text-[11px] font-semibold tracking-wider text-[#faf6f0] uppercase transition-colors duration-300 hover:bg-[#6b1a26]"
                    >
                      Get Directions <span aria-hidden="true" className="text-xs">↗</span>
                    </a>
                    <div className="h-[220px] overflow-hidden border border-[#4a0e17]/20">
                      <iframe
                        src={mapEmbedUrl}
                        className="h-full w-full border-0"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"
                        title={`Map to Karnan Pattu Centre, ${store.name}`}
                      />
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </div>
  )
}
