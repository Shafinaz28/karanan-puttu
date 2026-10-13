import { useState } from "react"
import { Link } from "react-router-dom"
import { sareeImages } from "../data/products"

const emptyForm = { name: "", email: "", message: "" }

export default function Contact() {
  const [form, setForm] = useState(emptyForm)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

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
    setSent(true)
  }

  return (
    <>
    <section className="relative flex min-h-[460px] items-center bg-[#6b2d32]">
      <img
        src={sareeImages[9]}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[#3a1216]/55" />
      <div className="relative mx-auto w-full max-w-6xl px-6 py-20 text-center text-[#f7f1e8] md:px-10">
        <p className="text-xs tracking-[0.16em] text-[#f7f1e8]/80 uppercase">
          <Link to="/" className="transition-colors duration-300 hover:text-[#d7c4a2]">
            Home
          </Link>
          <span className="mx-2 text-[#d7c4a2]">/</span>
          Contact
        </p>
        <h1 className="mt-4 font-display text-5xl md:text-7xl">Contact</h1>
      </div>
    </section>
    <section id="write" className="mx-auto max-w-xl px-4 py-16">
      <h2 className="font-display text-4xl text-primary">Write to the desk</h2>
      <p className="mt-3 text-ink/75">
        Tell us about an old, used, or damaged silk saree, or ask about a new drape.
      </p>

      {sent ? (
        <p className="mt-8 rounded-2xl border border-secondary/50 bg-cream-deep px-4 py-5">
          Thank you, {form.name.trim()}. We received your note.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
          <label className="grid gap-1 text-sm">
            Name
            <input
              name="name"
              value={form.name}
              onChange={updateField}
              className="rounded-lg border border-primary/20 bg-white px-3 py-2 outline-none focus:border-secondary"
            />
          </label>
          <label className="grid gap-1 text-sm">
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              className="rounded-lg border border-primary/20 bg-white px-3 py-2 outline-none focus:border-secondary"
            />
          </label>
          <label className="grid gap-1 text-sm">
            Message
            <textarea
              name="message"
              rows="5"
              value={form.message}
              onChange={updateField}
              className="rounded-lg border border-primary/20 bg-white px-3 py-2 outline-none focus:border-secondary"
            />
          </label>
          {error && <p className="text-sm text-primary">{error}</p>}
          <button type="submit" className="motion-btn motion-fill bg-primary px-6 py-3 text-sm text-cream">
            Send message
          </button>
        </form>
      )}
    </section>
    <section className="bg-white px-4 py-12">
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-ink/10 bg-paper p-8">
          <p className="text-[11px] tracking-[0.22em] text-secondary uppercase">Buy</p>
          <h2 className="mt-3 font-display text-3xl text-primary">Buy a new saree</h2>
          <p className="mt-3 text-sm leading-7 text-ink/75">
            Classic and modern silks for weddings, temples, and the week. Every drape includes a blouse piece.
          </p>
          <Link
            to="/shop"
            className="motion-btn motion-fill mt-6 inline-block bg-primary px-5 py-3 text-[11px] tracking-[0.14em] text-cream uppercase"
          >
            Buy sarees
          </Link>
        </article>
        <article className="rounded-2xl bg-primary p-8 text-cream">
          <p className="text-[11px] tracking-[0.22em] text-secondary uppercase">Sell</p>
          <h2 className="mt-3 font-display text-3xl">Sell your old silk</h2>
          <p className="mt-3 text-sm leading-7 text-cream/80">
            We buy old, used, and damaged silk sarees at the best price. Send a photo or visit a showroom and get paid the same day.
          </p>
          <a
            href="#write"
            className="motion-btn motion-gold mt-6 inline-block bg-secondary px-5 py-3 text-[11px] tracking-[0.14em] text-ink uppercase"
          >
            Sell old silk
          </a>
        </article>
      </div>
    </section>
    </>
  )
}
