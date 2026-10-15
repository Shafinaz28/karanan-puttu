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
    <article className="group">
      <Link to={`/product/${product.id}`} className="block">
        <div className="arch-photo">
          <img src={product.image} alt={product.name} />
          {off && (
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-secondary px-3 py-1 text-[11px] font-medium whitespace-nowrap text-ink">
              {off}
            </span>
          )}
        </div>
        <h3 className="mt-3 text-sm leading-5 font-medium text-primary">{product.name}</h3>
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
      </Link>
      <button
        type="button"
        onClick={() => {
          addToCart(product.id)
          setAdded(true)
        }}
        className="motion-btn motion-line mt-3 w-full border border-primary py-2 text-[10px] tracking-[0.12em] text-primary uppercase"
      >
        {added ? "Added" : "Add to cart"}
      </button>
    </article>
  )
}
