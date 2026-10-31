import { Link } from "react-router-dom"
import ProductImagePanel from "./ProductImagePanel"
import { useCart } from "../context/CartContext"

import { resolveCompareAt, productDisplayTitle } from "../data/products"

function formatDetailed(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export default function ShopProductCard({ product }) {
  const { addToCart } = useCart()
  const title = productDisplayTitle(product)
  const compareAt = resolveCompareAt(product)
  const showSale = compareAt > product.price

  return (
    <article className="group flex h-full flex-col">
      <ProductImagePanel
        product={product}
        onQuickAdd={() => addToCart(product.id)}
        onAddedToCart={() => {}}
      />
      <Link to={`/product/${product.id}`} className="mt-3 flex flex-1 flex-col">
        <h3 className="line-clamp-3 text-sm leading-snug text-ink transition-colors group-hover:text-primary">
          {title}
        </h3>
        <p className="mt-2 flex flex-wrap items-baseline gap-2 text-sm">
          {showSale && (
            <span className="text-ink/40 line-through">{formatDetailed(compareAt)}</span>
          )}
          <span className="font-medium text-ink">{formatDetailed(product.price)}</span>
        </p>
      </Link>
    </article>
  )
}
