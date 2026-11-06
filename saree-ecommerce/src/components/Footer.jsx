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
    <footer className="w-full bg-[#3a0c14] text-[#f7f1e8] bg-[radial-gradient(#c59b27_0.8px,transparent_0.8px)] [background-size:30px_30px]">
      <div className="mx-auto max-w-7xl px-6 pt-12 pb-24 md:py-16">
        
        {/* Main Columns Container */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8 xl:gap-x-12">
          
          {/* Column 1: Brand & Bio */}
          <div className="flex flex-col items-start text-left">
            <img
              src={logo}
              alt="Karnan Pattu Centre"
              className="h-16 w-16 object-contain"
            />
            <p className="mt-4 text-sm leading-6 text-[#f7f1e8]/80">
              We buy old, used and damaged soft silk at the best price, and we sell new soft silks for the next occasion.
            </p>

            {/* Contact Details with Icons */}
            <div className="mt-6 w-full">
              <p className="text-xs font-semibold tracking-[0.18em] text-[#d7c4a2] uppercase">Contact</p>
              
              <div className="mt-3 flex flex-col gap-2.5 text-sm text-[#f7f1e8]/90">
                {/* Phone Numbers */}
                <div className="flex items-start gap-2.5">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#d7c4a2]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.828-1.427-5.127-3.726-6.554-6.554l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <div className="flex flex-col gap-1">
                    <a href="tel:+917200015300" className="transition-colors hover:text-[#d7c4a2]">
                      +91 72000 15300
                    </a>
                    <a href="tel:+919944055900" className="transition-colors hover:text-[#d7c4a2]">
                      +91 99440 55900
                    </a>
                  </div>
                </div>

                {/* Location Link */}
                <div className="flex items-center gap-2.5">
                  <svg className="h-4 w-4 shrink-0 text-[#d7c4a2]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <Link to="/branches" className="transition-colors hover:text-[#d7c4a2]">
                    Our Branches in Bengaluru
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Collections */}
          <FooterColumn title="Collections">
            {collections.map((item) => (
              <Link key={item.label} to={item.to} className="transition-colors duration-300 hover:text-[#d7c4a2]">
                {item.label}
              </Link>
            ))}
          </FooterColumn>

          {/* Column 3: Old Saree Services */}
          <FooterColumn title="Old saree services">
            {services.map((item) => (
              <Link key={item} to="/old-silk" className="transition-colors duration-300 hover:text-[#d7c4a2]">
                {item}
              </Link>
            ))}
          </FooterColumn>

          {/* Column 4: Newsletter Signup */}
          <div className="flex flex-col items-start text-left">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#d7c4a2] uppercase">
              VIP Newsletter
            </p>
            <p className="mt-4 text-sm leading-6 text-[#f7f1e8]/80">
              Subscribe to get privileged previews of soft silk launches and seasonal handloom drops.
            </p>
            
            

            <div className="mt-6 flex gap-3">
              <FooterSocial href="https://www.instagram.com/karnan_pattu_centre_karnataka" label="Instagram" name="instagram" />
              <FooterSocial href="https://youtube.com/@karnanpattucenterkarnataka" label="YouTube" name="youtube" />
              <FooterSocial href="https://wa.me/917200015300" label="WhatsApp" name="whatsapp" />
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-[#f7f1e8]/15 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-center text-xs text-[#f7f1e8]/75 lg:flex-row lg:text-left">
            <p>© 2026 Karnan Pattu Centre. All rights reserved. Handcrafted in India.</p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 lg:justify-end">
              <Link to="/terms" className="transition-colors hover:text-[#d7c4a2]">
                Terms & conditions
              </Link>
              <Link to="/privacy" className="transition-colors hover:text-[#d7c4a2]">
                Privacy policy
              </Link>
              <Link to="/contact" className="transition-colors hover:text-[#d7c4a2]">
                Shipping & payout policy
              </Link>
              <Link to="/track" className="transition-colors hover:text-[#d7c4a2]">
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
    <div className="flex flex-col items-start text-left">
      <p className="text-xs font-semibold tracking-[0.18em] text-[#d7c4a2] uppercase">{title}</p>
      <div className="mt-4 flex flex-col space-y-2.5 text-sm text-[#f7f1e8]/85">
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
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d7c4a2]/50 text-[#d7c4a2] transition-colors duration-300 hover:bg-[#d7c4a2] hover:text-[#3a0c14]"
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
  if (name === "whatsapp") {
    return (
      <svg {...common} fill="currentColor">
        <path d="M20.5 3.5A11 11 0 0 0 2.1 17.2L1 23l5.9-1.1A11 11 0 0 0 12 22a11 11 0 0 0 8.5-18.5zM12 20.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3.5.6.7-3.4-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.7.9-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.4.1-.3a.5.5 0 0 0 0-.4c0-.1-.5-1.3-.7-1.7s-.4-.4-.5-.4h-.4a.8.8 0 0 0-.6.3 2.5 2.5 0 0 0-.8 1.8 4.3 4.3 0 0 0 .9 2.3 9.8 9.8 0 0 0 3.8 3.3 4.3 4.3 0 0 0 2.6.7 2.4 2.4 0 0 0 1.6-.7 2 2 0 0 0 .4-1.4c-.1-.1-.1-.3-.2-.4z" />
      </svg>
    )
  }
  return (
    <svg {...common} fill="currentColor">
      <path d="M22 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C18.2 5.4 12 5.4 12 5.4s-6.2 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 9 2 12.2 2 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6zM10 15.5v-6.6l5.2 3.3-5.2 3.3z" />
    </svg>
  )
}