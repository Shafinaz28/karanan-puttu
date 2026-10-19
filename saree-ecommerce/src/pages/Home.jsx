import { useState } from "react"
import { Link } from "react-router-dom"
import StyleCoverflow from "../components/StyleCoverflow"
import { useCart } from "../context/CartContext"
import { formatPrice, products, sareeImages } from "../data/products"

const photo = (index) => sareeImages[index % sareeImages.length]

const heroImage = {
  src: "/hero/hero-soft-silk.jpg",
  alt: "A soft silk saree with a coral gold border",
}

const saleFilters = [
  { id: "all", label: "All soft silks" },
  { id: "soft", label: "Soft silk" },
]

const assurances = [
  { title: "Thoughtfully chosen silks", icon: "diamond" },
  { title: "Heritage in every thread", icon: "person" },
  { title: "A new life for old sarees", icon: "leaf" },
  { title: "Carefully packed, with love", icon: "box" },
]

const kinds = [
  {
    label: "Kanjivaram",
    note: "Handloom temple border",
    to: "/shop",
    image: "/hero/maroon-courtyard.avif",
    frame: "object-[78%_center]",
  },
  {
    label: "Banarasi",
    note: "Zari worked by hand",
    to: "/shop",
    image: "/hero/green-palace.avif",
    frame: "object-[center_12%]",
  },
  {
    label: "Mysore Silk",
    note: "Since 1985",
    to: "/shop",
    image: "/hero/ivory-gold.avif",
    frame: "object-[center_12%]",
  },
  {
    label: "Soft Silks",
    note: "Silk light on the body",
    to: "/shop",
    image: "/hero/gulabi-silk.avif",
    frame: "object-[center_12%]",
  },
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

const weaves = [
  { label: "Soft silk", note: "Light drape", to: "/shop", image: photo(1) },
  { label: "Soft silk", note: "Gold border", to: "/shop", image: photo(2) },
  { label: "Soft silk", note: "Day wear", to: "/shop", image: photo(4) },
  { label: "Soft silk", note: "Evening wear", to: "/shop", image: photo(3) },
  { label: "Soft silk", note: "Wedding ready", to: "/shop", image: photo(5) },
  { label: "Old soft silk", note: "We buy", to: "/old-silk" },
]

const oldSilks = [
  {
    name: "Old Soft Silk",
    text: "Worn soft silk is welcome.",
    image: "/sarees/soft/soft-02.jpg",
  },
  {
    name: "Faded Soft Silk",
    text: "Faded or still bright.",
    image: "/sarees/soft/soft-01.jpg",
  },
  {
    name: "Torn Soft Silk",
    text: "Torn borders are welcome.",
    image: "/sarees/soft/soft-08.jpg",
  },
  {
    name: "Unused Soft Silk",
    text: "Folded away or never worn.",
    image: "/sarees/soft/soft-04.jpg",
  },
  {
    name: "Antique Soft Silk",
    text: "Heirloom soft silk drapes.",
    image: "/sarees/soft/soft-10.jpg",
  },
  {
    name: "Plain Soft Silk",
    text: "Plain body, worn or folded.",
    image: "/sarees/soft/soft-06.jpg",
  },
  {
    name: "Gold Soft Silk",
    text: "Soft silk with a gold border.",
    image: "/sarees/soft/soft-07.jpg",
  },
  {
    name: "Butta Soft Silk",
    text: "Buttas and a woven pallu.",
    image: "/sarees/soft/soft-11.jpg",
  },
]

const steps = [
  {
    step: "Step 01",
    title: "Share Your Saree Details",
    text: "Share images of your sarees via WhatsApp or call us for an evaluation.",
    image: photo(0),
  },
  {
    step: "Step 02",
    title: "Get An Instant Price Quote",
    text: "Our experts will assess the silk and offer you the best price.",
    image: photo(1),
  },
  {
    step: "Step 03",
    title: "Schedule Pickup\nOr Visit Our Store",
    text: "Book a doorstep pickup, or visit a showroom for an instant deal.",
    image: photo(2),
  },
  {
    step: "Step 04",
    title: "Get Instant Payment",
    text: "Accept the offer and receive the payment the same day.",
    image: photo(3),
  },
]

const promises = [
  ["check", "A careful check", "Silk and zari are looked at in daylight before a rate is offered."],
  ["price", "A clear price", "You hear the amount first. Nothing is settled until you accept."],
  ["cash", "Same-day cash", "Once the saree is checked and you agree, the payment is made that day."],
  ["silk", "Any condition", "Old, used, torn, and faded soft silk is welcome."],
]

export default function Home() {
  const [addedId, setAddedId] = useState(null)
  const [saleFilter, setSaleFilter] = useState("all")
  const { addToCart } = useCart()
  const saleProducts = [3, 1, 4, 2]
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean)
  const shownSales =
    saleFilter === "all" ? saleProducts : saleProducts.filter((product) => product.saleGroup === saleFilter)

  function addPiece(id) {
    addToCart(id)
    setAddedId(id)
    window.setTimeout(() => {
      setAddedId((current) => (current === id ? null : current))
    }, 1200)
  }

  return (
    <>
      <section className="relative h-[92vh] w-full max-w-full overflow-hidden md:h-screen">
        <img
          src={heroImage.src}
          alt={heroImage.alt}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-[72%_center] md:object-[center_22%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(28,8,12,0.9)_0%,rgba(28,8,12,0.72)_42%,rgba(28,8,12,0.35)_70%,rgba(28,8,12,0.18)_100%)] md:bg-[linear-gradient(to_right,rgba(28,8,12,0.88)_0%,rgba(28,8,12,0.7)_34%,rgba(28,8,12,0.28)_58%,transparent_78%)]" />
        <div className="absolute inset-0 flex items-end pb-28 md:items-center md:pb-0">
          <div className="mx-auto w-full min-w-0 max-w-7xl px-4 lg:px-8">
            <div data-slide="left" className="w-full min-w-0 max-w-xl text-left text-[#f6efe4]">
              <p className="text-[11px] tracking-[0.28em] text-[#d7c4a2] uppercase">Karnan Pattu Centre</p>
              <h1 className="mt-4 font-display text-4xl leading-[1.05] text-[#f6efe4] sm:text-6xl md:text-7xl">
                Soft Silk To Wear.
                <span className="mt-1 block">Old Soft Silk We Buy.</span>
              </h1>
              <p className="mt-5 max-w-md text-sm leading-7 text-[#f6efe4]/85 md:text-base">
                Soft silks leave the counter ready to drape. Bring the soft silk you no longer wear, and we pay a fair cash price the same day.
              </p>
              <div className="mt-8 flex w-full max-w-md flex-col gap-3 md:flex-row md:flex-wrap">
                <Link
                  to="/shop"
                  className="motion-btn motion-gold inline-flex w-full items-center justify-center gap-3 bg-secondary px-5 py-3 text-[11px] tracking-[0.16em] text-ink uppercase md:w-auto"
                >
                  Shop soft silk
                  <span aria-hidden="true">→</span>
                </Link>
                <Link
                  to="/old-silk"
                  className="motion-btn inline-flex w-full items-center justify-center gap-3 border border-[#f6efe4] px-5 py-3 text-[11px] tracking-[0.16em] text-[#f6efe4] uppercase hover:bg-[#f6efe4] hover:text-primary md:w-auto"
                >
                  Sell soft silk
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-primary/10 bg-[#f6efe4]">
        <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-x-4 gap-y-8 px-5 py-8 lg:grid-cols-4 lg:gap-6">
          {assurances.map((item, index) => (
            <li
              key={item.title}
              data-slide={index === 0 ? "left" : index === 3 ? "right" : "up"}
              className="flex flex-col items-center gap-3 text-center text-primary"
            >
              <AssuranceIcon name={item.icon} />
              <span className="font-display text-[15px] leading-snug sm:text-[17px]">{item.title}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-[#f6efe4] px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex min-w-0 flex-col items-center gap-8 text-center md:flex-row md:items-end md:justify-between md:text-left">
            <div data-slide="left" className="min-w-0">
              <p className="text-[11px] tracking-[0.28em] text-[#3a2a24]/70 uppercase">Choose by the weave</p>
              <h2 className="mt-4 font-display text-[40px] leading-none text-[#2c1814] md:text-[56px]">
                Find the silk that suits you.
              </h2>
            </div>
            <Link
              to="/shop"
              className="mb-1 hidden shrink-0 items-center gap-2 border-b border-[#2c1814]/70 pb-0.5 text-[13px] text-[#2c1814] md:inline-flex"
            >
              Shop all sarees
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {kinds.map((item, index) => (
              <li key={item.label} data-slide={index % 2 === 0 ? "left" : "right"}>
                <Link to={item.to} className="group relative block overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.label}
                    decoding="async"
                    className={`aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] ${item.frame}`}
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent px-4 pt-24 pb-5 text-white">
                    <span className="block text-[9px] tracking-[0.2em] text-white/80 uppercase">{item.note}</span>
                    <span className="mt-1.5 flex items-end justify-between gap-2 font-display text-[22px] leading-none md:text-[28px]">
                      {item.label}
                      <span aria-hidden="true" className="mb-0.5 text-sm font-sans">↗</span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to="/shop"
            className="mx-auto mt-6 flex w-fit items-center gap-2 border-b border-[#2c1814]/70 pb-0.5 text-[13px] text-[#2c1814] md:hidden"
          >
            Shop all sarees
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <StyleCoverflow />

      <section className="bg-[#f7f1e8] px-4 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div data-slide="up" className="mx-auto max-w-xl text-center">
            <p className="text-[11px] tracking-[0.24em] text-[#8a6230] uppercase">On the counter</p>
            <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">Soft silk ready to leave.</h2>
            <p className="mt-3 text-sm text-ink/70">Soft silks only, photographed as they are.</p>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-ink/55">
            {saleFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setSaleFilter(filter.id)}
                className={
                  saleFilter === filter.id
                    ? "border-b border-primary pb-1 text-primary"
                    : "pb-1 hover:text-primary"
                }
              >
                {filter.label}
              </button>
            ))}
          </div>
          <ul className="mt-8 grid grid-cols-2 items-stretch gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-6">
            {shownSales.map((product, index) => (
              <li key={product.id} data-slide={index % 2 === 0 ? "left" : "right"} className="h-full">
                <article className="flex h-full flex-col">
                  <div className="group relative overflow-hidden">
                    <Link to={`/product/${product.id}`} className="relative block aspect-[3/4]">
                      <img
                        src={product.image}
                        alt={product.name}
                        decoding="async"
                        className="h-full w-full object-cover object-top"
                      />
                      <span className="quick-view">View saree</span>
                    </Link>
                    {product.badge && (
                      <span className="absolute bottom-12 left-3 z-10 bg-white px-2.5 py-1 text-[11px] text-primary shadow-sm">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-[10px] tracking-[0.18em] text-ink/40 uppercase">{product.fabric}</p>
                  <Link to={`/product/${product.id}`} className="mt-1 block truncate font-display text-[22px] leading-tight text-primary">
                    {product.name}
                  </Link>
                  <p className="mt-1 text-sm text-ink/80">{formatPrice(product.price)}</p>
                  <div className="mt-auto pt-3">
                    <button
                      type="button"
                      onClick={() => addPiece(product.id)}
                      className="motion-btn motion-line w-full border border-primary py-2 text-[10px] tracking-[0.12em] text-primary uppercase"
                    >
                      {addedId === product.id ? "Added" : "Add to cart"}
                    </button>
                  </div>
                </article>
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 border border-primary/30 px-6 py-3 text-sm text-primary hover:border-primary"
            >
              View all sarees
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-shell px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 data-slide="up" className="text-center font-display text-4xl text-primary md:text-5xl">
            Sarees We Buy
          </h2>
          <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {oldSilks.map((item, index) => (
              <li key={item.name} data-slide={index % 2 === 0 ? "left" : "right"} className="h-full">
                <Link
                  to="/old-silk"
                  className="flex h-full flex-col overflow-hidden rounded-xl border-2 border-[#c59b27] bg-[#3a1216]"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    decoding="async"
                    className="aspect-[3/4] w-full object-cover object-center"
                  />
                  <div className="px-3 py-3 text-center text-[#f7f1e8]">
                    <h3 className="font-display text-base leading-tight md:text-lg">{item.name}</h3>
                    <p className="mt-1 text-[11px] leading-4 text-[#f7f1e8]/75">{item.text}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[#f6efe4] px-4 py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div data-slide="left" className="text-center lg:max-w-md lg:text-left">
            <h2 className="font-display text-4xl leading-tight text-[#2c1814] md:text-5xl">
              Silk for every occasion.
            </h2>
            <p className="mt-5 text-sm leading-7 text-ink/70 md:text-base">
              From a temple morning to a wedding evening, each soft silk leaves the counter ready to drape. Chosen in daylight and ready to wear.
            </p>
            <Link
              to="/shop"
              className="motion-btn motion-fill mt-8 inline-flex items-center justify-center bg-primary px-7 py-3.5 text-[11px] tracking-[0.16em] text-cream uppercase"
              style={{ borderRadius: 0 }}
            >
              Shop the look
            </Link>
          </div>
          <div data-slide="right" className="relative mx-auto h-[420px] w-full max-w-md sm:h-[480px] lg:max-w-lg">
            <img
              src="/hero/maroon-courtyard.avif"
              alt=""
              decoding="async"
              className="absolute top-0 left-[4%] z-[1] h-[46%] w-[38%] rounded-md object-cover object-[78%_center] shadow-md"
            />
            <img
              src="/hero/ivory-gold.avif"
              alt=""
              decoding="async"
              className="absolute top-[8%] right-0 z-[1] h-[48%] w-[36%] rounded-md object-cover object-center shadow-md"
            />
            <img
              src="/hero/gulabi-silk.avif"
              alt=""
              decoding="async"
              className="absolute bottom-[6%] left-0 z-[1] h-[36%] w-[34%] rounded-md object-cover object-center shadow-md"
            />
            <div className="absolute top-[18%] left-[28%] z-[2] h-[68%] w-[48%]">
              <img
                src="/hero/gold-saree.avif"
                alt="A gold silk saree worn on temple steps"
                decoding="async"
                className="h-full w-full rounded-md object-cover object-top shadow-lg"
              />
              <div className="absolute right-0 bottom-0 translate-x-1/2 translate-y-1/2 bg-[#c48a3a] px-3.5 py-2.5 text-white shadow-md">
                <p className="font-display text-2xl leading-none sm:text-3xl">30+</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-shell px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div data-slide="up">
            <p className="text-center text-[11px] tracking-[0.22em] text-[#8a6230] uppercase">The loom</p>
            <h2 className="mt-2 text-center font-display text-4xl text-primary">Soft Silk Edits</h2>
          </div>
          <ul className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-6">
            {weaves.map((weave, index) => (
              <li key={`${weave.note}-${index}`} data-slide={index < 3 ? "left" : "right"}>
                <Link to={weave.to} className="flex flex-col items-center text-center">
                  {weave.image ? (
                    <img src={weave.image} alt=""  decoding="async" className="motion-circle h-20 w-20 rounded-full object-cover" />
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
        </div>
      </section>

      <section className="bg-[#f6efe4] px-4 py-16">
        <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div data-slide="left" className="lg:pt-2">
            <p className="text-[11px] tracking-[0.22em] text-[#c48a3a] uppercase">Our promise</p>
            <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">Why choose us</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-ink/70">
              We buy old silk and sell new silk in Bengaluru. The saree is checked first, the price is told before you agree, and the money is paid the same day.
            </p>
            <img
              src="/hero/temple.avif"
              alt="A silk saree in a temple courtyard at sunset"
              decoding="async"
              className="mt-8 h-72 w-full max-w-md object-cover object-[68%_center]"
            />
          </div>
          <ol className="border-y border-[#ead9bf]">
            {promises.map(([icon, title, text], index) => (
              <li key={title} data-slide="right" className="flex gap-4 border-b border-[#ead9bf] py-5 last:border-b-0">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#c59b27] text-[#3a1216]">
                  <PromiseIcon name={icon} />
                </span>
                <span>
                  <span className="text-[11px] tracking-[0.16em] text-[#8a6230] uppercase">0{index + 1}</span>
                  <h3 className="mt-1 font-display text-xl text-primary">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-ink/70">{text}</p>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-shell px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div data-slide="up" className="text-center">
            <p className="text-[11px] tracking-[0.22em] text-[#8a6230] uppercase">How it works</p>
            <h2 className="mt-2 font-display text-4xl text-primary">Working Process</h2>
          </div>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((item, index) => (
              <li key={item.step} data-slide={index % 2 === 0 ? "left" : "right"} className="flex flex-col items-center px-2 text-center">
                <img src={item.image} alt=""  decoding="async" className="h-28 w-28 rounded-full object-cover" />
                <p className="mt-4 text-[11px] tracking-[0.16em] text-[#c48a3a] uppercase">{item.step}</p>
                <h3 className="mt-2 flex min-h-14 max-w-[15rem] items-center font-display text-xl leading-snug whitespace-pre-line text-primary">
                  {item.title}
                </h3>
                <p className="max-w-[16rem] text-sm leading-6 text-ink/70">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative overflow-hidden py-14 text-[#f6efe4] md:py-16">
        <img src={photo(4)} alt="" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[#4a0e17]/88" />
        <ul className="relative mx-auto grid max-w-5xl gap-4 px-4 sm:grid-cols-3 sm:gap-6">
          {[
            ["house", "1985", "The house opened"],
            ["clock", "Same day", "Cash after a check"],
            ["pin", "Bengaluru", "Doorstep pickup"],
          ].map(([icon, value, label], index) => (
            <li
              key={label}
              data-slide={index === 0 ? "left" : index === 2 ? "right" : "up"}
              className="flex items-center gap-4 border border-[#c59b27]/35 bg-[#2a080e]/35 px-5 py-5 sm:flex-col sm:px-4 sm:py-8 sm:text-center"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#c59b27] text-[#f3e3b8]">
                <StatIcon name={icon} />
              </span>
              <span>
                <p className="font-display text-3xl leading-none text-[#f3e3b8] sm:text-4xl">{value}</p>
                <p className="mt-2 text-sm text-[#f6efe4]/85">{label}</p>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section id="charter" className="bg-[#f7f1e8] py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div data-slide="up">
            <p className="text-center text-[11px] tracking-[0.24em] text-[#c59b27] uppercase">The standard</p>
            <h2 className="mt-3 text-center font-display text-4xl text-primary md:text-5xl">Purity Charter</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {charter.map((item, index) => (
              <article
                key={item.title}
                data-slide={index % 2 === 0 ? "left" : "right"}
                className="border border-[#c59b27]/40 bg-white p-6 text-center"
              >
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#c59b27] text-[#c59b27]">
                  <CharterIcon name={item.icon} />
                </span>
                <h3 className="mt-4 font-display text-xl text-primary">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/75">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f6efe4] px-4 py-20 text-center">
        <blockquote data-slide="up" className="mx-auto max-w-3xl">
          <p className="font-display text-3xl leading-snug text-primary italic md:text-5xl">
            “A silk saree can leave the cupboard and still hold its value.”
          </p>
          <footer className="mt-6 text-[11px] tracking-[0.22em] text-[#8a6230] uppercase">
            Karnan Pattu Centre
          </footer>
        </blockquote>
      </section>
    </>
  )
}

function StatIcon({ name }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "h-5 w-5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    "aria-hidden": true,
  }

  if (name === "house") {
    return (
      <svg {...common}>
        <path d="M4 11.5 12 5l8 6.5" />
        <path d="M6.5 10.5V19h11v-8.5" />
        <path d="M10 19v-4h4v4" />
      </svg>
    )
  }

  if (name === "clock") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="7.5" />
        <path d="M12 8.5V12l2.5 2" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <path d="M12 20s5.5-4.6 5.5-9a5.5 5.5 0 1 0-11 0c0 4.4 5.5 9 5.5 9z" />
      <circle cx="12" cy="11" r="1.7" />
    </svg>
  )
}

function AssuranceIcon({ name }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "h-5 w-5 shrink-0",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    "aria-hidden": true,
  }

  if (name === "person") {
    return (
      <svg {...common}>
        <circle cx="12" cy="8" r="2.4" />
        <path d="M7.5 19v-1.2A3.5 3.5 0 0 1 11 14.4h2a3.5 3.5 0 0 1 3.5 3.4V19" />
      </svg>
    )
  }

  if (name === "leaf") {
    return (
      <svg {...common}>
        <path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14z" />
        <path d="M8 16c2-2 4-5 6-8" />
      </svg>
    )
  }

  if (name === "box") {
    return (
      <svg {...common}>
        <rect x="4" y="8" width="16" height="12" rx="1.2" />
        <path d="M4 12h16" />
        <path d="M12 8v12" />
        <path d="M12 8c-1.4-2.4-4.2-2.2-4.2-.4S10.2 9.2 12 8c1.4-2.4 4.2-2.2 4.2-.4S13.8 9.2 12 8z" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <path d="M12 3 20 12l-8 9-8-9 8-9z" />
    </svg>
  )
}

function PromiseIcon({ name }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "h-5 w-5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    "aria-hidden": true,
  }
  if (name === "price") {
    return (
      <svg {...common}>
        <path d="M12 3v18" />
        <path d="M8 7h6a3 3 0 0 1 0 6H8" />
        <path d="M8 13h7a3 3 0 0 1 0 6H8" />
      </svg>
    )
  }
  if (name === "cash") {
    return (
      <svg {...common}>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    )
  }
  if (name === "silk") {
    return (
      <svg {...common}>
        <path d="M4 8c2 2 4 2 6 0s4-2 6 0 4 2 4 0" />
        <path d="M4 12c2 2 4 2 6 0s4-2 6 0 4 2 4 0" />
        <path d="M4 16c2 2 4 2 6 0s4-2 6 0 4 2 4 0" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="8" />
      <path d="m8.5 12 2.2 2.2 4.8-5" />
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
    "aria-hidden": true,
  }
  if (name === "silk") {
    return (
      <svg {...common}>
        <path d="M4 8c2 2 4 2 6 0s4-2 6 0 4 2 4 0" />
        <path d="M4 12c2 2 4 2 6 0s4-2 6 0 4 2 4 0" />
        <path d="M4 16c2 2 4 2 6 0s4-2 6 0 4 2 4 0" />
      </svg>
    )
  }
  if (name === "pure") {
    return (
      <svg {...common}>
        <path d="M12 3 5 7v5c0 4.2 2.8 7.2 7 9 4.2-1.8 7-4.8 7-9V7z" />
      </svg>
    )
  }
  if (name === "heirloom") {
    return (
      <svg {...common}>
        <path d="M12 3v18" />
        <path d="M7 8h10" />
        <path d="M8 8c0 6 8 6 8 0" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <path d="M8 11V6.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M11 10.5V5.5a1.5 1.5 0 0 1 3 0V14c0 3-2 5-5 5" />
    </svg>
  )
}
