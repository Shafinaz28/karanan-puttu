import { Link, useNavigate, useParams } from "react-router-dom"
import { useProducts } from "../context/ProductsContext"
import { formatPrice } from "../data/products"

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products } = useProducts()
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

  const similar = products.filter((item) => item.id !== product.id).slice(0, 5)
  const highlights = [
    product.line,
    `${product.fabric} · ${product.length}`,
    product.color,
    "Blouse piece included",
    product.badge || "Soft silk",
  ].filter(Boolean)

  function buyNow() {
    navigate("/checkout", { state: { productId: product.id, qty: 1 } })
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <img
            src={product.image}
            alt={product.name}
            fetchPriority="high"
            decoding="async"
            className="block w-full rounded-2xl"
          />
          <p className="mt-6 text-xs tracking-[0.18em] text-secondary uppercase">Similar sarees</p>
          <ul className="mt-3 grid grid-cols-5 gap-2">
            {similar.map((item) => (
              <li key={item.id}>
                <Link to={`/product/${item.id}`} className="block overflow-hidden rounded-lg">
                  <img src={item.image} alt={item.name} className="aspect-[3/4] w-full object-cover object-top" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs tracking-[0.22em] text-secondary uppercase">{product.category}</p>
          <h1 className="mt-2 font-display text-5xl text-primary">{product.name}</h1>
          <p className="mt-4 flex flex-wrap items-baseline gap-3 text-xl">
            {product.compareAt && product.compareAt !== product.price && (
              <>
                <span className="text-base text-ink/40 line-through">{formatPrice(product.compareAt)}</span>
                <span className="text-xs font-medium text-emerald-700">50% off</span>
              </>
            )}
            <span>{formatPrice(product.price)}</span>
          </p>
          <p className="mt-4 max-w-md text-ink/80">{product.description}</p>

          <h2 className="mt-8 text-sm tracking-[0.16em] text-primary uppercase">Product highlights</h2>
          <ul className="mt-3 space-y-2 text-sm text-ink/80">
            {highlights.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-secondary">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h2 className="mt-8 text-sm tracking-[0.16em] text-primary uppercase">Additional details</h2>
          <dl className="mt-3 grid grid-cols-2 gap-4 text-sm">
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
            <div>
              <dt className="text-secondary">Weave</dt>
              <dd>{product.category}</dd>
            </div>
            <div>
              <dt className="text-secondary">Care</dt>
              <dd>Dry clean</dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={buyNow}
            className="motion-btn motion-fill mt-8 bg-primary px-8 py-3 text-sm text-cream"
          >
            Buy now
          </button>
        </div>
      </div>
    </section>
  )
}
