import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import ProductImagePanel from "../components/ProductImagePanel"
import ShopCategoriesSection from "../components/ShopCategoriesSection"
import VisitStoreBanner from "../components/VisitStoreBanner"
import GoogleReviewsSection from "../components/GoogleReviewsSection"
import { useCart } from "../context/CartContext"
import { useProducts } from "../context/ProductsContext"
import { formatPrice, sareeImages } from "../data/products"

const photo = (index) => sareeImages[index % sareeImages.length]

const mainHero = {
  src: "/hero/hero-mustard1.png",
  srcAvif: "/hero/hero-mustard1.avif",
  alt: "Mustard silk saree in a heritage courtyard",
  position: "object-[68%_top] sm:object-[62%_top] md:object-[58%_12%]",
  eyebrow: "Karnan Pattu Centre",
  title: ["Soft Silk To Wear.", "Old Soft Silk We Buy."],
  body: "Soft silks leave the counter ready to drape. Bring the soft silk you no longer wear, and we pay a fair cash price the same day.",
  primaryCta: { label: "Shop soft silk", to: "/shop" },
  secondaryCta: { label: "Sell soft silk", to: "/old-silk" },
}

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
    label: "Silk collection",
    note: "Silk light on the body",
    to: "/shop",
    image: "/hero/gulabi-silk.avif",
    frame: "object-[center_12%]",
  },
]

const weaves = [
  { label: "Light drape", note: "Everyday", to: "/shop", image: photo(1) },
  { label: "Gold border", note: "Classic", to: "/shop", image: photo(2) },
  { label: "Day wear", note: "Comfort", to: "/shop", image: photo(4) },
  { label: "Evening wear", note: "Occasions", to: "/shop", image: photo(3) },
  { label: "Wedding ready", note: "Celebrations", to: "/shop", image: photo(5) },
  { label: "Old sarees", note: "We buy", to: "/old-silk" },
]

const oldSilks = [
  {
    text: "Fine woven drapes.",
    image: "/sarees/soft/soft-02.avif",
  },
  {
    text: "Vibrant and elegant silk drapes.",
    image: "/sarees/soft/soft-01.avif",
  },
  {
    text: "Intricate borders and detailed pallus.",
    image: "/sarees/soft/soft-08.avif",
  },
  {
    text: "Freshly curated weaves.",
    image: "/sarees/soft/soft-04.avif",
  },
  {
    text: "Heirloom handcrafted drapes.",
    image: "/sarees/soft/soft-10.avif",
  },
  {
    text: "Classic plain body with rich borders.",
    image: "/sarees/soft/soft-06.avif",
  },
  {
    text: "Pure gold zari borders.",
    image: "/sarees/soft/soft-07.avif",
  },
  {
    text: "Woven buttas and traditional pallu work.",
    image: "/sarees/soft/soft-11.avif",
  },
];

const promoHeroBackground = {
  src: "/hero/bgbannar.png",
  alt: "Silk sarees collection banner with model and folded weaves",
  width: 1024,
  height: 497,
  imageClass:
    "absolute left-0 right-0 top-0 h-full w-full max-w-none object-cover object-top sm:h-[185%] sm:object-[50%_36%]",
}

export default function Home() {
  const [addedId, setAddedId] = useState(null)
  const [saleFilter, setSaleFilter] = useState("all")
  const [shopLookIndex, setShopLookIndex] = useState(0)
  const [shopLookPerView, setShopLookPerView] = useState(2)
  const { addToCart } = useCart()
  const { products } = useProducts()
  const saleProducts = [3, 1, 4, 2]
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean)
  const shownSales =
    saleFilter === "all" ? saleProducts : saleProducts.filter((product) => product.saleGroup === saleFilter)

  const shopLookMaxIndex = Math.max(0, oldSilks.length - shopLookPerView)
  const shopLookSlideWidth = 100 / shopLookPerView

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)")
    const sync = () => setShopLookPerView(desktop.matches ? 4 : 2)
    sync()
    desktop.addEventListener("change", sync)
    return () => desktop.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    setShopLookIndex((current) => Math.min(current, shopLookMaxIndex))
  }, [shopLookMaxIndex])

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined
    const timer = window.setInterval(() => {
      setShopLookIndex((current) => (current >= shopLookMaxIndex ? 0 : current + 1))
    }, 5500)
    return () => window.clearInterval(timer)
  }, [shopLookMaxIndex])

  function addPiece(id) {
    addToCart(id)
    setAddedId(id)
    window.setTimeout(() => {
      setAddedId((current) => (current === id ? null : current))
    }, 1200)
  }

  function slideShopLookPrev() {
    setShopLookIndex((current) => (current <= 0 ? shopLookMaxIndex : current - 1))
  }

  function slideShopLookNext() {
    setShopLookIndex((current) => (current >= shopLookMaxIndex ? 0 : current + 1))
  }

  return (
    <>
      <section
        className="relative h-[92vh] w-full max-w-full overflow-hidden bg-[#2c1814] md:h-screen"
        style={{
          backgroundImage: `url(${mainHero.src})`,
          backgroundSize: "cover",
          backgroundPosition: "58% 12%",
        }}
      >
        <picture className="absolute inset-0 block h-full w-full">
          <source srcSet={mainHero.srcAvif} type="image/avif" />
          <img
            src={mainHero.src}
            alt={mainHero.alt}
            fetchPriority="high"
            decoding="async"
            width={1024}
            height={768}
            className={`h-full w-full object-cover ${mainHero.position}`}
          />
        </picture>
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(28,8,12,0.9)_0%,rgba(28,8,12,0.55)_40%,rgba(28,8,12,0.2)_65%,transparent_88%)] md:bg-[linear-gradient(to_right,rgba(28,8,12,0.88)_0%,rgba(28,8,12,0.62)_38%,rgba(28,8,12,0.25)_52%,transparent_70%)]"
          aria-hidden
        />
        <div className="absolute inset-0 z-10 flex items-end px-4 pb-28 md:items-center md:pb-0 lg:px-8">
          <div className="mx-auto w-full min-w-0 max-w-7xl">
            <div
              data-slide="left"
              className="w-full min-w-0 max-w-xl text-left text-[#f6efe4]"
            >
              <p className="text-[11px] tracking-[0.28em] text-[#e8d5b5] uppercase">{mainHero.eyebrow}</p>
              <h1 className="mt-4 font-display text-4xl leading-[1.05] text-[#faf6f0] drop-shadow-sm sm:text-6xl md:text-7xl">
                {mainHero.title.map((line, lineIndex) => (
                  <span key={line} className={lineIndex > 0 ? "mt-1 block" : "block"}>
                    {line}
                  </span>
                ))}
              </h1>
              <p className="mt-5 max-w-md text-sm font-medium leading-7 text-[#f6efe4] md:text-base">
                {mainHero.body}
              </p>
              <div className="mt-6 flex w-full max-w-md flex-col gap-2 md:mt-8 md:gap-3 md:flex-row md:flex-wrap">
                <Link
                  to={mainHero.primaryCta.to}
                  className="motion-btn motion-gold inline-flex w-full max-w-[15.5rem] items-center justify-center gap-2 bg-secondary px-4 py-2 text-[10px] font-semibold tracking-[0.14em] text-ink uppercase md:w-auto md:max-w-none md:gap-3 md:px-5 md:py-3 md:text-[11px] md:tracking-[0.16em]"
                >
                  {mainHero.primaryCta.label}
                  <span aria-hidden="true">→</span>
                </Link>
                <Link
                  to={mainHero.secondaryCta.to}
                  className="motion-btn inline-flex w-full max-w-[15.5rem] items-center justify-center gap-2 border border-[#f6efe4] bg-[#210a0c]/25 px-4 py-2 text-[10px] font-semibold tracking-[0.14em] text-[#faf6f0] uppercase backdrop-blur-[2px] hover:bg-[#f6efe4] hover:text-primary md:w-auto md:max-w-none md:gap-3 md:px-5 md:py-3 md:text-[11px] md:tracking-[0.16em]"
                >
                  {mainHero.secondaryCta.label}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ShopCategoriesSection />

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

      <section className="relative w-full overflow-hidden bg-[#faf6f0]">
        <div className="relative h-[200px] w-full max-w-none sm:h-[240px] md:h-[280px] lg:h-[320px]">
          <img
            src={promoHeroBackground.src}
            alt={promoHeroBackground.alt}
            decoding="async"
            width={promoHeroBackground.width}
            height={promoHeroBackground.height}
            className={promoHeroBackground.imageClass}
          />

          <div
            data-slide="up"
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-3 pt-1 text-center text-[#210a0c] sm:px-6 sm:pt-0"
          >
            <div className="pointer-events-auto mx-auto flex w-full max-w-sm flex-col items-center sm:max-w-md md:max-w-lg md:-translate-y-0.5">
              <p className="font-display text-[10px] italic text-[#b8860b] xs:text-xs sm:text-lg md:text-xl">
                Silk for every occasion
              </p>

              <div className="my-0.5 flex w-16 items-center justify-center gap-1 xs:w-20 sm:my-1 sm:w-28">
                <div className="h-px w-full bg-[#b8860b]/60" />
                <span className="text-[7px] text-[#b8860b] sm:text-[9px]">❖</span>
                <div className="h-px w-full bg-[#b8860b]/60" />
              </div>

              <p className="max-w-[220px] text-[9px] leading-snug text-[#3d1a1d]/90 xs:text-[10px] sm:max-w-none sm:text-xs sm:leading-relaxed">
                Pure silk elegance,<br className="sm:hidden" /> ready for every occasion.
              </p>

              <div className="group relative mt-1 flex items-center justify-center gap-1 tracking-widest text-[#210a0c] sm:mt-2 sm:gap-2">
                <div className="absolute -inset-x-3 -inset-y-0.5 -z-10 rounded-full bg-[#daa520]/25 blur-md transition-all duration-500 group-hover:bg-[#daa520]/40" />
                <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#3d1a1d] sm:text-xs">
                  Flat
                </span>
                <span className="animate-pulse font-display text-xl font-black text-[#b8860b] drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] sm:text-4xl md:text-[2.75rem]">
                  50%
                </span>
                <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#3d1a1d] sm:text-xs">
                  Off
                </span>
              </div>

              <div className="mt-1.5 sm:mt-2.5">
                <Link
                  to="/shop"
                  className="motion-btn motion-fill inline-flex transform items-center justify-center bg-[#b8860b] px-3.5 py-1 text-[8px] font-bold tracking-[0.14em] text-white uppercase shadow-md transition-all duration-300 hover:scale-105 hover:bg-[#d4af37] hover:shadow-lg active:scale-95 sm:px-6 sm:py-2 sm:text-[10px]"
                  style={{ borderRadius: 0 }}
                >
                  Shop the look
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f1e8] px-4 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div data-slide="up" className="mx-auto max-w-xl text-center">
            <p className="text-[11px] tracking-[0.24em] text-[#8a6230] uppercase">On the counter</p>
            <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">Ready to leave.</h2>
          </div>

          <ul className="mt-8 grid grid-cols-2 items-stretch gap-x-3 gap-y-8 sm:gap-x-4 md:grid-cols-4 md:gap-x-6">
            {shownSales.map((product, index) => (
              <li key={product.id} data-slide={index % 2 === 0 ? "left" : "right"} className="h-full min-w-0">
                <article className="group flex h-full flex-col">
                  <ProductImagePanel
                    product={product}
                    onQuickAdd={() => addPiece(product.id)}
                    onAddedToCart={() => {
                      setAddedId(product.id)
                      window.setTimeout(() => {
                        setAddedId((current) => (current === product.id ? null : current))
                      }, 1200)
                    }}
                    badge={
                      product.compareAt && product.compareAt !== product.price ? (
                        <span className="absolute bottom-3 left-3 z-10 bg-primary px-2.5 py-1 text-[10px] font-medium tracking-wide text-cream shadow-sm">
                          50% OFF
                        </span>
                      ) : null
                    }
                  />
                  <p className="mt-3 text-[10px] tracking-[0.18em] text-ink/40 uppercase">{product.category}</p>
                  <Link to={`/product/${product.id}`} className="mt-1 block truncate font-display text-[22px] leading-tight text-primary">
                    {product.name}
                  </Link>
                  <p className="mt-1 flex flex-wrap items-baseline gap-2 text-sm text-ink/80">
                    {product.compareAt && product.compareAt !== product.price && (
                      <span className="text-xs text-ink/40 line-through">{formatPrice(product.compareAt)}</span>
                    )}
                    <span>{formatPrice(product.price)}</span>
                  </p>
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

      <section className="bg-[#faf6f0] px-4 py-12 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div data-slide="left" className="max-w-xl">
              <h2 className="font-display text-3xl text-primary sm:text-4xl md:text-5xl">Shop by look</h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-ink/65">
                Explore our curated selection of authentic silk drapes, crafted with timeless traditional weaves and
                fine zari craftsmanship.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2 self-end sm:mb-1">
              <button
                type="button"
                onClick={slideShopLookPrev}
                aria-label="Previous looks"
                className="motion-btn flex h-10 w-10 items-center justify-center rounded-full border border-primary/25 bg-white text-primary transition hover:border-primary hover:bg-primary hover:text-cream"
              >
                <ShopLookArrow direction="prev" />
              </button>
              <button
                type="button"
                onClick={slideShopLookNext}
                aria-label="Next looks"
                className="motion-btn flex h-10 w-10 items-center justify-center rounded-full border border-primary/25 bg-white text-primary transition hover:border-primary hover:bg-primary hover:text-cream"
              >
                <ShopLookArrow direction="next" />
              </button>
            </div>
          </div>

          <div className="relative mt-6 md:mt-10">
            <div className="overflow-hidden">
            <ul
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${shopLookIndex * shopLookSlideWidth}%)` }}
            >
              {oldSilks.map((item) => (
                <li
                  key={item.text}
                  className="box-border shrink-0 px-1 sm:px-2"
                  style={{ width: `${shopLookSlideWidth}%` }}
                >
                  <Link to="/shop" className="group flex h-full flex-col">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-cream">
                      <img
                        src={item.image}
                        alt=""
                        decoding="async"
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                    <p className="mt-3 min-h-[2.5rem] text-sm leading-snug font-medium text-primary">{item.text}</p>
                    <span className="motion-btn mt-3 block w-full rounded-lg bg-primary py-2.5 text-center text-[11px] font-semibold tracking-[0.12em] text-cream uppercase">
                      View look
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            </div>
          </div>
        </div>
      </section>

      <VisitStoreBanner />

      <GoogleReviewsSection />

    </>
  )
}

function ShopLookArrow({ direction }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      {direction === "prev" ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
    </svg>
  )
}
