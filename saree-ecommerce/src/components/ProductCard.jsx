import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { formatPrice } from "../data/products"

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)
  const off =
    product.offer ||
    (product.compareAt > product.price
      ? `${Math.round((1 - product.price / product.compareAt) * 100)}% off`
      : null)
  const code = `KN${String(product.id).padStart(4, "0")}`

  useEffect(() => {
    if (!added) return undefined
    const timer = window.setTimeout(() => setAdded(false), 1200)
    return () => window.clearTimeout(timer)
  }, [added])

  return (
    <article className="group flex h-full flex-col">
      <Link to={`/product/${product.id}`} className="block">
        <div className="arch-photo">
          <img src={product.image} alt={product.name} decoding="async" />
          {off && (
            <span className="absolute top-3 left-3 z-10 bg-[#f7f1e8] px-2 py-1 text-[10px] tracking-wide text-primary">
              {off}
            </span>
          )}
          <span className="quick-view">View saree</span>
        </div>
      </Link>
      <div className="flex flex-1 flex-col pt-3">
        <h3 className="line-clamp-2 min-h-10 text-sm leading-5 font-medium text-primary">{product.name}</h3>
        <p className="mt-1 truncate text-[11px] text-ink/45">
          {code} | {product.category}
        </p>
        <p className="mt-1 text-sm">
          <span className="font-semibold text-primary">{formatPrice(product.price)}</span>
          {product.compareAt && (
            <span className="ml-2 text-xs text-ink/35 line-through">
              {formatPrice(product.compareAt)}
            </span>
          )}
        </p>
        <div className="mt-auto pt-3">
          <button
            type="button"
            onClick={() => {
              addToCart(product.id)
              setAdded(true)
            }}
            className="motion-btn motion-line w-full border border-primary py-2 text-[10px] tracking-[0.12em] text-primary uppercase"
          >
            {added ? "Added" : "Add to cart"}
          </button>
        </div>
      </div>
    </article>
  )
}
