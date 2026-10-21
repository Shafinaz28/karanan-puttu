import { useState } from "react"
import { formatPrice } from "../data/products"

const steps = ["Ordered", "Shipped", "Out for delivery", "Delivered"]

function stepIndex(status) {
  if (status === "Shipped") return 1
  if (status === "Out for delivery") return 2
  if (status === "Delivered") return 3
  return 0
}

function placedLabel(order) {
  const date = new Date(order.createdAt || Date.now())
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`
}

function deliveryLabel(order) {
  if (order.deliveryBy) return order.deliveryBy
  const date = new Date(order.createdAt || Date.now())
  date.setDate(date.getDate() + 10)
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`
}

const reasons = [
  "Ordered by mistake",
  "Need to change the delivery address",
  "Delivery date is too late",
  "Want a different saree",
  "Changed my mind",
  "Other",
]

export default function OrderConfirmed({ order, onCancel }) {
  const cancelled = order.status === "Cancelled"
  const current = stepIndex(order.status)
  const canCancel = order.status === "Pending" || order.status === "Processing"
  const [asking, setAsking] = useState(false)
  const [reason, setReason] = useState("")
  const [note, setNote] = useState("")

  function confirmCancel(event) {
    event.preventDefault()
    if (!reason) return
    onCancel({
      cancelReason: reason,
      cancelNote: note.trim(),
      cancelledAt: new Date().toISOString(),
    })
  }

  return (
    <article className="rounded-2xl border border-secondary/40 bg-white p-5 sm:p-6">
      <p className="text-xs tracking-[0.18em] text-secondary uppercase">Order {order.id}</p>
      <h2 className="mt-2 font-display text-4xl text-primary">
        {cancelled ? "Cancelled as per your request" : "Order confirmed"}
      </h2>
      <p className="mt-2 text-sm text-ink/70">
        {cancelled
          ? `Cancelled on ${placedLabel({ createdAt: order.cancelledAt || new Date().toISOString() })}`
          : `Placed on ${placedLabel(order)} · Delivery by ${deliveryLabel(order)}`}
      </p>

      {!cancelled && (
        <ol className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {steps.map((label, index) => (
            <li key={label} className={`rounded-lg px-2 py-3 text-center text-xs ${index <= current ? "bg-[#3a1216] text-[#f6efe4]" : "bg-[#f6efe4] text-ink/45"}`}>
              {label}
            </li>
          ))}
        </ol>
      )}

      <ul className="mt-6 space-y-4 border-t border-secondary/30 pt-4">
        {(order.items || []).map((item) => (
          <li key={`${item.id}-${item.name}`} className="flex items-center gap-3">
            {item.image && (
              <img src={item.image} alt="" className="h-20 w-16 rounded-lg object-cover object-top" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm text-primary">{item.name}</p>
              <p className="text-xs text-ink/50">Qty {item.qty}</p>
            </div>
            <p className="text-sm">{formatPrice(item.price * item.qty)}</p>
          </li>
        ))}
      </ul>

      <div className="mt-5 rounded-xl bg-[#f6efe4] px-4 py-3 text-sm">
        <p>Payment mode: {order.payment || "Cash on delivery"}</p>
        <p className="mt-1 text-base font-medium text-primary">Amount {formatPrice(order.amount)}</p>
      </div>

      <p className="mt-4 text-sm text-ink/65">
        {order.address}, {order.city} {order.state} {order.pincode}
      </p>

      {asking && canCancel && (
        <form onSubmit={confirmCancel} className="mt-6 rounded-xl border border-primary/20 bg-[#fbf8f4] p-4">
          <h3 className="text-lg text-primary">Could you tell us a reason for cancelling?</h3>
          <ul className="mt-4 space-y-3">
            {(order.items || []).map((item) => (
              <li key={`cancel-${item.id}-${item.name}`} className="flex items-center gap-3">
                {item.image && (
                  <img src={item.image} alt="" className="h-16 w-12 rounded object-cover object-top" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{item.name}</p>
                  <p className="text-xs text-ink/50">Qty {item.qty}</p>
                </div>
                <p className="text-sm">{formatPrice(item.price * item.qty)}</p>
              </li>
            ))}
          </ul>
          <label className="mt-4 grid gap-1 text-sm">
            Select a reason
            <select
              required
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="rounded-md border border-black/15 bg-white px-3 py-2.5 outline-none"
            >
              <option value="">Choose a reason</option>
              {reasons.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="mt-3 grid gap-1 text-sm">
            Tell us more (optional)
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              className="rounded-md border border-black/15 bg-white px-3 py-2.5 outline-none"
            />
          </label>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="submit" className="bg-[#3a1216] px-5 py-2.5 text-sm text-[#f6efe4]">
              Cancel order
            </button>
            <button type="button" onClick={() => setAsking(false)} className="border border-primary/30 px-5 py-2.5 text-sm text-primary">
              Keep order
            </button>
          </div>
        </form>
      )}

      {canCancel && !asking && (
        <div className="mt-5">
          <p className="text-sm text-ink/70">Cancellation is available until the order is shipped.</p>
          <button type="button" onClick={() => setAsking(true)} className="mt-3 border border-primary px-5 py-2.5 text-sm text-primary">
            Cancel order
          </button>
        </div>
      )}
      {cancelled && order.cancelReason && (
        <p className="mt-4 text-sm text-ink/70">
          Reason: {order.cancelReason}
          {order.cancelNote ? `. ${order.cancelNote}` : ""}
        </p>
      )}
      {!canCancel && !cancelled && (
        <p className="mt-5 text-sm text-ink/60">This order has shipped, so it can no longer be cancelled.</p>
      )}
    </article>
  )
}
