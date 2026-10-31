import { useMemo, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useProducts } from "../context/ProductsContext"
import { formatPrice, productDisplayTitle } from "../data/products"
import { saveOrder, updateOrderStatus } from "../lib/orders"
import { supabase } from "../lib/supabase"
import OrderConfirmed from "../components/OrderConfirmed"

const SHIPPING_FEE = 199

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
  marketing: true,
  firstName: "",
  lastName: "",
  address: "",
  apartment: "",
  city: "",
  state: "Karnataka",
  pincode: "",
  phone: "",
  saveInfo: false,
  billingSame: true,
  billAddress: "",
  billCity: "",
  billState: "Karnataka",
  billPincode: "",
}

const inputClass =
  "w-full rounded-lg border border-black/15 bg-white px-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"

function formatDetailed(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

function lineTitle(product) {
  return productDisplayTitle(product, { short: true })
}

export default function Checkout() {
  const location = useLocation()
  const buyNowId = location.state?.productId
  const { items, clearCart } = useCart()
  const { products } = useProducts()
  const [buyQty] = useState(location.state?.qty || 1)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState("")
  const [order, setOrder] = useState(null)
  const [code, setCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [appliedCode, setAppliedCode] = useState("")
  const [couponMessage, setCouponMessage] = useState("")
  const [applyingCode, setApplyingCode] = useState(false)

  const lines = buyNowId
    ? [{ id: buyNowId, qty: buyQty, product: products.find((product) => product.id === Number(buyNowId)) }].filter(
        (line) => line.product,
      )
    : items
        .map((item) => ({
          ...item,
          product: products.find((product) => product.id === item.id),
        }))
        .filter((line) => line.product)

  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.qty, 0)
  const addressComplete = useMemo(() => {
    return (
      form.address.trim().length > 0 &&
      form.city.trim().length > 0 &&
      form.state.trim().length > 0 &&
      /^\d{6}$/.test(form.pincode.trim())
    )
  }, [form.address, form.city, form.state, form.pincode])

  const shipping = lines.length && addressComplete ? SHIPPING_FEE : 0
  const total = Math.max(0, subtotal - discount + shipping)
  const count = lines.reduce((sum, line) => sum + line.qty, 0)
  const taxIncluded = total > 0 ? Math.round(((total * 18) / 118) * 100) / 100 : 0

  function updateField(event) {
    const { name, value, type, checked } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  async function applyCode(event) {
    event.preventDefault()
    const normalizedCode = code.trim().toUpperCase()
    if (!normalizedCode) {
      setDiscount(0)
      setAppliedCode("")
      setCouponMessage("Enter a discount code.")
      return
    }
    if (!supabase) {
      setDiscount(0)
      setAppliedCode("")
      setCouponMessage("Discount codes are unavailable. Please try again later.")
      return
    }

    setApplyingCode(true)
    setCouponMessage("")
    try {
      const { data: coupon, error: couponError } = await supabase
        .from("coupons")
        .select("code, discount_type, discount_value, minimum_order")
        .eq("code", normalizedCode)
        .eq("is_active", true)
        .maybeSingle()
      if (couponError) throw couponError
      if (!coupon) {
        setDiscount(0)
        setAppliedCode("")
        setCouponMessage("That discount code is not active.")
        return
      }

      const minimumOrder = Number(coupon.minimum_order || 0)
      if (subtotal < minimumOrder) {
        setDiscount(0)
        setAppliedCode("")
        setCouponMessage(`This code requires a minimum order of ${formatPrice(minimumOrder)}.`)
        return
      }

      const value = Number(coupon.discount_value)
      const amount =
        coupon.discount_type === "percent" ? Math.round((subtotal * value) / 100) : Math.round(value)
      setDiscount(Math.min(subtotal, amount))
      setAppliedCode(coupon.code)
      setCouponMessage(`${coupon.code} applied successfully.`)
    } catch (couponError) {
      setDiscount(0)
      setAppliedCode("")
      setCouponMessage(couponError instanceof Error ? couponError.message : "Unable to validate this discount.")
    } finally {
      setApplyingCode(false)
    }
  }

  function validateContactAndDelivery() {
    const contact = form.email.trim()
    if (!contact) {
      setError("Enter your email or mobile phone number.")
      return false
    }
    const isEmail = contact.includes("@")
    if (isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
      setError("Enter a valid email address.")
      return false
    }
    if (!isEmail && contact.replace(/\D/g, "").length < 10) {
      setError("Enter a valid 10-digit mobile number.")
      return false
    }
    if (!form.lastName.trim()) {
      setError("Enter your last name.")
      return false
    }
    if (!form.address.trim() || !form.city.trim() || !/^\d{6}$/.test(form.pincode.trim())) {
      setError("Complete your delivery address.")
      return false
    }
    if (form.phone.replace(/\D/g, "").length < 10) {
      setError("Enter a 10-digit phone number.")
      return false
    }
    if (
      !form.billingSame &&
      (!form.billAddress.trim() || !form.billCity.trim() || !/^\d{6}$/.test(form.billPincode.trim()))
    ) {
      setError("Fill in the billing address.")
      return false
    }
    if (!addressComplete) {
      setError("Enter your shipping address to continue.")
      return false
    }
    return true
  }

  function finishOrder() {
    const address = [form.address, form.apartment].map((part) => part.trim()).filter(Boolean).join(", ")
    const saved = saveOrder({
      customer: `${form.firstName.trim()} ${form.lastName.trim()}`.trim() || form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address,
      city: form.city.trim(),
      state: form.state,
      pincode: form.pincode.trim(),
      payment: "Pay online",
      amount: total,
      couponCode: appliedCode,
      discountAmount: discount,
      items: lines.map((line) => ({
        id: line.product.id,
        name: line.product.name,
        qty: line.qty,
        price: line.product.price,
        image: line.product.image,
      })),
    })
    if (!buyNowId) clearCart()
    setOrder(saved)
  }

  function payNow(event) {
    event.preventDefault()
    if (!validateContactAndDelivery()) return
    setError("")
    finishOrder()
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
        <Link to="/shop" className="mt-8 inline-block text-sm text-primary">
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
    <div className="min-h-screen bg-white lg:grid lg:grid-cols-[minmax(0,1fr)_420px] xl:grid-cols-[minmax(0,1fr)_480px]">
      <div className="border-b border-black/8 px-5 py-8 sm:px-8 lg:border-b-0 lg:px-12 lg:py-10 xl:px-16">
        <header className="mb-8">
          <Link to="/" className="font-display text-2xl tracking-[0.12em] text-primary uppercase">
            Karnan Pattu
          </Link>
        </header>

        <form onSubmit={payNow} className="mx-auto max-w-xl space-y-8">
            <fieldset>
              <div className="mb-3 flex items-center justify-between">
                <legend className="text-base font-medium text-ink">Contact</legend>
                <Link to="/login" className="text-sm text-primary hover:underline">
                  Sign in
                </Link>
              </div>
              <label className="grid gap-1.5">
                <span className="sr-only">Email or mobile phone number</span>
                <input
                  name="email"
                  value={form.email}
                  onChange={updateField}
                  placeholder="Email or mobile phone number"
                  className={inputClass}
                  autoComplete="email tel"
                />
              </label>
              <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-sm text-ink/80">
                <input
                  type="checkbox"
                  name="marketing"
                  checked={form.marketing}
                  onChange={updateField}
                  className="h-4 w-4 accent-primary"
                />
                Email me with news and offers
              </label>
            </fieldset>

            <fieldset className="space-y-3">
              <legend className="mb-3 text-base font-medium text-ink">Delivery</legend>
              <label className="grid gap-1.5 text-sm text-ink/70">
                Country / region
                <select className={inputClass} defaultValue="India" disabled>
                  <option>India</option>
                </select>
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="First name (optional)" name="firstName" value={form.firstName} onChange={updateField} />
                <Field label="Last name" name="lastName" value={form.lastName} onChange={updateField} required />
              </div>
              <Field label="Address" name="address" value={form.address} onChange={updateField} required />
              <Field
                label="Apartment, suite, etc. (optional)"
                name="apartment"
                value={form.apartment}
                onChange={updateField}
              />
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="City" name="city" value={form.city} onChange={updateField} required />
                <label className="grid gap-1.5 text-sm text-ink/70">
                  State
                  <select name="state" value={form.state} onChange={updateField} className={inputClass}>
                    {states.map((state) => (
                      <option key={state}>{state}</option>
                    ))}
                  </select>
                </label>
                <Field label="PIN code" name="pincode" value={form.pincode} onChange={updateField} required />
              </div>
              <Field label="Phone" name="phone" value={form.phone} onChange={updateField} required />
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink/80">
                <input
                  type="checkbox"
                  name="saveInfo"
                  checked={form.saveInfo}
                  onChange={updateField}
                  className="h-4 w-4 accent-primary"
                />
                Save this information for next time
              </label>
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-base font-medium text-ink">Shipping method</legend>
              {addressComplete ? (
                <label className="flex items-center justify-between rounded-lg border border-primary/40 bg-[#faf6f0] px-4 py-3.5 text-sm">
                  <span className="flex items-center gap-2.5">
                    <input type="radio" checked readOnly className="accent-primary" />
                    Standard delivery (India)
                  </span>
                  <span className="font-medium">{formatDetailed(SHIPPING_FEE)}</span>
                </label>
              ) : (
                <p className="rounded-lg bg-[#f4f4f4] px-4 py-3.5 text-sm text-ink/55">
                  Enter your shipping address to view available shipping methods.
                </p>
              )}
            </fieldset>

            <fieldset>
              <legend className="text-base font-medium text-ink">Payment</legend>
              <p className="mt-1 text-sm text-ink/55">All transactions are secure and encrypted.</p>
              <div className="mt-4 overflow-hidden rounded-lg border-2 border-primary/55">
                <label className="flex cursor-pointer flex-wrap items-center justify-between gap-3 bg-white px-4 py-3.5 text-sm">
                  <span className="flex min-w-0 items-center gap-2.5">
                    <input type="radio" checked readOnly className="accent-primary" />
                    <span className="leading-snug">
                      Razorpay Secure{" "}
                      <span className="text-ink/50">(UPI, Card, Int&apos;l Card, Netbanking)</span>
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1.5 text-[10px] font-semibold tracking-wide text-ink/45 uppercase">
                    <span className="rounded border border-black/10 px-1.5 py-0.5">UPI</span>
                    <span className="rounded border border-black/10 px-1.5 py-0.5">Visa</span>
                    <span className="rounded border border-black/10 px-1.5 py-0.5">MC</span>
                    <span className="rounded border border-black/10 px-1.5 py-0.5">+11</span>
                  </span>
                </label>
                <p className="border-t border-black/8 bg-[#f4f4f4] px-4 py-3 text-xs leading-5 text-ink/60">
                  You&apos;ll be redirected to Razorpay Secure (UPI, Card, Int&apos;l Card, Netbanking) to complete
                  your purchase.
                </p>
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-base font-medium text-ink">Billing address</legend>
              <div className="overflow-hidden rounded-lg border border-black/15">
                <label
                  className={`flex cursor-pointer items-center gap-3 border-b border-black/10 px-4 py-3.5 text-sm ${
                    form.billingSame ? "bg-[#faf6f0] ring-1 ring-inset ring-primary/35" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="billingSame"
                    checked={form.billingSame}
                    onChange={() => setForm((current) => ({ ...current, billingSame: true }))}
                    className="accent-primary"
                  />
                  Same as shipping address
                </label>
                <label
                  className={`flex cursor-pointer items-center gap-3 px-4 py-3.5 text-sm ${
                    !form.billingSame ? "bg-[#faf6f0] ring-1 ring-inset ring-primary/35" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="billingSame"
                    checked={!form.billingSame}
                    onChange={() => setForm((current) => ({ ...current, billingSame: false }))}
                    className="accent-primary"
                  />
                  Use a different billing address
                </label>
              </div>
              {!form.billingSame && (
                <div className="mt-3 grid gap-3">
                  <Field label="Billing address" name="billAddress" value={form.billAddress} onChange={updateField} />
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Field label="City" name="billCity" value={form.billCity} onChange={updateField} />
                    <label className="grid gap-1.5 text-sm text-ink/70">
                      State
                      <select name="billState" value={form.billState} onChange={updateField} className={inputClass}>
                        {states.map((state) => (
                          <option key={state}>{state}</option>
                        ))}
                      </select>
                    </label>
                    <Field label="PIN code" name="billPincode" value={form.billPincode} onChange={updateField} />
                  </div>
                </div>
              )}
            </fieldset>

            {error && <p className="text-sm text-primary">{error}</p>}

            <button
              type="submit"
              className="w-full rounded-lg bg-primary py-3.5 text-sm font-semibold tracking-wide text-cream uppercase transition hover:bg-primary-soft"
            >
              Pay now
            </button>

            <p className="text-xs text-ink/50">
              <Link to="/terms" className="text-primary underline underline-offset-2">
                Terms and policies
              </Link>
            </p>
          </form>
      </div>

      <aside className="bg-[#f4f4f4] px-5 py-8 sm:px-8 lg:px-8 lg:py-10 xl:px-10">
        <div className="lg:sticky lg:top-8">
          <ul className="space-y-4">
            {lines.map((line) => (
              <li key={line.id} className="flex gap-4">
                <div className="relative shrink-0">
                  <img
                    src={line.product.image}
                    alt=""
                    className="h-[4.5rem] w-[3.6rem] rounded-lg border border-black/10 object-cover object-top"
                  />
                  <span className="absolute -top-2 -right-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-ink px-1 text-[11px] font-medium text-white">
                    {line.qty}
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-sm leading-snug text-ink">{lineTitle(line.product)}</p>
                </div>
                <p className="shrink-0 text-sm font-medium text-ink">{formatDetailed(line.product.price * line.qty)}</p>
              </li>
            ))}
          </ul>

          <form onSubmit={applyCode} className="mt-6 flex gap-0 overflow-hidden rounded-lg border border-black/15 bg-white">
            <input
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Discount code"
              className="min-w-0 flex-1 px-3 py-2.5 text-sm outline-none"
            />
            <button
              type="submit"
              disabled={applyingCode}
              className="border-l border-black/15 px-4 text-sm font-medium text-ink/70 transition hover:bg-black/[0.03] disabled:opacity-50"
            >
              {applyingCode ? "…" : "Apply"}
            </button>
          </form>
          {couponMessage && (
            <p className={`mt-2 text-xs ${appliedCode ? "text-emerald-700" : "text-primary"}`}>{couponMessage}</p>
          )}

          <dl className="mt-6 space-y-2 border-t border-black/10 pt-5 text-sm text-ink/80">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatDetailed(subtotal)}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <dt>Discount</dt>
                <dd>−{formatDetailed(discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt>Shipping</dt>
              <dd>{addressComplete ? formatDetailed(shipping) : "Enter shipping address"}</dd>
            </div>
            <div className="flex items-end justify-between border-t border-black/10 pt-4">
              <dt className="text-base font-semibold text-ink">Total</dt>
              <dd className="text-right">
                <span className="text-xs font-normal text-ink/50">INR</span>{" "}
                <span className="text-xl font-semibold text-ink">{formatDetailed(total)}</span>
              </dd>
            </div>
            {taxIncluded > 0 && (
              <p className="text-right text-xs text-ink/50">Including {formatDetailed(taxIncluded)} in taxes</p>
            )}
          </dl>
        </div>
      </aside>
    </div>
  )
}

function Field({ label, name, value, onChange, required }) {
  return (
    <label className="grid gap-1.5 text-sm text-ink/70">
      {label}
      <input name={name} value={value} onChange={onChange} required={required} className={inputClass} />
    </label>
  )
}
