import { useState } from "react"
import { Link } from "react-router-dom"
import logo from "../assets/images/kpc-logo.avif"

const collections = [
  { to: "/shop?category=Silk", label: "Kanchipuram silk" },
  { to: "/shop?category=Bridal", label: "Bridal muhurtham sarees" },
  { to: "/shop", label: "Banarasi & tissue" },
  { to: "/shop?category=Silk", label: "Soft silk sarees" },
  { to: "/shop", label: "Temple korvai borders" },
]

const services = [
  "Sell old pattu sarees",
  "Book doorstep valuation",
  "Old saree exchange offer",
  "Live silver & zari melt rates",
  "Corporate bulk silk evaluation",
]

export default function Footer() {
  const [email, setEmail] = useState("")
  const [joined, setJoined] = useState(false)

  function joinList(event) {
    event.preventDefault()
    if (!email.trim()) return
    setJoined(true)
  }

  return (
    <footer>
      <div className="bg-[#3a0c14] text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <img
            src={logo}
            alt="Karnan Pattu Centre"
            className="h-24 w-24 object-contain"
          />
          <p className="mt-4 max-w-xs text-sm leading-6 text-cream/75">
            We buy old, used and damaged silk sarees at the best price, and
            we still weave new Kanchipuram silk for the next ceremony.
          </p>
          <div className="mt-5 flex gap-3">
            <FooterSocial href="https://instagram.com" label="Instagram" name="instagram" />
            <FooterSocial href="https://facebook.com" label="Facebook" name="facebook" />
            <FooterSocial href="https://youtube.com" label="YouTube" name="youtube" />
          </div>
        </div>

        <FooterColumn title="Collections">
          {collections.map((item) => (
            <Link key={item.label} to={item.to} className="hover:text-secondary">
              {item.label}
            </Link>
          ))}
        </FooterColumn>

        <FooterColumn title="Old saree services">
          {services.map((item) => (
            <Link key={item} to="/contact" className="hover:text-secondary">
              {item}
            </Link>
          ))}
        </FooterColumn>

        <div>
          <p className="text-xs tracking-[0.18em] text-secondary uppercase">
            VIP newsletter
          </p>
          <p className="mt-3 text-sm leading-6 text-cream/75">
            Subscribe to get privileged previews of bridal launches and seasonal
            handloom drops.
          </p>
          {joined ? (
            <p className="mt-4 text-sm text-secondary">You are on the list.</p>
          ) : (
            <form onSubmit={joinList} className="mt-4 flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter email address"
                aria-label="Email address"
                className="min-w-0 flex-1 rounded-lg bg-white px-3 py-2.5 text-sm text-ink outline-none"
              />
              <button
                type="submit"
                className="motion-btn motion-gold bg-secondary px-4 text-xs tracking-[0.14em] text-ink uppercase"
              >
                Join
              </button>
            </form>
          )}
          <p className="mt-3 text-xs text-cream/55">
            Strictly no spam. We cherish your privacy.
          </p>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-4 text-center text-xs text-cream/70 lg:flex-row lg:px-8 lg:text-left">
          <p>© 2026 Karnan Pattu Centre. All rights reserved. Handcrafted in India.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-end">
            <Link to="/terms" className="hover:text-cream">
              Terms & conditions
            </Link>
            <Link to="/privacy" className="hover:text-cream">
              Privacy policy
            </Link>
            <Link to="/contact" className="hover:text-cream">
              Shipping & payout policy
            </Link>
          </div>
        </div>
      </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, children }) {
  return (
    <div className="flex flex-col gap-2 text-sm text-cream/80">
      <p className="mb-1 text-xs tracking-[0.18em] text-secondary uppercase">{title}</p>
      {children}
    </div>
  )
}

function FooterSocial({ href, label, name }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d7c4a2]/50 text-[#d7c4a2] transition-colors duration-300 hover:bg-[#d7c4a2] hover:text-[#3a0c14]"
    >
      <SocialGlyph name={name} />
    </a>
  )
}

function SocialGlyph({ name }) {
  const common = { viewBox: "0 0 24 24", className: "h-4 w-4", "aria-hidden": true }
  if (name === "instagram") {
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
      </svg>
    )
  }
  if (name === "facebook") {
    return (
      <svg {...common} fill="currentColor">
        <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1z" />
      </svg>
    )
  }
  return (
    <svg {...common} fill="currentColor">
      <path d="M22 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C18.2 5.4 12 5.4 12 5.4s-6.2 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 9 2 12.2 2 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6zM10 15.5v-6.6l5.2 3.3-5.2 3.3z" />
    </svg>
  )
}
