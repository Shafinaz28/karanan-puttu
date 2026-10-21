import { useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { findOrder, updateOrderStatus } from "../lib/orders"
import OrderConfirmed from "../components/OrderConfirmed"

export default function Track() {
  const [searchParams] = useSearchParams()
  const [orderId, setOrderId] = useState(searchParams.get("id") || "")
  const [phone, setPhone] = useState("")
  const [order, setOrder] = useState(null)
  const [error, setError] = useState("")

  function lookup(event) {
    event.preventDefault()
    const found = findOrder(orderId, phone)
    if (!found) {
      setOrder(null)
      setError("No order matches that number and phone. Use the order id from the thank-you page, like KP1001.")
      return
    }
    setError("")
    setOrder(found)
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-xs tracking-[0.22em] text-secondary uppercase">Order tracking</p>
      <h1 className="mt-2 font-display text-5xl text-primary">Track your saree</h1>
      <p className="mt-3 max-w-xl text-sm text-ink/70">
        Enter the order number and the contact number used at checkout.
      </p>
      <form onSubmit={lookup} className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm">
          Order number
          <input
            value={orderId}
            onChange={(event) => setOrderId(event.target.value)}
            placeholder="KP1001"
            className="rounded-lg border border-primary/20 bg-white px-3 py-2 outline-none focus:border-secondary"
          />
        </label>
        <label className="grid gap-1 text-sm">
          Contact number
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="10-digit mobile"
            className="rounded-lg border border-primary/20 bg-white px-3 py-2 outline-none focus:border-secondary"
          />
        </label>
        <button type="submit" className="motion-btn motion-fill bg-primary px-6 py-3 text-sm text-cream sm:col-span-2">
          Track order
        </button>
      </form>
      {error && <p className="mt-4 text-sm text-primary">{error}</p>}

      {order && (
        <div className="mt-8">
          <OrderConfirmed
            order={order}
            onCancel={(details) => {
              updateOrderStatus(order.id, "Cancelled", details)
              setOrder({ ...order, status: "Cancelled", ...details })
            }}
          />
        </div>
      )}
      <Link to="/shop" className="mt-8 inline-block text-sm text-primary">Back to shop</Link>
    </section>
  )
}
