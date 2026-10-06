import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { formatPrice, products } from "../data/products"

export default function Cart() {
  const { items, updateQty, removeFromCart, addToCart } = useCart()

  const lines = items
    .map((item) => ({
      ...item,
      product: products.find((product) => product.id === item.id),
    }))
    .filter((line) => line.product)

  const total = lines.reduce(
    (sum, line) => sum + line.product.price * line.qty,
    0,
  )

  const inCart = new Set(lines.map((line) => line.id))
  const suggestions = products.filter((product) => !inCart.has(product.id)).slice(0, 4)

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-5xl text-primary">Cart</h1>

      {lines.length === 0 ? (
        <div className="mt-8">
          <p>Your cart is empty.</p>
          <Link
            to="/shop"
            className="motion-btn motion-fill mt-6 inline-block bg-primary px-6 py-3 text-sm text-cream"
          >
            Shop sarees
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_280px]">
          <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
            <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-ink/10 bg-[#f6efe4] text-[11px] tracking-[0.14em] text-ink/70 uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Quantity</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Remove</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => (
                  <tr key={line.id} className="border-b border-ink/10">
                    <td className="px-4 py-4">
                      <Link
                        to={`/product/${line.product.id}`}
                        className="flex items-center gap-3"
                      >
                        <img
                          src={line.product.image}
                          alt=""
                          className="h-20 w-16 rounded-lg object-cover"
                        />
                        <span className="font-display text-xl text-primary">
                          {line.product.name}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-4">{formatPrice(line.product.price)}</td>
                    <td className="px-4 py-4">
                      <div className="inline-flex items-center overflow-hidden rounded-lg border border-primary/30">
                        <button
                          type="button"
                          onClick={() => updateQty(line.id, line.qty - 1)}
                          className="motion-step h-8 w-8 text-primary"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-8 text-center">{line.qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(line.id, line.qty + 1)}
                          className="motion-step h-8 w-8 text-primary"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {formatPrice(line.product.price * line.qty)}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => removeFromCart(line.id)}
                        className="motion-step inline-flex h-8 w-8 items-center justify-center text-lg text-primary"
                        aria-label={`Remove ${line.product.name}`}
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          <aside className="rounded-2xl border border-ink/10 bg-white p-5">
            <h2 className="font-display text-3xl text-primary">Cart totals</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between border-b border-ink/10 pb-3">
                <dt>Subtotal</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
              <div className="flex justify-between font-medium">
                <dt>Total</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>
            <Link
              to="/checkout"
              className="motion-btn motion-fill mt-6 block bg-primary px-4 py-3 text-center text-sm text-cream"
            >
              Checkout
            </Link>
          </aside>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="mt-14">
          <h2 className="font-display text-3xl text-primary">You may be interested in</h2>
          <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {suggestions.map((product) => (
              <li key={product.id} className="motion-card border border-ink/10 bg-white">
                <Link to={`/product/${product.id}`} className="block overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="motion-zoom aspect-[3/4] w-full object-cover"
                  />
                </Link>
                <div className="p-3">
                  <p className="text-sm text-ink">{product.name}</p>
                  <p className="mt-1 text-sm text-primary">{formatPrice(product.price)}</p>
                  <button
                    type="button"
                    onClick={() => addToCart(product.id)}
                    className="motion-btn motion-line mt-3 w-full border border-primary py-2 text-[11px] tracking-[0.12em] text-primary uppercase"
                  >
                    Add to bag
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
