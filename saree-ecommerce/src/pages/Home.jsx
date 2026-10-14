import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import ProductCard from "../components/ProductCard"
import { formatPrice, products, sareeImages } from "../data/products"

const photo = (index) => sareeImages[index]

const galleryLayout = [
  "md:col-span-1 md:row-span-2",
  "md:col-span-2 md:row-span-2",
  "md:col-span-1 md:row-span-2",
  "md:col-span-2 md:row-span-2",
  "md:col-span-1 md:row-span-2",
  "md:col-span-1 md:row-span-2",
  "md:col-span-2 md:row-span-2",
  "md:col-span-1 md:row-span-2",
  "md:col-span-1 md:row-span-2",
  "md:col-span-2 md:row-span-2",
  "md:col-span-2 md:row-span-2",
]

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

const hero = {
  image: "/hero/temple.jpg",
  title: "We buy old silk sarees.",
  text: "Used, torn, or faded pattu is welcome. We check the silk and the zari, then pay the best price the same day.",
  alt: "A maroon silk saree worn at a temple",
}

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
    text: "Bengaluru doorstep pickup",
    icon: "truck",
  },
]

const weaves = [
  { label: "Kanchipuram", note: "Korvai silk", to: "/shop?category=Silk", image: photo(1) },
  { label: "Banarasi", note: "Kadhua zari", to: "/shop?collection=banarasi", image: photo(2) },
  { label: "Mysore crepe", note: "Light drape", to: "/shop?category=Silk", image: photo(4) },
  { label: "Organza tissue", note: "Sheer gold", to: "/shop?collection=party", image: photo(3) },
  { label: "Temple border", note: "Gold edge", to: "/shop?collection=traditional", image: photo(5) },
  { label: "Old saree resale", note: "Gold valuation", to: "/contact" },
]

const oldSilks = [
  {
    name: "Old and used pure silk",
    text: "Worn silk is welcome. The body and the border are checked before a price is named.",
    image: photo(0),
  },
  {
    name: "Banarasi silk",
    text: "Kadhua and tissue Banarasi, faded or still bright. The zari is part of the rate.",
    image: photo(2),
  },
  {
    name: "Brocade",
    text: "Heavy brocade and split pallus are taken in. The weave is looked at in daylight.",
    image: photo(10),
  },
  {
    name: "Kanjivaram silk",
    text: "Korvai and temple borders from Kanchipuram, including pieces with tired zari.",
    image: photo(1),
  },
  {
    name: "Antique silk",
    text: "Older heirloom drapes are checked for the handwork that is still on the cloth.",
    image: photo(5),
  },
  {
    name: "Mysore silk",
    text: "Plain and crepe Mysore silk, light or heavy, folded away or already worn.",
    image: photo(7),
  },
  {
    name: "Tussar silk",
    text: "Tussar with a soft gold or a plain body. Stains and small tears do not rule it out.",
    image: photo(8),
  },
  {
    name: "Tissue sarees",
    text: "Gold and silver tissue, even when a panel has caught or the edge has frayed.",
    image: photo(4),
  },
]

const steps = [
  {
    step: "Step 01",
    title: "Share Your Saree Details",
    text: "Share images of your sarees via WhatsApp or call us for an evaluation.",
    image: photo(8),
  },
  {
    step: "Step 02",
    title: "Get An Instant Price Quote",
    text: "Our experts will assess the silk and offer you the best price.",
    image: photo(9),
  },
  {
    step: "Step 03",
    title: "Schedule Pickup Or Visit Our Store",
    text: "Book a doorstep pickup, or visit a showroom for an instant deal.",
    image: photo(10),
  },
  {
    step: "Step 04",
    title: "Get Instant Payment",
    text: "Accept the offer and receive the payment the same day.",
    image: photo(7),
  },
]

export default function Home() {
  const [saved, setSaved] = useState([])
  const [addedId, setAddedId] = useState(null)
  const { addToCart } = useCart()
  const rail = useRef(null)
  const railPaused = useRef(false)
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

  return (
    <>
      <section className="relative h-[500px] overflow-hidden sm:h-[560px] md:h-[640px]">
        <img
          src={hero.image}
          alt={hero.alt}
          className="absolute inset-0 h-full w-full object-cover object-[center_14%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a080e_0%,rgba(42,8,14,0.92)_22%,rgba(42,8,14,0.72)_42%,rgba(42,8,14,0.28)_62%,transparent_78%)]" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
            <div className="max-w-xl text-left text-[#f7f1e8]">
              <h1 className="font-display text-3xl leading-[1.05] text-[#f7f1e8] sm:text-5xl md:text-6xl">
                {hero.title}
              </h1>
              <p className="mt-3 max-w-md text-xs leading-5 text-[#f7f1e8]/85 sm:mt-4 sm:text-sm sm:leading-7 md:text-base">
                {hero.text}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3 md:mt-8">
              <Link
                to="/shop"
                className="motion-btn motion-gold inline-flex items-center gap-3 border-0 bg-secondary px-4 py-2.5 text-[10px] tracking-[0.14em] text-ink uppercase sm:px-5 sm:py-3 sm:text-xs"
                style={{ borderRadius: 0 }}
              >
                Buy sarees
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                to="/contact"
                className="motion-btn inline-flex items-center gap-3 border-2 border-[#f7f1e8] px-4 py-2.5 text-[10px] tracking-[0.14em] text-[#f7f1e8] uppercase hover:bg-[#f7f1e8] hover:text-[#4a0e17] sm:px-5 sm:py-3 sm:text-xs"
                style={{ borderRadius: 0, borderColor: "#f7f1e8" }}
              >
                Old sarees buying
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                to="/locations"
                className="motion-btn inline-flex items-center gap-3 border-2 border-[#f7f1e8] px-4 py-2.5 text-[10px] tracking-[0.14em] text-[#f7f1e8] uppercase hover:bg-[#f7f1e8] hover:text-[#4a0e17] sm:px-5 sm:py-3 sm:text-xs"
                style={{ borderRadius: 0, borderColor: "#f7f1e8" }}
              >
                Visit our stores
                <span aria-hidden="true">→</span>
              </Link>
            </div>
            </div>
          </div>
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
        className="bg-cream px-4 py-12"
        onMouseEnter={() => {
          railPaused.current = true
        }}
        onMouseLeave={() => {
          railPaused.current = false
        }}
      >
        <ul
          ref={rail}
          className="arch-rail square-rail mx-auto flex w-full snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth md:max-w-6xl md:gap-5"
        >
          {products.map((product) => (
            <li key={product.id} className="w-[calc(50%-0.375rem)] shrink-0 snap-start md:w-[calc(25%-0.9375rem)] lg:w-[calc(20%-1rem)]">
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-display text-3xl text-primary md:text-5xl">
            Old sarees we buy
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-6 text-ink/70">
            Bring pure silk that is used, stored, or damaged. Each piece is checked for the weave and the zari, then paid the same day.
          </p>
          <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {oldSilks.map((item) => (
              <li key={item.name}>
                <Link
                  to="/contact"
                  className="motion-card block overflow-hidden rounded-md border-2 border-[#c48a3a] bg-[#c48a3a]"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="px-3 py-3 text-[#3a2410] md:px-4 md:py-4">
                    <h3 className="font-display text-sm leading-tight md:text-lg">{item.name}</h3>
                    <p className="mt-1 text-[11px] leading-5 md:text-xs">{item.text}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[#f6efe4] px-4 py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div className="relative mx-auto w-full max-w-md">
            <span
              className="absolute top-8 -left-2 hidden h-28 w-16 bg-[radial-gradient(circle,#c59b27_1.2px,transparent_1.4px)] bg-[length:12px_12px] opacity-70 sm:block"
              aria-hidden="true"
            />
            <div className="relative mb-10 mr-auto w-[78%] sm:mr-0 sm:mb-12 sm:ml-auto sm:w-[78%]">
              <img
                src="/hero/gold-saree.png"
                alt="A gold silk saree worn on temple steps"
                className="h-[420px] w-full rounded-sm object-cover object-top shadow-sm sm:h-[460px]"
              />
              <div className="absolute right-0 bottom-0 translate-x-1/2 translate-y-1/2 bg-[#c48a3a] px-4 py-3 text-white shadow-md sm:px-5 sm:py-4">
                <p className="font-display text-3xl leading-none sm:text-4xl">30+</p>
                <p className="mt-1 text-xs tracking-wide">Years of experience</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-[#c48a3a]">
              — Welcome to Karnan Pattu Centre
            </p>
            <h2 className="mt-3 font-display text-4xl leading-tight text-[#4a0e17] md:text-5xl">
              Old silk saree buyers in Bengaluru
            </h2>
            <p className="mt-5 text-sm font-medium text-ink">
              Old silk saree buyers in Bengaluru
            </p>
            <p className="mt-3 text-sm leading-7 text-ink/75">
              Karnan Pattu Centre buys old silk sarees at V.V. Puram and Jayanagar. Kanjivaram, Mysore, tissue, and brocade are welcome in any condition. We collect from your door and pay a fair cash price.
            </p>
            <p className="mt-4 text-sm leading-7 text-ink/75">
              A silk saree can leave the cupboard and still hold its value. Unused, worn, or damaged, it is checked for the weave and the zari before a rate is named.
            </p>
            <h3 className="mt-6 text-base font-semibold text-ink">
              Sell old silk sarees in Bengaluru
            </h3>
            <p className="mt-3 text-sm leading-7 text-ink/75">
              Share clear photos, the fabric, and the condition. We tell you the price before you agree, and the amount is paid the same day once the saree is checked.
            </p>
            <p className="mt-4 text-sm leading-7 text-ink/75">
              Call Chandramuki, or bring the saree to the shop. Gold shows best in daylight.
            </p>
            <Link
              to="/contact"
              className="motion-btn motion-fill mt-8 inline-flex items-center gap-2 bg-primary px-6 py-3 text-xs tracking-[0.14em] text-cream uppercase"
            >
              Get a price
              <span aria-hidden="true">→</span>
            </Link>
          </div>
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

          <div className="square-rail mt-8 grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-4">
            {featured.map((product) => (
              <article key={product.id} className="group">
                <div className="arch-photo">
                  <Link to={`/product/${product.id}`}>
                    <img src={product.image} alt={product.name} />
                  </Link>
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-secondary px-2 py-0.5 text-[9px] font-medium whitespace-nowrap text-ink md:bottom-3 md:px-3 md:py-1 md:text-[11px]">
                    {product.offer || product.badge}
                  </span>
                  <button
                    type="button"
                    aria-label={saved.includes(product.id) ? "Remove from saved" : "Save saree"}
                    onClick={() => savePiece(product.id)}
                    className="motion-icon absolute top-[46%] right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm text-primary hover:bg-cream md:right-3 md:h-8 md:w-8"
                  >
                    {saved.includes(product.id) ? "♥" : "♡"}
                  </button>
                </div>
                <div className="p-2 md:p-4">
                  <h3 className="font-display text-sm leading-tight text-ink md:text-2xl">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                  </h3>
                  <p className="mt-1 line-clamp-2 text-[11px] text-ink/55 md:text-xs">{product.line}</p>
                  <p className="mt-2 text-xs md:mt-3 md:text-sm">
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
                    className="motion-btn motion-line mt-3 w-full border border-primary py-2 text-[9px] tracking-[0.12em] text-primary uppercase md:mt-4 md:py-2.5 md:text-[11px] md:tracking-[0.16em]"
                  >
                    {addedId === product.id ? "Added to bag" : "Add to bag"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#6b2d32] py-16 text-[#f7f1e8]">
        <img
          src="/hero/family-saree.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#6b2d32]/75" />
        <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
          <div className="text-center">
            <p className="font-display text-2xl text-[#d7c4a2] md:text-4xl">
              Turn Your Old Silk Sarees Into Instant Cash!
            </p>
            <h2 className="mx-auto mt-4 max-w-4xl font-display text-4xl leading-[1.15] md:text-5xl">
              We Buy Old, Used & Damaged Silk Sarees At The Best Price
            </h2>
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-7 text-[#f7f1e8]/80">
            Torn borders, faded zari, and sarees you no longer wear are welcome.
            We check the silk and pay the best price the same day.
          </p>
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 items-stretch gap-3">
            {[
              ["Old, used or damaged", "We buy silk sarees in any condition, including torn and faded pieces."],
              ["Instant cash", "Once the saree is checked, the amount is paid the same day."],
              ["Best price", "Silk and zari are valued before a rate is offered."],
              ["Free doorstep pickup", "We collect the saree from your home across the city."],
            ].map(([title, text]) => (
              <article key={title} className="motion-card flex h-full flex-col border border-[#d7c4a2]/30 bg-[#5a2429] p-4 text-left">
                <h3 className="min-h-10 text-sm leading-5 text-[#d7c4a2]">{title}</h3>
                <p className="mt-2 flex-1 text-xs leading-5 text-[#f7f1e8]/75">{text}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/contact"
              className="motion-btn motion-gold inline-flex min-w-44 items-center justify-center bg-[#d7c4a2] px-4 py-3 text-center text-[11px] tracking-[0.14em] text-[#3a1216] uppercase"
            >
              Get the best price
            </Link>
            <a
              href="https://wa.me/917200016300"
              className="motion-btn motion-ghost inline-flex min-w-44 items-center justify-center border border-[#f7f1e8]/70 px-4 py-3 text-center text-[11px] tracking-[0.14em] uppercase"
            >
              WhatsApp the desk
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[#fbf7f1] px-4 py-16">
        <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:pt-2">
            <p className="text-[11px] tracking-[0.22em] text-[#c48a3a] uppercase">
              Our promise
            </p>
            <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">
              Why choose us
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-ink/70">
              We buy old silk and sell new silk in Bengaluru. The saree is checked first, the price is told before you agree, and the money is paid the same day.
            </p>
          </div>
          <ol className="border-y border-[#ead9bf]">
            {[
              ["check", "A careful check", "Silk and zari are looked at in daylight before a rate is offered."],
              ["price", "A clear price", "You hear the amount first. Nothing is settled until you accept."],
              ["cash", "Same-day cash", "Once the saree is checked and you agree, the payment is made that day."],
              ["silk", "Any condition", "Old, used, torn, and faded silk is welcome, including Kanjivaram and Banarasi."],
            ].map(([icon, title, text]) => (
              <li key={title} className="grid grid-cols-[3rem_1fr] items-start gap-4 border-b border-[#ead9bf] py-5 last:border-b-0">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#c48a3a] text-white">
                  <PromiseIcon name={icon} />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-primary">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-ink/65">{text}</p>
                </div>
              </li>
            ))}
          </ol>
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
          <ol className="mt-14 grid items-start gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {steps.map((item) => (
              <li key={item.step} className="flex flex-col items-center text-center">
                <div className="h-36 w-36 overflow-hidden rounded-full border-4 border-[#c59b27] p-1">
                  <img
                    src={item.image}
                    alt=""
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
                <div className="relative -mt-5 flex h-12 w-44 items-center justify-center">
                  <span
                    className="absolute inset-0 border-2 border-[#c59b27] bg-[#fffaf3]"
                    style={{ clipPath: "polygon(8% 0, 92% 0, 100% 50%, 92% 100%, 8% 100%, 0 50%)" }}
                    aria-hidden="true"
                  />
                  <span className="relative rounded-full bg-primary px-3 py-1 text-[10px] tracking-[0.12em] text-cream uppercase">
                    {item.step}
                  </span>
                </div>
                <h3 className="mt-4 flex min-h-[5.7rem] max-w-[14rem] items-start justify-center font-display text-2xl leading-tight text-[#b8882d]">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-[16rem] text-sm leading-6 text-ink/55">
                  {item.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <img
          src={photo(10)}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#8a1f2a]/80" />
        <ul className="relative mx-auto grid max-w-6xl grid-cols-2 text-center md:grid-cols-4">
          {[
            ["4", "Shops in Bengaluru"],
            ["1875", "House founded"],
            ["Same day", "Cash after the check"],
            ["11", "Silks on this floor"],
          ].map(([value, label], index) => (
            <li
              key={label}
              className={`relative px-4 py-8 md:py-10 ${
                index % 2 === 0 ? "border-r border-white/50 md:border-r-0" : ""
              } ${index < 2 ? "border-b border-white/50 md:border-b-0" : ""}`}
            >
              {index < 3 && (
                <span className="absolute top-1/2 right-0 hidden h-14 w-px -translate-y-1/2 bg-white/70 md:block" />
              )}
              <p className="font-display text-4xl text-[#e6a21a] md:text-5xl">{value}</p>
              <p className="mt-2 text-sm text-white">{label}</p>
            </li>
          ))}
        </ul>
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

      <section className="bg-[#f7f1e8] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-[11px] tracking-[0.22em] text-[#8a6230] uppercase">
            The counter
          </p>
          <h2 className="mt-2 text-center font-display text-4xl text-primary md:text-5xl">
            Gallery
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-sm leading-6 text-ink/60">
            Silks from the floor at V.V. Puram and Jayanagar.
          </p>
          <ul className="mt-10 grid grid-cols-2 gap-2 md:grid-cols-4 md:auto-rows-[100px] md:gap-1.5 lg:auto-rows-[130px]">
            {sareeImages.map((src, index) => (
              <li key={src} className={`overflow-hidden ${galleryLayout[index]}`}>
                <img
                  src={src}
                  alt=""
                  className="h-full min-h-36 w-full object-cover md:min-h-0"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

function PromiseIcon({ name }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "h-5 w-5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  }

  if (name === "check") {
    return (
      <svg {...common}>
        <circle cx="11" cy="11" r="6" />
        <path d="m20 20-3.5-3.5" />
        <path d="m8.5 11 1.8 1.8 3.2-3.3" />
      </svg>
    )
  }

  if (name === "price") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" />
        <path d="M9 9h6M9 12h6" />
        <path d="M12 9c1.4 0 2.4.7 2.4 1.8S13.4 12.6 12 12.6L9.2 16" />
      </svg>
    )
  }

  if (name === "cash") {
    return (
      <svg {...common}>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <circle cx="12" cy="12" r="2.2" />
        <path d="M6 9.5v.01M18 14.5v.01" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <path d="M4 8c2 1.6 3.8 1.6 5.8 0S13.6 6.4 16 8s3.8 1.6 4 0" />
      <path d="M4 12c2 1.6 3.8 1.6 5.8 0S13.6 10.4 16 12s3.8 1.6 4 0" />
      <path d="M4 16c2 1.6 3.8 1.6 5.8 0S13.6 14.4 16 16s3.8 1.6 4 0" />
    </svg>
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
