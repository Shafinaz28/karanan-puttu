import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { useCart } from "../context/CartContext"
import { useProducts } from "../context/ProductsContext"
import { formatPrice, productDisplayTitle, sareeImages } from "../data/products"
import { isInWishlist, toggleWishlistId } from "../hooks/useWishlist"

function formatPriceDetailed(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products } = useProducts()
  const { addToCart } = useCart()
  const product = products.find((item) => Number(item.id) === Number(id))

  const [activeImage, setActiveImage] = useState(0)
  const imageSwipeStart = useRef(null)
  const [imageDragOffset, setImageDragOffset] = useState(0)
  const [isDraggingImage, setIsDraggingImage] = useState(false)
  const [qty, setQty] = useState(0)
  const [agreed, setAgreed] = useState(false)
  const [added, setAdded] = useState(false)
  const [saved, setSaved] = useState(false)
  const [shareNote, setShareNote] = useState("")
  const [termsError, setTermsError] = useState(false)
  const [qtyError, setQtyError] = useState(false)

  const gallery = useMemo(() => {
    if (!product) return []
    if (product.images?.length) return product.images.slice(0, 4)
    const extras = sareeImages.slice(
      Number(product.id) % sareeImages.length,
      (Number(product.id) % sareeImages.length) + 3,
    )
    const merged = [product.image, ...extras.filter((src) => src !== product.image)]
    return merged.slice(0, 4)
  }, [product])

  useEffect(() => {
    if (product) setSaved(isInWishlist(product.id))
  }, [product])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  useEffect(() => {
    if (!added) return undefined
    const timer = window.setTimeout(() => setAdded(false), 1800)
    return () => window.clearTimeout(timer)
  }, [added])

  function moveImage(direction) {
    setActiveImage((current) => (current + direction + gallery.length) % gallery.length)
  }

  function finishImageSwipe(event) {
    if (imageSwipeStart.current === null) return
    const distance = event.clientX - imageSwipeStart.current
    imageSwipeStart.current = null
    setImageDragOffset(0)
    setIsDraggingImage(false)
    if (Math.abs(distance) >= 40) moveImage(distance < 0 ? 1 : -1)
  }

  useEffect(() => {
    const sync = () => product && setSaved(isInWishlist(product.id))
    window.addEventListener("karnan-wishlist", sync)
    return () => window.removeEventListener("karnan-wishlist", sync)
  }, [product])

  if (!product) {
    return (
      <section className="site-container py-16">
        <h1 className="font-display text-4xl text-primary">Saree not found</h1>
        <Link to="/shop" className="mt-4 inline-block text-sm text-primary">
          Back to shop
        </Link>
      </section>
    )
  }

  const similar = products.filter((item) => Number(item.id) !== Number(product.id)).slice(0, 8)
  const title = productDisplayTitle(product, { includeLine: false })
  const categoryLabel = product.category || "Shop"

  const priceBlock = (
    <>
      <p className="text-xl font-semibold text-ink">{formatPriceDetailed(product.price)}</p>
      {product.compareAt && product.compareAt > product.price && (
        <p className="mt-1 text-sm text-ink/45 line-through">{formatPrice(product.compareAt)}</p>
      )}
      <p className="mt-1 text-xs text-ink/50">Tax included.</p>
    </>
  )

  const quantityBlock = (
    <div className="mt-5 flex items-center justify-between gap-4">
      <span className="text-sm font-semibold text-ink">Quantity</span>
      <div className="inline-flex items-stretch rounded-md border border-ink/20 bg-white">
        <button
          type="button"
          disabled={qty <= 0}
          aria-label="Decrease quantity"
          onClick={() => {
            setQty((value) => Math.max(0, value - 1))
            if (qty - 1 >= 1) setQtyError(false)
          }}
          className="px-3 py-1.5 text-base text-ink disabled:opacity-35"
        >
          −
        </button>
        <span className="flex min-w-[2.5rem] items-center justify-center border-x border-ink/25 px-2 text-sm font-medium">
          {qty}
        </span>
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => {
            setQty((value) => value + 1)
            setQtyError(false)
          }}
          className="px-3 py-1.5 text-base text-ink hover:bg-ink/5"
        >
          +
        </button>
      </div>
    </div>
  )

  function handleCompare() {
    try {
      const key = "karnan-compare"
      const parsed = JSON.parse(localStorage.getItem(key) || "[]")
      const ids = Array.isArray(parsed) ? parsed.map(Number).filter(Boolean) : []
      const pid = Number(product.id)
      const next = ids.includes(pid) ? ids : [...ids, pid].slice(-3)
      localStorage.setItem(key, JSON.stringify(next))
    } catch {
      /* ignore */
    }
  }

  async function handleShare() {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setShareNote("Link copied")
    } catch {
      setShareNote("Could not share")
    }
    window.setTimeout(() => setShareNote(""), 2000)
  }

  function addToBag() {
    if (qty < 1) {
      setQtyError(true)
      return
    }
    setQtyError(false)
    if (!agreed) {
      setTermsError(true)
      return
    }
    setTermsError(false)
    addToCart(Number(product.id), qty)
    setAdded(true)
  }

  function buyNow() {
    if (qty < 1) {
      setQtyError(true)
      return
    }
    setQtyError(false)
    if (!agreed) {
      setTermsError(true)
      return
    }
    setTermsError(false)
    addToCart(Number(product.id), qty)
    navigate("/checkout", {
      state: {
        productId: product.id,
        qty,
      },
    })
  }

  const descriptionBlock = (
    <div className="mt-8 border-t border-ink/10 pt-5 text-sm text-ink/80">
      <h3 className="font-semibold uppercase tracking-wider text-ink mb-2">Product Description</h3>
      <p className="leading-snug">{product.description || "A fuchsia soft silk with gold buttas and a broad gold border."}</p>
      <p className="mt-1 leading-snug">{product.line || "Fuchsia body with a gold temple border"}</p>
      <ul className="mt-2 list-disc space-y-0.5 pl-5">
        <li>{product.fabric || "Soft silk"} · {product.length || "6.3 metres"}</li>
        <li>Colour: {product.color || "Fuchsia and gold"}</li>
        <li>Blouse piece included</li>
        <li>{product.badge || "New arrival"}</li>
      </ul>
    </div>
  )

  return (
    <div className="bg-white lg:bg-cream">
      <section className="site-container py-4 md:py-14">
        <nav className="mb-4 text-xs leading-relaxed text-ink/55 lg:mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-1.5">›</span>
          <Link to="/shop" className="hover:text-primary">
            {categoryLabel}
          </Link>
          <span className="mx-1.5">›</span>
          <span className="text-ink/80 line-clamp-1">{title}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          <div>
            <div
              className={`relative overflow-hidden rounded-lg bg-[#f0e6d8] ${
                isDraggingImage ? "cursor-grabbing" : "cursor-grab"
              }`}
              onPointerDown={(event) => {
                if (event.pointerType === "mouse" && event.button !== 0) return
                if (event.target.closest("button")) return
                imageSwipeStart.current = event.clientX
                event.currentTarget.setPointerCapture(event.pointerId)
              }}
              onPointerMove={(event) => {
                if (imageSwipeStart.current === null) return
                setImageDragOffset(event.clientX - imageSwipeStart.current)
                setIsDraggingImage(true)
              }}
              onPointerUp={finishImageSwipe}
              onPointerCancel={() => {
                imageSwipeStart.current = null
                setImageDragOffset(0)
                setIsDraggingImage(false)
              }}
              style={{ touchAction: "pan-y" }}
            >
              <div className="aspect-[3/4] w-full overflow-hidden">
                <div
                  className="flex h-full w-full"
                  style={{
                    transform: `translateX(calc(-${activeImage * 100}% + ${imageDragOffset}px))`,
                    transition: isDraggingImage ? "none" : "transform 300ms ease-out",
                  }}
                >
                  {gallery.map((src, index) => (
                    <div key={`${src}-${index}`} className="h-full min-w-full">
                      <img
                        src={src}
                        alt={index === activeImage ? product.name : ""}
                        fetchPriority={index === 0 ? "high" : "auto"}
                        decoding="async"
                        draggable={false}
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Carousel Bottom Dot Pointers */}
              {gallery.length > 1 && (
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-10" aria-hidden="true">
                  {gallery.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      aria-label={`Go to slide ${index + 1}`}
                      className={`h-2 w-2 rounded-full transition-all ${
                        activeImage === index ? "bg-primary w-5" : "bg-ink/30 hover:bg-ink/50"
                      }`}
                    />
                  ))}
                </div>
              )}

              <button
                type="button"
                aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
                onClick={() => setSaved(toggleWishlistId(product.id))}
                className="absolute top-3 right-3 flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white text-ink shadow-sm lg:hidden"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={saved ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="1.75"
                >
                  <path d="M12 2l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 8.8l6.5-.9L12 2z" />
                </svg>
              </button>
            </div>
            {gallery.length > 1 && (
              <ul className="mt-3 hidden gap-2 overflow-x-auto pb-1 lg:mt-4 lg:grid lg:grid-cols-4 lg:overflow-visible">
                {gallery.map((src, index) => (
                  <li key={`${src}-${index}`} className="w-[4.25rem] shrink-0 lg:w-auto">
                    <button
                      type="button"
                      onClick={() => setActiveImage(index)}
                      className={`block w-full overflow-hidden rounded-md border-2 transition ${
                        activeImage === index ? "border-ink" : "border-transparent hover:border-ink/25"
                      }`}
                    >
                      <img src={src} alt="" className="aspect-[3/4] w-full object-cover object-top" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-5 lg:hidden">
              <h1 className="text-xl font-medium leading-snug text-ink">{title}</h1>
              <div className="mt-3">{priceBlock}</div>
              {quantityBlock}
              {qtyError && (
                <p className="mt-1 text-right text-xs font-medium text-red-600">
                  Please select at least 1 item.
                </p>
              )}
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
              onClick={() => setSaved(toggleWishlistId(product.id))}
              className="absolute top-0 right-0 hidden h-11 w-11 items-center justify-center rounded-full border border-ink/15 bg-white text-primary shadow-sm lg:flex"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.75">
                <path d="M12 2l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 8.8l6.5-.9L12 2z" />
              </svg>
            </button>

            <h1 className="hidden pr-14 font-display text-3xl leading-snug text-ink lg:block md:text-[2rem]">{title}</h1>
            <div className="hidden lg:block">
              <div className="mt-4">{priceBlock}</div>
              {quantityBlock}
              {qtyError && (
                <p className="mt-1 text-right text-xs font-medium text-red-600">
                  Please select at least 1 item.
                </p>
              )}
            </div>

            <div className="mt-6 lg:mt-8">
              <button
                type="button"
                onClick={addToBag}
                aria-live="polite"
                className={`motion-btn w-full border py-3.5 text-sm font-semibold tracking-wide uppercase transition-colors ${
                  added
                    ? "border-secondary bg-secondary text-primary"
                    : qty > 0
                    ? "border-primary bg-primary text-cream hover:bg-primary/90"
                    : "border-ink/20 bg-ink/10 text-ink/40"
                }`}
              >
                {added ? "Added to cart" : "Add to cart"}
              </button>
            </div>

            <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-sm text-ink/75">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(event) => {
                  setAgreed(event.target.checked)
                  if (event.target.checked) setTermsError(false)
                }}
                className="mt-0.5 h-4 w-4 accent-primary"
              />
              <span>
                I agree with the{" "}
                <Link to="/terms" className="underline underline-offset-2">
                  Terms &amp; conditions
                </Link>
              </span>
            </label>
            {termsError && (
              <p className="mt-1.5 text-xs font-medium text-red-600">
                Please agree to the Terms & conditions before proceeding.
              </p>
            )}

            <button
              type="button"
              onClick={buyNow}
              className={`motion-btn mt-3 w-full py-3.5 text-sm font-semibold tracking-wide uppercase transition-colors ${
                qty > 0 && agreed
                  ? "bg-primary text-cream hover:bg-primary/90"
                  : "bg-ink/10 text-ink/40"
              }`}
            >
              Buy it now
            </button>

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink/70">
              <button type="button" onClick={handleCompare} className="inline-flex items-center gap-1.5 hover:text-primary">
                Compare
              </button>
              <Link to="/contact" className="hover:text-primary">
                Ask a question
              </Link>
              <button type="button" onClick={handleShare} className="hover:text-primary">
                Share{shareNote ? ` · ${shareNote}` : ""}
              </button>
            </div>

            <p className="mt-5 text-[11px] tracking-wide text-ink/45 uppercase">
              Secure checkout · UPI · Cards
            </p>

            {descriptionBlock}
          </div>
        </div>
      </section>

      {similar.length > 0 && (
        <section className="border-t border-ink/10 bg-[#f7f1e8] px-4 py-10 sm:px-6">
          <div className="site-container">
            <h2 className="text-center font-display text-2xl text-primary sm:text-left sm:text-3xl">
              You might also like
            </h2>
            <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-5">
              {similar.map((item) => (
                <li key={item.id} className="min-w-0">
                  <ProductCard product={item} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  )
}