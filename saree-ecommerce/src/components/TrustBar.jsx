import { Link } from "react-router-dom"

const items = [
  { title: "Reliable delivery", note: "Shipping charges apply", icon: "shipping" },
  { title: "Secure payments", note: "100% safe & trusted", icon: "secure" },
  { title: "Easy returns", note: "Hassle-free within 7 days", icon: "returns" },
  { title: "Dedicated support", note: "We're here to help", icon: "support" },
  { title: "Visit our shops", note: "3 Bengaluru locations", icon: "location", to: "/locations" },
]

export default function TrustBar() {
  return (
    <section
      className="site-section border-t border-primary/10 bg-[#faf6f0]"
      aria-label="Shopping assurances"
    >
      <div className="site-section-inner !py-8 md:!py-10 lg:!py-12">
        <ul className="grid grid-cols-2 items-stretch gap-x-5 gap-y-8 sm:gap-x-8 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-5 lg:gap-0 lg:divide-x lg:divide-primary/10">
          {items.map((item) => {
            const content = (
              <>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/8 text-primary">
                  <TrustIcon name={item.icon} />
                </span>
                <span className="min-w-0 flex-1 leading-tight">
                  <span className="block text-[13px] font-semibold leading-snug text-primary sm:text-[15px] sm:leading-tight">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-[11px] leading-4 text-ink/55 sm:text-xs sm:leading-5">
                    {item.note}
                  </span>
                </span>
              </>
            )

            return (
              <li key={item.title} className="min-w-0 text-left lg:px-5 xl:px-6">
                {item.to ? (
                  <Link
                    to={item.to}
                    className="flex h-full items-center gap-3 sm:gap-3.5 hover:text-secondary"
                  >
                    {content}
                  </Link>
                ) : (
                  <div className="flex h-full items-center gap-3 sm:gap-3.5">
                    {content}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function TrustIcon({ name }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "h-6 w-6 shrink-0",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  }

  if (name === "shipping") {
    return (
      <svg {...common}>
        <path d="M3 7h11v10H3z" />
        <path d="M14 10h4l3 3v4h-7v-7z" />
        <circle cx="7.5" cy="17.5" r="1.5" />
        <circle cx="17.5" cy="17.5" r="1.5" />
      </svg>
    )
  }

  if (name === "secure") {
    return (
      <svg {...common}>
        <path d="M12 3 20 7v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    )
  }

  if (name === "returns") {
    return (
      <svg {...common}>
        <path d="M4 12a8 8 0 0 1 13.5-5.7" />
        <path d="M17 4v4h-4" />
      </svg>
    )
  }

  if (name === "support") {
    return (
      <svg {...common}>
        <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
        <path d="M4 14a2 2 0 0 0 2 2h1v3l3-3h5a2 2 0 0 0 2-2v-2" />
      </svg>
    )
  }

  if (name === "location") {
    return (
      <svg {...common}>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    )
  }

  return null
}
