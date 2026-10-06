const storePhoto = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`

const stores = [
  {
    city: "Chennai",
    name: "T. Nagar",
    address: "T. Nagar showroom, Chennai. Silk is shown by appointment in daylight.",
    query: "T Nagar Chennai",
    image: storePhoto("1610030469983-98e550d6193c"),
  },
  {
    city: "Chennai",
    name: "Velachery",
    address: "Velachery showroom, Chennai. Bridal silks and old pattu valuation.",
    query: "Velachery Chennai",
    image: storePhoto("1617627143750-d86bc21e42bb"),
  },
  {
    city: "Bengaluru",
    name: "Jayanagar",
    address: "Jayanagar showroom, Bengaluru. Handloom silk and temple borders.",
    query: "Jayanagar Bengaluru",
    image: storePhoto("1759738096144-b43206226765"),
  },
]

export default function VisitStores() {
  return (
    <section className="bg-[#f7f1e8] px-4 py-16 text-center">
      <p className="mx-auto w-fit rounded-full bg-white px-4 py-1.5 text-[10px] tracking-[0.18em] text-primary uppercase shadow-sm">
        6 showrooms across South India
      </p>
      <h2 className="mt-4 font-display text-4xl text-primary md:text-5xl">Visit Our Stores</h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-ink/60">
        For an enriching shopping experience — across Chennai, Bengaluru, Coimbatore, Madurai & Karaikudi.
      </p>
      <ul className="mx-auto mt-10 grid max-w-6xl gap-6 text-left md:grid-cols-3">
        {stores.map((store) => (
          <li key={store.name} className="motion-card border border-ink/10 bg-white p-3 text-left shadow-sm">
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={store.image}
                alt={`${store.name} showroom`}
                className="motion-zoom aspect-[16/10] w-full object-cover"
              />
              <span className="absolute top-3 left-3 rounded-full bg-white px-2.5 py-1 text-[10px] tracking-[0.14em] text-primary uppercase">
                {store.city}
              </span>
            </div>
            <h3 className="mt-4 font-display text-2xl text-primary">{store.name}</h3>
            <p className="mt-2 min-h-12 text-sm leading-6 text-ink/65">{store.address}</p>
            <div className="mt-4 flex gap-2">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.query)}`}
                target="_blank"
                rel="noreferrer"
                className="motion-btn motion-fill flex flex-1 items-center justify-center gap-2 bg-primary px-3 py-2.5 text-xs text-cream"
              >
                Get Directions
              </a>
              <a
                href="tel:+917200016300"
                className="motion-btn motion-line flex items-center justify-center gap-2 border border-primary px-4 py-2.5 text-xs text-primary"
              >
                Call
              </a>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
