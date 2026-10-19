import { useState } from "react"
import { Link } from "react-router-dom"

const emptyForm = { name: "", mobile: "", email: "", message: "" }

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
    <section className="flex min-h-[320px] flex-col bg-[linear-gradient(160deg,#4a0e17_0%,#6b1a26_48%,#c59b27_100%)] sm:min-h-[380px]">
      <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-16 text-center text-[#f7f1e8] lg:px-8">
        <div className="w-full">
        <p className="text-xs tracking-[0.16em] text-[#f7f1e8]/80 uppercase">
          <Link to="/" className="transition-colors duration-300 hover:text-[#d7c4a2]">
            Home
          </Link>
          <span className="mx-2 text-[#d7c4a2]">/</span>
          Contact
        </p>
        <h1 className="mt-4 font-display text-5xl md:text-7xl">Contact</h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#f7f1e8]/85">
          Tell us about an old silk saree, or ask about a new drape.
        </p>
        <span className="mx-auto mt-6 block h-0.5 w-16 bg-[linear-gradient(to_right,#4a0e17,#c59b27)]" aria-hidden="true" />
        </div>
      </div>
    </section>
    <section id="write" className="bg-[#f6efe4] px-4 py-16">
      <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        <div>
          <p className="text-[11px] tracking-[0.22em] text-[#c59b27] uppercase">The desk</p>
          <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">Write to the desk</h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-ink/75">
            Tell us about an old, used, or damaged silk saree, or ask about a new drape.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              ["phone", "Call the desk", "tel:+919894441500", "+91 98944 41500", false],
              ["phone", "Store phone", "tel:+919944055900", "+91 99440 55900", false],
              ["chat", "WhatsApp", "https://wa.me/919894441500", "Message the showroom", true],
              ["mail", "Email", "mailto:karnanpattucenter@gmail.com", "karnanpattucenter@gmail.com", false],
              ["pin", "Showrooms", "/locations", "V.V. Puram and Jayanagar", false],
            ].map(([icon, label, href, value, external]) => (
              <li key={label}>
                <a
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  className="flex items-center gap-4"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#4a1520] text-[#d7c4a2]">
                    <DeskIcon name={icon} />
                  </span>
                  <span>
                    <span className="block text-[11px] tracking-[0.14em] text-[#8a6230] uppercase">{label}</span>
                    <span className="mt-0.5 block text-sm text-primary">{value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex gap-3">
            {[
              ["instagram", "Instagram", "https://www.instagram.com/karnan_pattu_centre_karnataka"],
              ["youtube", "YouTube", "https://youtube.com/@karnanpattucenterkarnataka"],
            ].map(([icon, label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#4a1520] text-[#d7c4a2] transition-colors duration-300 hover:bg-[#c59b27] hover:text-[#3a1216]"
              >
                <DeskIcon name={icon} />
              </a>
            ))}
          </div>
        </div>

        {sent ? (
          <p className="rounded-2xl border border-[#c59b27]/50 bg-white px-6 py-8 text-primary">
            Thank you, {form.name.trim()}. We received your note.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-[#ead9bf] bg-white p-6 shadow-sm md:p-8">
            <Field icon="user" label="Name">
              <input
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="Your name"
                className="w-full bg-transparent py-3 pr-3 text-sm outline-none"
              />
            </Field>
            <Field icon="phone" label="Mobile number">
              <span className="shrink-0 text-sm text-ink/70">+91</span>
              <input
                name="mobile"
                type="tel"
                inputMode="tel"
                value={form.mobile}
                onChange={updateField}
                placeholder="Mobile number"
                className="w-full bg-transparent py-3 pr-3 text-sm outline-none"
              />
            </Field>
            <Field icon="mail" label="Email">
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                placeholder="you@email.com"
                className="w-full bg-transparent py-3 pr-3 text-sm outline-none"
              />
            </Field>
            <Field icon="note" label="Message" tall>
              <textarea
                name="message"
                rows="5"
                value={form.message}
                onChange={updateField}
                placeholder="The saree, its condition, and how we can help"
                className="w-full resize-none bg-transparent py-3 pr-3 text-sm outline-none"
              />
            </Field>
            {error && <p className="mt-3 text-sm text-primary">{error}</p>}
            <button type="submit" className="motion-btn motion-fill mt-5 w-full bg-primary px-6 py-3 text-sm text-cream">
              Send message
            </button>
          </form>
        )}
      </div>
    </section>
    <section className="bg-shell px-4 py-12">
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-ink/10 bg-paper p-8">
          <p className="text-[11px] tracking-[0.22em] text-secondary uppercase">Buy</p>
          <h2 className="mt-3 font-display text-3xl text-primary">Buy a soft silk</h2>
          <p className="mt-3 text-sm leading-7 text-ink/75">
            Soft silks for weddings, temples, and the week. Every drape includes a blouse piece.
          </p>
          <Link
            to="/shop"
            className="motion-btn motion-fill mt-6 inline-block bg-primary px-5 py-3 text-[11px] tracking-[0.14em] text-cream uppercase"
          >
            Buy soft silks
          </Link>
        </article>
        <article className="rounded-2xl bg-primary p-8 text-cream">
          <p className="text-[11px] tracking-[0.22em] text-secondary uppercase">Sell</p>
          <h2 className="mt-3 font-display text-3xl">Sell your old soft silk</h2>
          <p className="mt-3 text-sm leading-7 text-cream/80">
            We buy old, used, and damaged soft silk at the best price. Send a photo or visit a showroom and get paid the same day.
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

function Field({ icon, label, tall, children }) {
  return (
    <label className="mt-4 grid gap-1.5 text-sm text-ink first:mt-0">
      {label}
      <span className={`flex gap-2 rounded-xl border border-[#ead9bf] bg-[#fbf7f1] px-3 focus-within:border-[#c59b27] ${tall ? "items-start" : "items-center"}`}>
        <span className={`text-[#c59b27] ${tall ? "pt-3" : ""}`}>
          <DeskIcon name={icon} />
        </span>
        {children}
      </span>
    </label>
  )
}

function DeskIcon({ name }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "h-5 w-5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  }

  if (name === "user") {
    return (
      <svg {...common}>
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5.5 19c1.4-2.6 3.6-3.8 6.5-3.8s5.1 1.2 6.5 3.8" />
      </svg>
    )
  }

  if (name === "mail") {
    return (
      <svg {...common}>
        <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    )
  }

  if (name === "note") {
    return (
      <svg {...common}>
        <path d="M7 4.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9.5A1.5 1.5 0 0 1 5.5 19V6A1.5 1.5 0 0 1 7 4.5z" />
        <path d="M14 4.5V9h4.5M8 13h8M8 16.5h5" />
      </svg>
    )
  }

  if (name === "instagram") {
    return (
      <svg {...common}>
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
      </svg>
    )
  }

  if (name === "facebook") {
    return (
      <svg {...common} fill="currentColor" stroke="none">
        <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1z" />
      </svg>
    )
  }

  if (name === "youtube") {
    return (
      <svg {...common} fill="currentColor" stroke="none">
        <path d="M22 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C18.2 5.4 12 5.4 12 5.4s-6.2 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 9 2 12.2 2 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6zM10 15.5v-6.6l5.2 3.3-5.2 3.3z" />
      </svg>
    )
  }

  if (name === "phone") {
    return (
      <svg {...common}>
        <path d="M8 4.5h2.2l1.2 3-1.6 1a12 12 0 0 0 5.7 5.7l1-1.6 3 1.2V16a2 2 0 0 1-2.2 2A14.5 14.5 0 0 1 6 6.7 2 2 0 0 1 8 4.5z" />
      </svg>
    )
  }

  if (name === "chat") {
    return (
      <svg {...common}>
        <path d="M6 17.5 4 20v-4.2A8 8 0 1 1 8.2 18" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z" />
      <circle cx="12" cy="11" r="2" />
    </svg>
  )
}
