import { Link } from "react-router-dom"
import { sareeImages } from "../data/products"
import { storePhone, storePhoneLabel, stores } from "../data/locations"

export default function VisitStores({ preview = false }) {
  return (
    <section className="bg-[#f7f1e8] py-16 text-center">
      <div className="site-container">
      <p className="mx-auto w-fit rounded-full bg-white px-4 py-1.5 text-[10px] tracking-[0.18em] text-primary uppercase shadow-sm">
        3 shops in Bengaluru
      </p>
      <h2 className="mt-4 font-display text-4xl text-primary md:text-5xl">Visit Our Stores</h2>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-ink/60">
        V.V. Puram and Jayanagar. Call the desk on {storePhoneLabel}.
      </p>
      <ul className="mt-10 grid items-stretch gap-6 text-left md:grid-cols-2">
        {stores.map((store, index) => (
          <li
            key={store.name}
            className={`motion-card flex flex-col border border-ink/10 bg-white p-3 text-left shadow-sm ${
              preview && index > 1 ? "max-md:hidden" : ""
            }`}
          >
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={sareeImages[store.imageIndex]}
                alt={`${store.name} showroom`}
                className="motion-zoom aspect-[16/10] w-full object-cover"
              />
              <span className="absolute top-3 left-3 rounded-full bg-white px-2.5 py-1 text-[10px] tracking-[0.14em] text-primary uppercase">
                {store.city}
              </span>
            </div>
            <h3 className="mt-4 font-display text-2xl text-primary">{store.name}</h3>
            <p className="mt-2 flex-1 text-sm leading-6 text-ink/65">{store.address}</p>
            <div className="mt-4 flex gap-2">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`}
                target="_blank"
                rel="noreferrer"
                className="motion-btn motion-fill flex flex-1 items-center justify-center gap-2 bg-primary px-3 py-2.5 text-xs text-cream"
              >
                Get Directions
              </a>
              <a
                href={`tel:${storePhone}`}
                className="motion-btn motion-line flex items-center justify-center gap-2 border border-primary px-4 py-2.5 text-xs text-primary"
              >
                Call
              </a>
            </div>
          </li>
        ))}
      </ul>
      {preview && (
        <Link
          to="/locations"
          className="motion-btn motion-fill mt-8 inline-flex items-center gap-2 bg-primary px-6 py-3 text-xs tracking-[0.14em] text-cream uppercase md:hidden"
        >
          View all locations
          <span aria-hidden="true">→</span>
        </Link>
      )}
      </div>
    </section>
  )
}
