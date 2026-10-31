const promises = [
  ["check", "A careful check", "Silk and zari are looked at in daylight before a rate is offered."],
  ["price", "A clear price", "You hear the amount first. Nothing is settled until you accept."],
  ["cash", "Same-day cash", "Once the saree is checked and you agree, the payment is made that day."],
  ["silk", "Any condition", "Old, used, torn, and faded soft silk is welcome."],
]

function PromiseIcon({ name }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "h-5 w-5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    "aria-hidden": true,
  }
  if (name === "price") {
    return (
      <svg {...common}>
        <path d="M12 3v18" />
        <path d="M8 7h6a3 3 0 0 1 0 6H8" />
        <path d="M8 13h7a3 3 0 0 1 0 6H8" />
      </svg>
    )
  }
  if (name === "cash") {
    return (
      <svg {...common}>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    )
  }
  if (name === "silk") {
    return (
      <svg {...common}>
        <path d="M4 8c2 2 4 2 6 0s4-2 6 0 4 2 4 0" />
        <path d="M4 12c2 2 4 2 6 0s4-2 6 0 4 2 4 0" />
        <path d="M4 16c2 2 4 2 6 0s4-2 6 0 4 2 4 0" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="8" />
      <path d="m8.5 12 2.2 2.2 4.8-5" />
    </svg>
  )
}

export default function WhyChooseUsSection({ animated = false }) {
  return (
    <section className="bg-[#f6efe4] px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-3xl">
        <div {...(animated ? { "data-slide": "up" } : {})}>
          <p className="text-[11px] tracking-[0.22em] text-[#c48a3a] uppercase">Our promise</p>
          <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">Why choose us</h2>
          <p className="mt-4 text-sm leading-7 text-ink/70 md:text-base">
            We buy old silk and sell new silk in Bengaluru. The saree is checked first, the price is told before
            you agree, and the money is paid the same day.
          </p>
        </div>

        <ol className="mt-10 border-y border-[#ead9bf]">
          {promises.map(([icon, title, text], index) => (
            <li
              key={title}
              {...(animated ? { "data-slide": "up" } : {})}
              className="flex items-start gap-4 border-b border-[#ead9bf] py-6 last:border-b-0"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#c59b27] text-[#3a1216]">
                <PromiseIcon name={icon} />
              </span>
              <span className="min-w-0 flex-1 pt-0.5">
                <span className="text-[11px] tracking-[0.16em] text-[#8a6230] uppercase">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1 font-display text-xl text-primary">{title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-ink/70">{text}</p>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
