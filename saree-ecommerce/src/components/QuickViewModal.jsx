import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { createPortal } from "react-dom"
import { useCart } from "../context/CartContext"
import { formatPrice, productDisplayTitle } from "../data/products"

function formatPriceDetailed(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export default function QuickViewModal({ product, onClose, onAdded }) {
  const cart = useCart()
  const [qty, setQty] = useState(0)
  const [agreed, setAgreed] = useState(false)

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    function onKey(event) {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener("keydown", onKey)
    }
  }, [onClose])

  if (!product) return null

  const title = productDisplayTitle(product, { includeLine: false })
  const blurb = product.description || product.line || ""

  const canAdd = qty >= 1 && agreed && Boolean(cart?.addToCart)

  function handleAdd() {
    if (!canAdd) return
    cart.addToCart(Number(product.id), qty)
    onAdded?.()
    onClose()
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#1a1210]/70 backdrop-blur-[1px]"
        aria-label="Close quick view"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[min(92vh,720px)] w-full max-w-5xl flex-col overflow-hidden bg-white shadow-2xl md:max-h-[min(88vh,680px)] md:flex-row">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-xl leading-none text-ink/70 shadow-sm transition hover:text-primary md:top-4 md:right-4"
          aria-label="Close"
        >
          ×
        </button>

        <div className="relative aspect-[3/4] max-h-[45vh] shrink-0 bg-[#f0e6d8] md:aspect-auto md:max-h-none md:w-[48%]">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover object-top"
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto border-t border-ink/10 p-6 sm:p-8 md:border-t-0 md:border-l">
          <h2 id="quick-view-title" className="pr-10 font-display text-2xl leading-snug text-ink sm:text-[1.65rem]">
            {title}
          </h2>
          <p className="mt-4 text-lg font-medium text-ink">{formatPriceDetailed(product.price)}</p>
          {product.compareAt && product.compareAt > product.price && (
            <p className="mt-1 text-sm text-ink/45 line-through">{formatPrice(product.compareAt)}</p>
          )}
          <p className="mt-4 text-sm leading-7 text-ink/65">{blurb}</p>
          <Link
            to={`/product/${product.id}`}
            onClick={onClose}
            className="mt-3 inline-block text-sm text-primary underline underline-offset-2 hover:text-primary-soft"
          >
            View details
          </Link>

          <div className="mt-8">
            <p className="text-sm font-semibold text-ink">Quantity</p>
            <div className="mt-2 inline-flex items-stretch border border-ink/20">
              <button
                type="button"
                className="px-3 py-2 text-lg text-ink/70 hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-35"
                aria-label="Decrease quantity"
                disabled={qty <= 0}
                onClick={() => setQty((value) => Math.max(0, value - 1))}
              >
                −
              </button>
              <span className="flex min-w-[3rem] items-center justify-center border-x border-ink/20 px-2 text-sm font-medium">
                {qty}
              </span>
              <button
                type="button"
                className="px-3 py-2 text-lg text-ink/70 hover:bg-ink/5"
                aria-label="Increase quantity"
                onClick={() => setQty((value) => value + 1)}
              >
                +
              </button>
            </div>
          </div>

          <label className="mt-6 flex cursor-pointer items-start gap-2.5 text-sm text-ink/75">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
            />
            <span>
              I agree with the{" "}
              <Link to="/terms" onClick={onClose} className="underline underline-offset-2">
                Terms &amp; conditions
              </Link>
            </span>
          </label>

          <button
            type="button"
            disabled={!canAdd}
            onClick={handleAdd}
            className="motion-btn mt-4 w-full bg-primary py-3.5 text-sm font-semibold tracking-wide text-cream uppercase transition enabled:hover:bg-primary-soft disabled:cursor-not-allowed disabled:opacity-45"
          >
            Add to cart
          </button>
          {!agreed && qty >= 1 && (
            <p className="mt-2 text-xs text-ink/50">Tick the terms box above to add this saree.</p>
          )}
          {agreed && qty < 1 && (
            <p className="mt-2 text-xs text-ink/50">Use + to choose how many you want.</p>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
