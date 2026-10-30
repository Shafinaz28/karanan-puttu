import { useState } from "react"
import { Link } from "react-router-dom"
import logo from "../assets/images/kpc-logo.avif"

const collections = [
  { to: "/shop", label: "Soft silk sarees" },
  { to: "/shop", label: "Wedding soft silks" },
  { to: "/shop", label: "Day-wear soft silks" },
  { to: "/old-silk", label: "Sell old soft silk" },
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
    <footer className="bg-[#3a0c14] text-cream">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        {/* Main Footer Grid with Tighter Spacing */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 items-start">
          
          {/* Column 1: Brand & Bio */}
          <div className="flex flex-col items-start">
            <img
              src={logo}
              alt="Karnan Pattu Centre"
              className="h-24 w-24 object-contain"
            />
            <p className="mt-4 max-w-xs text-sm leading-6 text-cream/75">
              We buy old, used and damaged soft silk at the best price, and we sell new soft silks for the next occasion.
            </p>
            <div className="mt-5 flex gap-3">
              <FooterSocial href="https://www.instagram.com/karnan_pattu_centre_karnataka" label="Instagram" name="instagram" />
              <FooterSocial href="https://youtube.com/@karnanpattucenterkarnataka" label="YouTube" name="youtube" />
            </div>
          </div>

          {/* Column 2: Collections */}
          <FooterColumn title="Collections">
            {collections.map((item) => (
              <Link key={item.label} to={item.to} className="transition-colors duration-300 hover:text-secondary">
                {item.label}
              </Link>
            ))}
          </FooterColumn>

          {/* Column 3: Old Saree Services */}
          <FooterColumn title="Old saree services">
            {services.map((item) => (
              <Link key={item} to="/old-silk" className="transition-colors duration-300 hover:text-secondary">
                {item}
              </Link>
            ))}
          </FooterColumn>

          {/* Column 4: Newsletter Signup */}
          <div className="flex flex-col items-start">
            <p className="text-xs font-semibold tracking-[0.18em] text-secondary uppercase">
              VIP newsletter
            </p>
            <p className="mt-3 text-sm leading-6 text-cream/75">
              Subscribe to get privileged previews of soft silk launches and seasonal handloom drops.
            </p>
            {joined ? (
              <p className="mt-4 text-sm font-medium text-secondary">You are on the list.</p>
            ) : (
              <form onSubmit={joinList} className="mt-4 flex w-full max-w-sm gap-2">
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
                  className="motion-btn motion-gold bg-secondary px-4 text-xs tracking-[0.14em] text-ink uppercase transition-colors hover:bg-[#e6c55c]"
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

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-cream/10 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-center text-xs text-cream/70 lg:flex-row lg:text-left">
            <p>© 2026 Karnan Pattu Centre. All rights reserved. Handcrafted in India.</p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:justify-end">
              <Link to="/terms" className="transition-colors hover:text-cream">
                Terms & conditions
              </Link>
              <Link to="/privacy" className="transition-colors hover:text-cream">
                Privacy policy
              </Link>
              <Link to="/contact" className="transition-colors hover:text-cream">
                Shipping & payout policy
              </Link>
              <Link to="/track" className="transition-colors hover:text-cream">
                Track order
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
    <div className="flex flex-col items-start">
      <p className="text-xs font-semibold tracking-[0.18em] text-secondary uppercase">{title}</p>
      <div className="mt-3 flex flex-col space-y-2.5 text-sm text-cream/80">
        {children}
      </div>
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
  return (
    <svg {...common} fill="currentColor">
      <path d="M22 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C18.2 5.4 12 5.4 12 5.4s-6.2 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 9 2 12.2 2 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6zM10 15.5v-6.6l5.2 3.3-5.2 3.3z" />
    </svg>
  )
}