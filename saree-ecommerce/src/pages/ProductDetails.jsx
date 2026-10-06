import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { formatPrice, products } from "../data/products"

export default function ProductDetails() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)
  const product = products.find((item) => item.id === Number(id))

  if (!product) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="font-display text-4xl text-primary">Saree not found</h1>
        <Link to="/shop" className="mt-4 inline-block text-sm text-primary">
          Back to shop
        </Link>
      </section>
    )
  }

  function handleAdd() {
    addToCart(product.id)
    setAdded(true)
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2">
      <img
        src={product.image}
        alt={product.name}
        className="w-full rounded-2xl object-cover"
      />
      <div>
        <p className="text-xs tracking-[0.22em] text-secondary uppercase">
          {product.category}
        </p>
        <h1 className="mt-2 font-display text-5xl text-primary">
          {product.name}
        </h1>
        <p className="mt-4 text-xl">{formatPrice(product.price)}</p>
        <p className="mt-4 max-w-md text-ink/80">{product.description}</p>

        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-secondary">Fabric</dt>
            <dd>{product.fabric}</dd>
          </div>
          <div>
            <dt className="text-secondary">Length</dt>
            <dd>{product.length}</dd>
          </div>
          <div>
            <dt className="text-secondary">Colour</dt>
            <dd>{product.color}</dd>
          </div>
          <div>
            <dt className="text-secondary">Blouse</dt>
            <dd>Piece included</dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={handleAdd}
          className="motion-btn motion-fill mt-8 bg-primary px-6 py-3 text-sm text-cream"
        >
          {added ? "Added to cart" : "Add to cart"}
        </button>
      </div>
    </section>
  )
}
