const items = [
  { title: "Reliable delivery", note: "Shipping charges apply", icon: "shipping" },
  { title: "Secure payments", note: "100% safe & trusted", icon: "secure" },
  { title: "Easy returns", note: "Hassle-free within 7 days", icon: "returns" },
  { title: "Dedicated support", note: "We're here to help", icon: "support" },
]

export default function TrustBar() {
  return (
    <section
      className="border-t border-primary/10 bg-[#faf6f0] px-4 py-6 md:px-8 md:py-12 lg:py-12"
      aria-label="Shopping assurances"
    >
      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-primary/10">
        {items.map((item) => (
          <li
            key={item.title}
            className="flex min-w-0 items-start gap-2.5 text-left sm:gap-3 lg:px-6 lg:first:pl-0 lg:last:pr-0"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/8 text-primary sm:h-11 sm:w-11">
              <TrustIcon name={item.icon} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-semibold leading-snug text-primary sm:text-[15px]">
                {item.title}
              </span>
              <span className="mt-0.5 block text-[11px] leading-4 text-ink/55 sm:mt-1 sm:text-xs sm:leading-5">
                {item.note}
              </span>
            </span>
          </li>
        ))}
      </ul>
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

  return null
}
