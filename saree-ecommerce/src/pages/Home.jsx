import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import ProductCard from "../components/ProductCard"
import VisitStores from "../components/VisitStores"
import { formatPrice, products } from "../data/products"

const photo = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=80`

const charter = [
  {
    title: "Hand-drawn gold",
    text: "Zari is drawn and set by hand. No machine-made substitute enters the border.",
    icon: "hand",
  },
  {
    title: "Silk that breathes",
    text: "Mulberry silk is chosen for lustre and for the way it sits on the body.",
    icon: "silk",
  },
  {
    title: "No synthetic twist",
    text: "The warp stays pure. Tested yarn is refused before it reaches the loom.",
    icon: "pure",
  },
  {
    title: "Heirloom retention",
    text: "A Karanan Puttu saree is woven to be worn, stored, and passed on.",
    icon: "heirloom",
  },
]

const slides = [
  {
    image: photo("1610030469983-98e550d6193c"),
    title: "Buy new silk. Sell your old silk.",
    text: "Shop classic and modern sarees, or turn an old, used, or damaged silk into cash the same day.",
    alt: "A silk saree with a gold border",
  },
  {
    image: photo("1610030469983-98e550d6193c"),
    title: "Gold at the border. Silk at the heart.",
    text: "Kanchipuram weaves with a blouse piece included, ready for the tailor.",
    alt: "A wine silk saree with gold work",
  },
  {
    image: photo("1759738096144-b43206226765"),
    title: "Woven by hand since 1875.",
    text: "The same loom promise: silk that can be named, and zari that is drawn by hand.",
    alt: "A weaver at a traditional handloom",
  },
]

const assurances = [
  {
    title: "Silk mark certified",
    text: "100% genuine mulberry silk",
    icon: "seal",
  },
  {
    title: "Best old saree rates",
    text: "Pure silver and zari melt valued",
    icon: "rupee",
  },
  {
    title: "Doorstep pickup",
    text: "Chennai and nationwide service",
    icon: "truck",
  },
]

const favorites = [
  { name: "Kalamkari cotton saree", to: "/shop?collection=cotton", image: photo("1742677143629-b9784beab2e1") },
  { name: "Semi dola saree", to: "/shop?collection=silk", image: photo("1610030469983-98e550d6193c") },
  { name: "Kalamkari semi silk saree", to: "/shop?collection=silk", image: photo("1692992193981-d3d92fabd9cb") },
  { name: "Semi raw silk saree", to: "/shop?collection=silk", image: photo("1732381917488-39f31539cd4f") },
  { name: "Jaipur cotton saree", to: "/shop?collection=cotton", image: photo("1749317776467-6dcf2bfbd26b") },
  { name: "Banarasi semi crepe saree", to: "/shop?collection=banarasi", image: photo("1594140701076-3400bf982497") },
  { name: "Semi Mysore silk saree", to: "/shop?collection=silk", image: photo("1617627143750-d86bc21e42bb") },
]

const weaves = [
  { label: "Kanchipuram", note: "Korvai silk", to: "/shop?category=Silk", image: photo("1610030469983-98e550d6193c") },
  { label: "Banarasi", note: "Kadhua zari", to: "/shop", image: photo("1594140701076-3400bf982497") },
  { label: "Mysore crepe", note: "Light drape", to: "/shop?category=Silk", image: photo("1617627143750-d86bc21e42bb") },
  { label: "Organza tissue", note: "Sheer gold", to: "/shop", image: photo("1624214390234-2849d6a888c0") },
  { label: "Silk dhotis", note: "Temple wear", to: "/shop?category=Cotton", image: photo("1742677143629-b9784beab2e1") },
  { label: "Old saree resale", note: "Gold valuation", to: "/contact" },
]

const steps = [
  {
    step: "Step 01",
    title: "Share Your Saree Details",
    text: "Share images of your sarees via WhatsApp or call us for an evaluation.",
    image: photo("1610030469983-98e550d6193c"),
  },
  {
    step: "Step 02",
    title: "Get An Instant Price Quote",
    text: "Our experts will assess the silk and offer you the best price.",
    image: photo("1617627143750-d86bc21e42bb"),
  },
  {
    step: "Step 03",
    title: "Schedule Pickup Or Visit Our Store",
    text: "Book a doorstep pickup, or visit a showroom for an instant deal.",
    image: photo("1759738096144-b43206226765"),
  },
  {
    step: "Step 04",
    title: "Get Instant Payment",
    text: "Accept the offer and receive the payment the same day.",
    image: photo("1594140701076-3400bf982497"),
  },
]

export default function Home() {
  const [slide, setSlide] = useState(0)
  const [saved, setSaved] = useState([])
  const [addedId, setAddedId] = useState(null)
  const { addToCart } = useCart()
  const rail = useRef(null)
  const railPaused = useRef(false)
  const heroPaused = useRef(false)
  const current = slides[slide]
  const featured = [6, 2, 3, 7]
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean)
  function savePiece(id) {
    setSaved((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((item) => item !== id)
        : [...currentIds, id],
    )
  }

  function addPiece(id) {
    addToCart(id)
    setAddedId(id)
  }

  function scrollSarees(direction) {
    const node = rail.current
    if (!node) return
    const card = node.querySelector("li")
    const gap = parseFloat(window.getComputedStyle(node).columnGap) || 20
    const step = (card?.offsetWidth || 190) + gap
    const max = node.scrollWidth - node.clientWidth
    if (direction > 0 && node.scrollLeft >= max - 4) return
    const next = Math.min(Math.max(node.scrollLeft + direction * step, 0), max)
    node.scrollTo({ left: next, behavior: "smooth" })
  }

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (media.matches) return undefined
    const timer = window.setInterval(() => {
      if (railPaused.current) return
      scrollSarees(1)
    }, 2800)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (media.matches) return undefined
    const timer = window.setInterval(() => {
      if (heroPaused.current) return
      setSlide((index) => (index + 1) % slides.length)
    }, 4000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <>
      <section
        className="relative h-[84vh] min-h-[520px] md:h-[calc(100vh-7.25rem)] md:min-h-[640px]"
        onMouseEnter={() => {
          heroPaused.current = true
        }}
        onMouseLeave={() => {
          heroPaused.current = false
        }}
      >
        <img
          src={current.image}
          alt={current.alt}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/45 to-ink/10" />
        <div className="relative flex h-full items-center px-6 md:px-16">
          <div className="max-w-xl text-cream">
            <h1 className="font-display text-5xl leading-[1.05] md:text-7xl">
              {current.title}
            </h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-cream/85 md:mt-5 md:text-base">
              {current.text}
            </p>
            <div className="mt-6 flex flex-wrap gap-3 md:mt-8">
              <Link
                to="/shop"
                className="motion-btn motion-fill inline-flex items-center gap-3 rounded-sm bg-primary px-5 py-3 text-xs tracking-[0.14em] text-cream uppercase"
              >
                Buy sarees
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                to="/contact"
                className="motion-btn motion-ghost inline-flex items-center gap-3 rounded-sm border border-cream px-5 py-3 text-xs tracking-[0.14em] text-cream uppercase"
              >
                Sell old silk sarees
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-3">
          {slides.map((item, index) => (
            <button
              key={item.title}
              type="button"
              aria-label={`Show slide ${index + 1}`}
              aria-current={index === slide}
              onClick={() => setSlide(index)}
              className={`h-3 w-3 rounded-full border-2 border-white ${
                index === slide ? "bg-white" : "bg-transparent"
              }`}
            />
          ))}
        </div>
      </section>

      <section className="bg-[#f6efe4]">
        <ul className="mx-auto grid max-w-5xl gap-8 px-4 py-8 sm:grid-cols-3">
          {assurances.map((item) => (
            <li key={item.title} className="flex items-center justify-center gap-3 text-left">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-secondary/80 text-secondary">
                <AssuranceIcon name={item.icon} />
              </span>
              <span>
                <span className="block text-[11px] font-medium tracking-[0.14em] text-ink uppercase">
                  {item.title}
                </span>
                <span className="mt-0.5 block text-xs text-ink/60">{item.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="bg-[#f6efe4] px-4 py-12"
        onMouseEnter={() => {
          railPaused.current = true
        }}
        onMouseLeave={() => {
          railPaused.current = false
        }}
      >
        <div className="relative mx-auto max-w-6xl">
          <button
            type="button"
            onClick={() => scrollSarees(-1)}
            aria-label="Previous sarees"
            className="motion-arrow absolute top-[38%] left-0 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-white text-ink shadow"
          >
            ‹
          </button>
          <ul
            ref={rail}
            className="arch-rail flex gap-5 overflow-x-auto scroll-smooth px-12"
          >
            {products.map((product) => (
              <li key={product.id} className="w-[190px] shrink-0">
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => scrollSarees(1)}
            aria-label="Next sarees"
            className="motion-arrow absolute top-[38%] right-0 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-white text-ink shadow"
          >
            ›
          </button>
        </div>
      </section>

      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-[11px] tracking-[0.22em] text-[#8a6230] uppercase">
            Handcrafted disciplines
          </p>
          <h2 className="mt-2 text-center font-display text-4xl text-ink">
            Explore by handloom weave
          </h2>
          <ul className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-6">
            {weaves.map((weave) => (
              <li key={weave.label}>
                <Link to={weave.to} className="flex flex-col items-center text-center">
                  {weave.image ? (
                    <img
                      src={weave.image}
                      alt=""
                      className="motion-circle h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <span className="motion-circle flex h-20 w-20 items-center justify-center rounded-full border border-secondary text-2xl text-secondary">
                      ₹
                    </span>
                  )}
                  <span className="mt-3 text-sm text-ink">{weave.label}</span>
                  <span className="text-[11px] text-ink/50">{weave.note}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-16 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] tracking-[0.2em] text-[#8a6230] uppercase">
                Atelier loom archive
              </p>
              <h2 className="mt-2 font-display text-4xl text-ink">
                Curated bridal & handloom masterpieces
              </h2>
            </div>
            <p className="max-w-xs text-sm text-ink/60">
              Each draped piece holds verified silk mark certification.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {featured.map((product) => (
              <article key={product.id} className="group">
                <div className="arch-photo">
                  <Link to={`/product/${product.id}`}>
                    <img src={product.image} alt={product.name} />
                  </Link>
                  <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-secondary px-3 py-1 text-[11px] font-medium whitespace-nowrap text-ink">
                    {product.offer || product.badge}
                  </span>
                  <button
                    type="button"
                    aria-label={saved.includes(product.id) ? "Remove from saved" : "Save saree"}
                    onClick={() => savePiece(product.id)}
                    className="motion-icon absolute top-[46%] right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary hover:bg-cream"
                  >
                    {saved.includes(product.id) ? "♥" : "♡"}
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-2xl leading-tight text-ink">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                  </h3>
                  <p className="mt-1 text-xs text-ink/55">{product.line}</p>
                  <p className="mt-3 text-sm">
                    {product.compareAt && (
                      <span className="mr-2 text-ink/40 line-through">
                        {formatPrice(product.compareAt)}
                      </span>
                    )}
                    <span className="font-medium text-primary">
                      {formatPrice(product.price)}
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={() => addPiece(product.id)}
                    className="motion-btn motion-line mt-4 w-full border border-primary py-2.5 text-[11px] tracking-[0.16em] text-primary uppercase"
                  >
                    {addedId === product.id ? "Added to bag" : "Add to bag"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#6b2d32] px-4 py-16 text-[#f7f1e8]">
        <div className="mx-auto max-w-5xl text-center">
          <p className="font-display text-2xl text-[#d7c4a2] md:text-4xl">
            Turn Your Old Silk Sarees Into Instant Cash!
          </p>
          <h2 className="mt-6 font-display text-4xl leading-[1.15] md:text-6xl">
            We Buy Old, Used & Damaged Silk Sarees At The Best Price
          </h2>
        </div>
        <div className="mx-auto mt-12 grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="text-center lg:text-left">
            <p className="text-sm leading-7 text-[#f7f1e8]/80">
              Torn borders, faded zari, and sarees you no longer wear are welcome.
              We check the silk and pay the best price the same day.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link
                to="/contact"
                className="motion-btn motion-gold bg-[#d7c4a2] px-4 py-3 text-[11px] tracking-[0.14em] text-[#3a1216] uppercase"
              >
                Get the best price
              </Link>
              <a
                href="https://wa.me/917200016300"
                className="motion-btn motion-ghost border border-[#f7f1e8]/40 px-4 py-3 text-[11px] tracking-[0.14em] uppercase"
              >
                WhatsApp the desk
              </a>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Old, used or damaged", "We buy silk sarees in any condition, including torn and faded pieces."],
              ["Instant cash", "Once the saree is checked, the amount is paid the same day."],
              ["Best price", "Silk and zari are valued before a rate is offered."],
              ["Free doorstep pickup", "We collect the saree from your home across the city."],
            ].map(([title, text]) => (
              <article key={title} className="motion-card border border-[#d7c4a2]/30 bg-[#5a2429] p-4 text-left">
                <h3 className="text-sm text-[#d7c4a2]">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-[#f7f1e8]/75">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-xs tracking-[0.28em] text-[#c59b27] uppercase">
            — How it works —
          </p>
          <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">
            Our Working Process
          </h2>
          <ol className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {steps.map((item, index) => (
              <li key={item.step} className={index % 2 === 1 ? "lg:mt-16" : ""}>
                <div className="mx-auto h-36 w-36 overflow-hidden rounded-full border-4 border-[#c59b27] p-1">
                  <img
                    src={item.image}
                    alt=""
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
                <div className="relative mx-auto -mt-5 flex h-12 w-48 items-center justify-center">
                  <span
                    className="absolute inset-0 border-2 border-[#c59b27] bg-[#fffaf3]"
                    style={{ clipPath: "polygon(8% 0, 90% 0, 100% 50%, 90% 100%, 8% 100%, 0 50%)" }}
                    aria-hidden="true"
                  />
                  <span className="relative rounded-full bg-primary px-3 py-1 text-[10px] tracking-[0.12em] text-cream uppercase">
                    {item.step}
                  </span>
                </div>
                <h3 className="mx-auto mt-4 max-w-[14rem] font-display text-2xl leading-tight text-[#b8882d]">
                  {item.title}
                </h3>
                <p className="mx-auto mt-2 max-w-[16rem] text-sm leading-6 text-ink/55">
                  {item.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-[#f6efe4] px-4 py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
          <figure className="relative">
            <img
              src={photo("1617627143750-d86bc21e42bb")}
              alt="A silk saree worn in a temple corridor"
              className="h-[520px] w-full rounded-2xl object-cover"
            />
            <figcaption className="absolute bottom-4 left-4 rounded-xl bg-[#3a0c14] px-4 py-3 text-cream">
              <p className="font-display text-3xl">150 years</p>
              <p className="text-xs text-cream/75">22 karat handloom zari, still guaranteed</p>
            </figcaption>
          </figure>
          <div>
            <p className="text-[11px] tracking-[0.2em] text-[#8a6230] uppercase">
              A Kanchipuram legacy since 1875
            </p>
            <h2 className="mt-3 font-display text-4xl leading-tight text-ink md:text-5xl">
              Six generations devoted to the art of sacred handloom silk
            </h2>
            <p className="mt-5 text-sm leading-7 text-ink/75">
              Founded in the sacred temple corridors of South India in 1875,
              Karnan Pattu Centre began with three promises: unmixed silk,
              tested zari, and drapes for temple patronage and temple brides.
            </p>
            <p className="mt-4 text-sm leading-7 text-ink/75">
              Today the same house still melts old pattu honestly and weaves
              new silk for the next generation. A heritage drape that leaves
              our counter is a ceremony in itself.
            </p>
            <dl className="mt-8 grid grid-cols-3 gap-4">
              {[
                ["1875", "The first loom"],
                ["450+", "Weaver families"],
                ["100%", "Zari tested"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="font-display text-3xl text-primary">{value}</dt>
                  <dd className="text-xs text-ink/60">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section id="charter" className="border-y border-secondary/30 bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
          <p className="text-center text-[11px] tracking-[0.24em] text-secondary uppercase">
            The standard
          </p>
          <h2 className="mt-3 text-center font-display text-4xl text-primary md:text-5xl">
            The Karanan purity charter
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {charter.map((item) => (
              <article key={item.title} className="motion-card border border-secondary/30 bg-paper p-6 text-center">
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-secondary text-secondary">
                  <CharterIcon name={item.icon} />
                </span>
                <h3 className="mt-4 font-display text-2xl text-primary">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-ink/75">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f1e8] px-4 py-14 lg:px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-display text-4xl text-primary md:text-5xl">
            Timeless Favorites
          </h2>
          <ul className="arch-rail mt-8 flex gap-3 overflow-x-auto pb-2">
            {favorites.map((item) => (
              <li key={item.name} className="w-40 shrink-0 sm:w-44">
                <Link to={item.to} className="group relative block h-72 overflow-hidden rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <span className="absolute inset-x-0 bottom-0 flex items-end gap-2 bg-gradient-to-t from-black/75 to-transparent px-3 pt-10 pb-3 text-[10px] leading-4 tracking-[0.08em] text-white uppercase">
                    <span>{item.name}</span>
                    <span className="mb-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-white text-[9px]">
                      i
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="bg-white px-4 py-12">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-ink/10 bg-paper p-8">
            <p className="text-[11px] tracking-[0.22em] text-secondary uppercase">Buy</p>
            <h2 className="mt-3 font-display text-3xl text-primary">Buy a new saree</h2>
            <p className="mt-3 text-sm leading-7 text-ink/75">
              Classic and modern silks for weddings, temples, and the week. Every drape includes a blouse piece.
            </p>
            <Link
              to="/shop"
              className="motion-btn motion-fill mt-6 inline-block bg-primary px-5 py-3 text-[11px] tracking-[0.14em] text-cream uppercase"
            >
              Buy sarees
            </Link>
          </article>
          <article className="rounded-2xl bg-primary p-8 text-cream">
            <p className="text-[11px] tracking-[0.22em] text-secondary uppercase">Sell</p>
            <h2 className="mt-3 font-display text-3xl">Sell your old silk</h2>
            <p className="mt-3 text-sm leading-7 text-cream/80">
              We buy old, used, and damaged silk sarees at the best price. Send a photo or visit a showroom and get paid the same day.
            </p>
            <Link
              to="/contact"
              className="motion-btn motion-gold mt-6 inline-block bg-secondary px-5 py-3 text-[11px] tracking-[0.14em] text-ink uppercase"
            >
              Sell old silk
            </Link>
          </article>
        </div>
      </section>
      <VisitStores />
    </>
  )
}

function CharterIcon({ name }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "h-5 w-5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  }

  if (name === "hand") {
    return (
      <svg {...common}>
        <path d="M8 11V6.5a1.5 1.5 0 0 1 3 0V11" />
        <path d="M11 10.5V5.5a1.5 1.5 0 0 1 3 0V11" />
        <path d="M14 10V7.5a1.5 1.5 0 0 1 3 0V14c0 3.2-2.2 5.5-5.2 5.5h-.6C8.5 19.5 7 18 6 16.2L4.2 13a1.4 1.4 0 0 1 2.4-1.5L8 13" />
      </svg>
    )
  }

  if (name === "silk") {
    return (
      <svg {...common}>
        <path d="M3 8c2.2 2 4.2 2 6.4 0S13.6 6 16 8s4.2 2 5 0" />
        <path d="M3 12c2.2 2 4.2 2 6.4 0S13.6 10 16 12s4.2 2 5 0" />
        <path d="M3 16c2.2 2 4.2 2 6.4 0S13.6 14 16 16s4.2 2 5 0" />
      </svg>
    )
  }

  if (name === "pure") {
    return (
      <svg {...common}>
        <path d="M8 4v10" />
        <path d="M16 4v10" />
        <path d="M6 18h12" />
        <path d="M9 11l2.2 2.2L16 8" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <path d="M4 9h16v10H4z" />
      <path d="M4 13h16" />
      <path d="M12 9v10" />
      <path d="M8 9c0-2.2 8-2.2 8 0" />
    </svg>
  )
}

function AssuranceIcon({ name }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "h-5 w-5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    "aria-hidden": true,
  }

  if (name === "rupee") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" />
        <path d="M9 9h6M9 12h6M12 9c1.5 0 2.5.8 2.5 2S13.5 13 12 13l-3 4" />
      </svg>
    )
  }

  if (name === "truck") {
    return (
      <svg {...common}>
        <path d="M3 7h11v8H3z" />
        <path d="M14 10h4l3 3v2h-7" />
        <circle cx="7" cy="17" r="1.4" />
        <circle cx="17" cy="17" r="1.4" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <circle cx="12" cy="10" r="5" />
      <path d="M9 14.5 8 20l4-2 4 2-1-5.5" />
    </svg>
  )
}
