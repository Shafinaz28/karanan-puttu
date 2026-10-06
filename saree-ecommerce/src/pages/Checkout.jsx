import { useState } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { formatPrice, products } from "../data/products"

const emptyForm = {
  name: "",
  phone: "",
  address: "",
  city: "",
  pincode: "",
}

export default function Checkout() {
  const { items, clearCart } = useCart()
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState("")
  const [order, setOrder] = useState(null)

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

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const missing = Object.values(form).some((value) => value.trim() === "")
    if (missing) {
      setError("Please fill in every field.")
      return
    }
    setError("")
    const phoneDigits = form.phone.replace(/\D/g, "")
    setOrder({
      id: `KN${phoneDigits.slice(-6) || "100001"}`,
      name: form.name.trim(),
      total,
    })
    clearCart()
  }

  if (order) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-xs tracking-[0.22em] text-secondary uppercase">
          Order {order.id}
        </p>
        <h1 className="mt-2 font-display text-5xl text-primary">
          Thank you, {order.name}.
        </h1>
        <p className="mt-4">
          Your saree order for {formatPrice(order.total)} is noted. This is a
          demo shop, so no payment was taken.
        </p>
        <Link
          to="/shop"
          className="motion-btn motion-fill mt-8 inline-block bg-primary px-6 py-3 text-sm text-cream"
        >
          Continue shopping
        </Link>
      </section>
    )
  }

  if (lines.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="font-display text-5xl text-primary">Checkout</h1>
        <p className="mt-4">Add a saree before checkout.</p>
        <Link to="/shop" className="mt-4 inline-block text-sm text-primary">
          Go to shop
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2">
      <div>
        <h1 className="font-display text-5xl text-primary">Checkout</h1>
        <p className="mt-3 text-sm text-ink/70">
          Cash on delivery only for this demo. No payment is processed.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <Field label="Name" name="name" value={form.name} onChange={updateField} />
          <Field label="Phone" name="phone" value={form.phone} onChange={updateField} />
          <Field
            label="Address"
            name="address"
            value={form.address}
            onChange={updateField}
          />
          <Field label="City" name="city" value={form.city} onChange={updateField} />
          <Field
            label="Pincode"
            name="pincode"
            value={form.pincode}
            onChange={updateField}
          />
          {error && <p className="text-sm text-primary">{error}</p>}
          <button type="submit" className="motion-btn motion-fill bg-primary px-6 py-3 text-sm text-cream">
            Place order
          </button>
        </form>
      </div>
      <aside className="h-fit rounded-2xl border border-secondary/40 p-5">
        <h2 className="font-display text-3xl text-primary">Your order</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {lines.map((line) => (
            <li key={line.id} className="flex justify-between gap-4">
              <span>
                {line.product.name} × {line.qty}
              </span>
              <span>{formatPrice(line.product.price * line.qty)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-secondary/40 pt-4 text-lg">
          Total {formatPrice(total)}
        </p>
      </aside>
    </section>
  )
}

function Field({ label, name, value, onChange }) {
  return (
    <label className="grid gap-1 text-sm">
      {label}
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="rounded-lg border border-primary/20 bg-white px-3 py-2 text-ink outline-none focus:border-secondary"
      />
    </label>
  )
}
