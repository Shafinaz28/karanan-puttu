import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useProducts } from "../context/ProductsContext"
import { formatPrice } from "../data/products"
import { saveOrder, updateOrderStatus } from "../lib/orders"
import OrderConfirmed from "../components/OrderConfirmed"

const states = [
  "Karnataka",
  "Tamil Nadu",
  "Kerala",
  "Andhra Pradesh",
  "Telangana",
  "Maharashtra",
  "Delhi",
  "Gujarat",
  "Rajasthan",
  "West Bengal",
]

const emptyForm = {
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  apartment: "",
  city: "",
  state: "Karnataka",
  pincode: "",
  phone: "",
  billingSame: true,
  billAddress: "",
  billCity: "",
  billState: "Karnataka",
  billPincode: "",
}

export default function Checkout() {
  const location = useLocation()
  const buyNowId = location.state?.productId
  const { items, clearCart } = useCart()
  const { products } = useProducts()
  const [buyQty] = useState(location.state?.qty || 1)
  const [payment, setPayment] = useState("Cash on delivery")
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState("")
  const [order, setOrder] = useState(null)
  const [code, setCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [paying, setPaying] = useState(false)
  const [payMode, setPayMode] = useState("upi")
  const [upi, setUpi] = useState("")
  const [card, setCard] = useState({ name: "", number: "", expiry: "", cvv: "" })
  const [payError, setPayError] = useState("")

  const lines = buyNowId
    ? [{ id: buyNowId, qty: buyQty, product: products.find((product) => product.id === Number(buyNowId)) }].filter((line) => line.product)
    : items
      .map((item) => ({
        ...item,
        product: products.find((product) => product.id === item.id),
      }))
      .filter((line) => line.product)

  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.qty, 0)
  const shipping = 0
  const total = Math.max(0, subtotal - discount + shipping)
  const count = lines.reduce((sum, line) => sum + line.qty, 0)

  function updateField(event) {
    const { name, value, type, checked } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  function applyCode(event) {
    event.preventDefault()
    if (code.trim().toUpperCase() === "KARNAN10") {
      setDiscount(Math.round(subtotal * 0.1))
      setError("")
      return
    }
    setDiscount(0)
    setError("That code is not active.")
  }

  function placeOrder(event) {
    event.preventDefault()
    const required = ["email", "firstName", "lastName", "address", "city", "state", "pincode", "phone"]
    if (required.some((key) => String(form[key]).trim() === "")) {
      setError("Fill in the contact and delivery fields.")
      return
    }
    if (!form.email.includes("@")) {
      setError("Enter a valid email.")
      return
    }
    if (form.phone.replace(/\D/g, "").length < 10) {
      setError("Enter a 10-digit phone number.")
      return
    }
    if (!/^\d{6}$/.test(form.pincode.trim())) {
      setError("Enter a 6-digit PIN code.")
      return
    }
    if (!form.billingSame && (!form.billAddress.trim() || !form.billCity.trim() || !/^\d{6}$/.test(form.billPincode.trim()))) {
      setError("Fill in the billing address.")
      return
    }
    setError("")
    if (payment === "Pay online") {
      setPaying(true)
      setPayError("")
      return
    }
    finishOrder("Cash on delivery")
  }

  function finishOrder(method) {
    const address = [form.address, form.apartment].map((part) => part.trim()).filter(Boolean).join(", ")
    const saved = saveOrder({
      customer: `${form.firstName.trim()} ${form.lastName.trim()}`,
      phone: form.phone.trim(),
      address,
      city: form.city.trim(),
      state: form.state,
      pincode: form.pincode.trim(),
      payment: method,
      amount: total,
      items: lines.map((line) => ({
        id: line.product.id,
        name: line.product.name,
        qty: line.qty,
        price: line.product.price,
        image: line.product.image,
      })),
    })
    if (!buyNowId) clearCart()
    setPaying(false)
    setOrder(saved)
  }

  function finishPayment(event) {
    event.preventDefault()
    if (payMode === "upi") {
      if (!/^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(upi.trim())) {
        setPayError("Enter a UPI ID such as name@oksbi.")
        return
      }
    } else {
      const digits = card.number.replace(/\D/g, "")
      if (!card.name.trim() || digits.length < 16 || !/^\d{2}\/\d{2}$/.test(card.expiry) || card.cvv.replace(/\D/g, "").length < 3) {
        setPayError("Enter the card name, 16-digit number, expiry, and CVV.")
        return
      }
    }
    setPayError("")
    setUpi("")
    setCard({ name: "", number: "", expiry: "", cvv: "" })
    finishOrder("Pay online")
  }

  if (order) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-xs tracking-[0.22em] text-secondary uppercase">Thank you, {order.customer}</p>
        <div className="mt-8">
          <OrderConfirmed
            order={order}
            onCancel={(details) => {
              updateOrderStatus(order.id, "Cancelled", details)
              setOrder({ ...order, status: "Cancelled", ...details })
            }}
          />
        </div>
        <Link to="/shop" className="mt-8 inline-block text-sm text-primary">Continue shopping</Link>
      </section>
    )
  }

  if (lines.length === 0 && !paying) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="font-display text-5xl text-primary">Checkout</h1>
        <p className="mt-4">Add a saree before checkout.</p>
        <Link to="/shop" className="mt-4 inline-block text-sm text-primary">Go to shop</Link>
      </section>
    )
  }

  if (paying) {
    return (
      <section className="bg-[#f6f1ea]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1.15fr_0.85fr]">
          <form onSubmit={finishPayment} className="rounded-xl border border-black/10 bg-white p-6">
            <p className="text-xs tracking-[0.18em] text-secondary uppercase">Online payment</p>
            <h1 className="mt-2 font-display text-4xl text-primary">Pay {formatPrice(total)}</h1>
            <p className="mt-2 text-sm text-ink/60">Finish this payment to confirm the order.</p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              {[["upi", "UPI"], ["card", "Card"]].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPayMode(id)}
                  className={`rounded-md border px-3 py-2 text-sm ${payMode === id ? "border-primary bg-[#f6efe4]" : "border-black/15"}`}
                >
                  {label}
                </button>
              ))}
            </div>
            {payMode === "upi" ? (
              <label className="mt-4 grid gap-1 text-sm">
                UPI ID
                <input value={upi} onChange={(event) => setUpi(event.target.value)} placeholder="name@oksbi" className="rounded-md border border-black/15 px-3 py-2.5 outline-none focus:border-primary" />
              </label>
            ) : (
              <div className="mt-4 grid gap-3">
                <label className="grid gap-1 text-sm">
                  Name on card
                  <input value={card.name} onChange={(event) => setCard((current) => ({ ...current, name: event.target.value }))} className="rounded-md border border-black/15 px-3 py-2.5 outline-none focus:border-primary" />
                </label>
                <label className="grid gap-1 text-sm">
                  Card number
                  <input inputMode="numeric" value={card.number} onChange={(event) => setCard((current) => ({ ...current, number: event.target.value }))} placeholder="1234 5678 9012 3456" className="rounded-md border border-black/15 px-3 py-2.5 outline-none focus:border-primary" />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="grid gap-1 text-sm">
                    Expiry
                    <input value={card.expiry} onChange={(event) => setCard((current) => ({ ...current, expiry: event.target.value }))} placeholder="MM/YY" className="rounded-md border border-black/15 px-3 py-2.5 outline-none focus:border-primary" />
                  </label>
                  <label className="grid gap-1 text-sm">
                    CVV
                    <input inputMode="numeric" value={card.cvv} onChange={(event) => setCard((current) => ({ ...current, cvv: event.target.value }))} className="rounded-md border border-black/15 px-3 py-2.5 outline-none focus:border-primary" />
                  </label>
                </div>
              </div>
            )}
            {payError && <p className="mt-3 text-sm text-primary">{payError}</p>}
            <button type="submit" className="mt-5 w-full rounded-md bg-[#3a1216] py-3.5 text-sm text-[#f6efe4]">
              Pay {formatPrice(total)}
            </button>
            <button type="button" onClick={() => setPaying(false)} className="mt-3 w-full text-sm text-ink/60">
              Back to checkout
            </button>
          </form>
          <aside className="h-fit rounded-xl border border-black/10 bg-white p-5">
            <ul className="space-y-4">
              {lines.map((line) => (
                <li key={line.id} className="flex items-center gap-3">
                  <img src={line.product.image} alt="" className="h-16 w-14 rounded-md object-cover object-top" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{line.product.name}</p>
                    <p className="text-xs text-ink/45">Qty {line.qty}</p>
                  </div>
                  <p className="text-sm">{formatPrice(line.product.price * line.qty)}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-black/10 pt-4 text-sm">Total {formatPrice(total)}</p>
          </aside>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-[#f6f1ea]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1.15fr_0.85fr]">
        <form onSubmit={placeOrder} className="space-y-8">
          <header>
            <p className="font-display text-2xl tracking-[0.18em] text-primary uppercase">Karnan Pattu</p>
            <p className="text-[11px] tracking-[0.16em] text-ink/45 uppercase">Sarees and more</p>
          </header>

          <fieldset>
            <label className="grid gap-1 text-sm">
              Email
              <input name="email" type="email" value={form.email} onChange={updateField} placeholder="name@email.com" className="rounded-md border border-black/15 bg-white px-3 py-2.5 outline-none focus:border-primary" />
            </label>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-lg font-medium text-primary">Delivery</legend>
            <label className="grid gap-1 text-sm">
              Country / region
              <select className="rounded-md border border-black/15 bg-white px-3 py-2.5 outline-none" defaultValue="India">
                <option>India</option>
              </select>
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="First name" name="firstName" value={form.firstName} onChange={updateField} />
              <Field label="Last name" name="lastName" value={form.lastName} onChange={updateField} />
            </div>
            <Field label="Address" name="address" value={form.address} onChange={updateField} />
            <Field label="Apartment, suite, etc. (optional)" name="apartment" value={form.apartment} onChange={updateField} />
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="City" name="city" value={form.city} onChange={updateField} />
              <label className="grid gap-1 text-sm">
                State
                <select name="state" value={form.state} onChange={updateField} className="rounded-md border border-black/15 bg-white px-3 py-2.5 outline-none">
                  {states.map((state) => <option key={state}>{state}</option>)}
                </select>
              </label>
              <Field label="PIN code" name="pincode" value={form.pincode} onChange={updateField} />
            </div>
            <Field label="Phone" name="phone" value={form.phone} onChange={updateField} />
          </fieldset>

          <fieldset>
            <legend className="text-lg font-medium text-primary">Shipping method</legend>
            <label className="mt-3 flex items-center justify-between rounded-md border border-primary bg-white px-4 py-3 text-sm">
              <span className="flex items-center gap-2">
                <input type="radio" checked readOnly />
                Free delivery across India
              </span>
              <span>Free</span>
            </label>
          </fieldset>

          <fieldset>
            <legend className="text-lg font-medium text-primary">Payment</legend>
            <p className="mt-1 text-sm text-ink/55">All transactions are secure. Pay online opens the payment screen before the order is confirmed.</p>
            <div className="mt-3 overflow-hidden rounded-md border border-black/15 bg-white">
              {["Cash on delivery", "Pay online"].map((method) => (
                <label key={method} className={`flex cursor-pointer items-center gap-3 border-b border-black/10 px-4 py-3 text-sm last:border-b-0 ${payment === method ? "bg-[#f6efe4]" : ""}`}>
                  <input type="radio" name="payment" checked={payment === method} onChange={() => setPayment(method)} />
                  {method}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-lg font-medium text-primary">Billing address</legend>
            <div className="mt-3 overflow-hidden rounded-md border border-black/15 bg-white">
              <label className="flex items-center gap-3 border-b border-black/10 px-4 py-3 text-sm">
                <input type="radio" name="billingSame" checked={form.billingSame} onChange={() => setForm((current) => ({ ...current, billingSame: true }))} />
                Same as shipping address
              </label>
              <label className="flex items-center gap-3 px-4 py-3 text-sm">
                <input type="radio" name="billingSame" checked={!form.billingSame} onChange={() => setForm((current) => ({ ...current, billingSame: false }))} />
                Use a different billing address
              </label>
            </div>
            {!form.billingSame && (
              <div className="mt-3 grid gap-3">
                <Field label="Billing address" name="billAddress" value={form.billAddress} onChange={updateField} />
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label="City" name="billCity" value={form.billCity} onChange={updateField} />
                  <label className="grid gap-1 text-sm">
                    State
                    <select name="billState" value={form.billState} onChange={updateField} className="rounded-md border border-black/15 bg-white px-3 py-2.5 outline-none">
                      {states.map((state) => <option key={state}>{state}</option>)}
                    </select>
                  </label>
                  <Field label="PIN code" name="billPincode" value={form.billPincode} onChange={updateField} />
                </div>
              </div>
            )}
          </fieldset>

          {error && <p className="text-sm text-primary">{error}</p>}
          <button type="submit" className="w-full rounded-md bg-[#3a1216] py-3.5 text-sm text-[#f6efe4]">
            {payment === "Pay online" ? "Continue to payment" : "Place order"}
          </button>
        </form>

        <aside className="h-fit rounded-xl border border-black/10 bg-white p-5 lg:sticky lg:top-6">
          <ul className="space-y-4">
            {lines.map((line) => (
              <li key={line.id} className="flex items-center gap-3">
                <img src={line.product.image} alt="" className="h-16 w-14 rounded-md object-cover object-top" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{line.product.name}</p>
                  <p className="text-xs text-ink/45">Qty {line.qty}</p>
                </div>
                <p className="text-sm">{formatPrice(line.product.price * line.qty)}</p>
              </li>
            ))}
          </ul>
          <form onSubmit={applyCode} className="mt-5 flex gap-2">
            <input value={code} onChange={(event) => setCode(event.target.value)} placeholder="Discount code or gift card" className="min-w-0 flex-1 rounded-md border border-black/15 px-3 py-2 text-sm outline-none" />
            <button type="submit" className="rounded-md bg-[#3a1216] px-4 text-sm text-[#f6efe4]">Apply</button>
          </form>
          <dl className="mt-5 space-y-2 border-t border-black/10 pt-4 text-sm">
            <div className="flex justify-between"><dt>Subtotal · {count} {count === 1 ? "item" : "items"}</dt><dd>{formatPrice(subtotal)}</dd></div>
            {discount > 0 && <div className="flex justify-between text-emerald-700"><dt>Order discount</dt><dd>−{formatPrice(discount)}</dd></div>}
            <div className="flex justify-between"><dt>Shipping</dt><dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd></div>
            <div className="flex justify-between pt-2 text-base font-medium"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
          </dl>
        </aside>
      </div>
    </section>
  )
}

function Field({ label, name, value, onChange }) {
  return (
    <label className="grid gap-1 text-sm">
      {label}
      <input name={name} value={value} onChange={onChange} className="rounded-md border border-black/15 bg-white px-3 py-2.5 outline-none focus:border-primary" />
    </label>
  )
}
