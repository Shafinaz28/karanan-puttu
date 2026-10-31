import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import ProductImagePanel from "./ProductImagePanel"
import { useCart } from "../context/CartContext"
import { formatPrice } from "../data/products"

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)
  const code = `KN${String(product.id).padStart(4, "0")}`

  useEffect(() => {
    if (!added) return undefined
    const timer = window.setTimeout(() => setAdded(false), 1200)
    return () => window.clearTimeout(timer)
  }, [added])

  return (
    <article className="group flex h-full min-w-0 flex-col">
      <ProductImagePanel
        product={product}
        onQuickAdd={() => {
          addToCart(product.id)
          setAdded(true)
        }}
        onAddedToCart={() => setAdded(true)}
      />
      <div className="flex flex-1 flex-col pt-3">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-xs leading-snug font-medium text-primary sm:min-h-10 sm:text-sm sm:leading-5">
          {product.name}
        </h3>
        <p className="mt-1 truncate text-[10px] text-ink/45 sm:text-[11px]">
          {code} | {product.category}
        </p>
        <p className="mt-1 text-sm">
          {product.compareAt && product.compareAt !== product.price && (
            <span className="mr-2 text-xs text-ink/35 line-through">
              {formatPrice(product.compareAt)}
            </span>
          )}
          <span className="font-semibold text-primary">{formatPrice(product.price)}</span>
        </p>
        <div className="mt-auto pt-3">
          <button
            type="button"
            onClick={() => {
              addToCart(product.id)
              setAdded(true)
            }}
            className="motion-btn motion-line w-full max-w-full border border-primary px-1 py-2 text-[9px] tracking-[0.08em] text-primary uppercase sm:px-2 sm:text-[10px] sm:tracking-[0.12em]"
          >
            {added ? "Added" : "Add to cart"}
          </button>
        </div>
      </div>
    </article>
  )
}
