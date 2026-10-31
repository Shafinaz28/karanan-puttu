import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { isInWishlist, toggleWishlistId } from "../hooks/useWishlist"
import QuickViewModal from "./QuickViewModal"

function ActionIcon({ label, tooltip, onClick, active, children }) {
  const base =
    "flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-md transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
  return (
    <div className="product-media-icon-wrap group/icon relative">
      <button
        type="button"
        aria-label={label}
        aria-pressed={active}
        title={tooltip}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          onClick?.(event)
        }}
        className={base}
      >
        {children}
      </button>
      <span className="product-media-tooltip" role="tooltip">
        {tooltip}
      </span>
    </div>
  )
}

export default function ProductImagePanel({ product, onAddedToCart, badge }) {
  const [saved, setSaved] = useState(() => isInWishlist(product.id))
  const [quickViewOpen, setQuickViewOpen] = useState(false)

  useEffect(() => {
    const sync = () => setSaved(isInWishlist(product.id))
    window.addEventListener("karnan-wishlist", sync)
    return () => window.removeEventListener("karnan-wishlist", sync)
  }, [product.id])

  return (
    <div className="product-media relative w-full max-w-full">
      <Link to={`/product/${product.id}`} className="arch-photo relative block" tabIndex={-1}>
        <img src={product.image} alt={product.name} decoding="async" />
        {badge}
      </Link>

      <div className="product-media-actions" aria-hidden={false}>
        <div className="product-media-icons">
          <ActionIcon
            label={saved ? "Remove from wishlist" : "Add to wishlist"}
            tooltip="Wishlist"
            active={saved}
            onClick={() => setSaved(toggleWishlistId(product.id))}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.75">
              <path d="M12 2l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 8.8l6.5-.9L12 2z" />
            </svg>
          </ActionIcon>
          <ActionIcon label="Quick view" tooltip="Quick view" onClick={() => setQuickViewOpen(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </ActionIcon>
        </div>
      </div>

      {quickViewOpen && (
        <QuickViewModal
          product={product}
          onClose={() => setQuickViewOpen(false)}
          onAdded={() => onAddedToCart?.()}
        />
      )}
    </div>
  )
}
