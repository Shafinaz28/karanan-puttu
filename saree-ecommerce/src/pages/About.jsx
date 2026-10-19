import { useState } from "react"
import { Link } from "react-router-dom"
import { sareeImages } from "../data/products"

const beliefs = [
  {
    icon: "leaf",
    title: "At the loom",
    text: "Korvai borders and hand-drawn zari stay the house rule.",
  },
  {
    icon: "diamond",
    title: "Chosen in daylight",
    text: "Named silk is checked at the counter before it leaves.",
  },
  {
    icon: "cycle",
    title: "We buy old silk",
    text: "Old, used, and torn silk is welcome. The rate is told first.",
  },
]

const faqs = [
  {
    question: "Do you buy damaged soft silk sarees?",
    answer: "Yes. Old, used, torn, and faded soft silk sarees are welcome. We check the silk before we name a price.",
  },
  {
    question: "How do I get a price?",
    answer: "Send photos on WhatsApp, call the desk, or bring the saree to a showroom. We tell you the rate before you agree.",
  },
  {
    question: "When is the money paid?",
    answer: "Once the saree is checked and you accept the offer, the amount is paid the same day.",
  },
  {
    question: "Can you collect the saree from home?",
    answer: "Yes. Ask for a doorstep pickup. We collect the saree, check it, and pay you.",
  },
  {
    question: "Do new sarees include a blouse piece?",
    answer: "Yes. Every new drape leaves the counter with a blouse piece.",
  },
]

export default function About() {
  const [open, setOpen] = useState(0)
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
            About Us
          </p>
          <h1 className="mt-4 font-display text-5xl md:text-7xl">About Us</h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#f7f1e8]/85">
            A house that sells soft silk, and buys old soft silk, with the same care.
          </p>
          <span className="mx-auto mt-6 block h-0.5 w-16 bg-[linear-gradient(to_right,#4a0e17,#c59b27)]" aria-hidden="true" />
          </div>
        </div>
      </section>
      <section className="bg-[#f6efe4] py-8 md:py-10">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 lg:grid-cols-2 lg:px-8">
          <figure className="relative order-2 lg:order-1">
            <img
              src={sareeImages[2]}
              alt="Maroon soft silk with gold buttas"
              className="h-72 w-full rounded-2xl object-cover md:h-[460px]"
            />
            <figcaption className="absolute bottom-5 left-5 rounded-lg bg-[#c59b27] px-4 py-3 text-[#3a1216] shadow-md">
              <p className="font-display text-3xl leading-none">30+</p>
              <p className="mt-1 text-xs">Years old</p>
            </figcaption>
          </figure>
          <div className="order-1 lg:order-2">
            <p className="text-[11px] tracking-[0.2em] text-[#8a6230] uppercase">
              A soft silk house since 1985
            </p>
            <h2 className="mt-3 font-display text-4xl leading-tight text-ink md:text-5xl">
              Soft silks chosen for every occasion
            </h2>
            <p className="mt-5 text-sm leading-7 text-ink/75">
              Founded in South India in 1985, Karnan Pattu Centre began with three
              promises: soft silk you can name, a fair check at the counter, and
              drapes ready for temple days and weddings.
            </p>
            <p className="mt-4 text-sm leading-7 text-ink/75">
              Today the same house still buys old soft silk honestly and sells
              new soft silk for the next occasion. A drape that leaves our
              counter is ready to wear.
            </p>
            <dl className="mt-8 grid grid-cols-3 gap-3">
              {[
                ["1985", "The first loom"],
                ["450+", "Weaver families"],
                ["100%", "Zari tested"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-lg bg-[#c59b27] px-2 py-4 text-center text-[#3a1216]">
                  <dt className="font-display text-2xl md:text-3xl">{value}</dt>
                  <dd className="mt-1 text-[11px] leading-4">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
      <section className="bg-shell px-4 py-8 md:px-8 md:py-10">
        <ul className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {beliefs.map((item) => (
            <li key={item.title} className="flex flex-col items-center text-center">
              <BeliefIcon name={item.icon} />
              <h2 className="mt-4 font-display text-2xl text-[#3a221c]">{item.title}</h2>
              <p className="mt-2 max-w-xs text-sm leading-6 text-ink/65">{item.text}</p>
            </li>
          ))}
        </ul>
      </section>
      <section className="bg-[#f6efe4] px-4 py-8 md:px-8 md:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
            <img
              src="/hero/green-palace.avif"
              alt="A green soft silk with gold buttas"
              data-slide="left"
              className="h-[520px] w-full object-cover object-[center_12%] md:h-[640px]"
            />
            <div data-slide="right">
              <p className="text-[11px] tracking-[0.24em] text-[#8a6230] uppercase">Our house</p>
              <h2 className="mt-4 font-display text-[40px] leading-[1.05] text-[#3a221c] md:text-[56px]">
                A drape is more
                <span className="block">than six yards.</span>
              </h2>
              <p className="mt-6 max-w-md text-sm leading-7 text-ink/70">
                Karnan Pattu Centre sells new soft silks, and buys the soft silk you no longer wear. Both are looked at in daylight before a price is named.
              </p>
              <p className="mt-4 max-w-md text-sm leading-7 text-ink/70">
                A new drape leaves with a blouse piece. An old one is welcome in any condition. The rate is told first, and the money is paid the same day.
              </p>
              <Link
                to="/shop"
                className="motion-btn motion-fill mt-8 inline-flex items-center gap-2 bg-primary px-5 py-2.5 text-sm text-[#f6efe4]"
                style={{ borderRadius: 0 }}
              >
                See the weaves
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#f6efe4] py-12 md:py-16">
        <div className="mx-auto grid max-w-7xl items-stretch gap-6 px-4 md:grid-cols-2 lg:px-8">
          <article className="motion-card flex h-full flex-col overflow-hidden rounded-2xl border border-secondary/40 bg-white">
            <div className="h-2 bg-secondary" />
            <div className="p-8">
              <p className="text-[11px] tracking-[0.24em] text-secondary uppercase">Looking ahead</p>
              <h2 className="mt-3 font-display text-4xl text-primary">Vision</h2>
              <p className="mt-4 text-sm leading-7 text-ink/75">
                To be the trusted house of South India for soft silk: a place where a new soft silk is chosen with care, and an old soft silk is turned into honest cash.
              </p>
            </div>
          </article>
          <article className="motion-card flex h-full flex-col overflow-hidden rounded-2xl bg-primary text-cream">
            <div className="h-2 bg-[#d7c4a2]" />
            <div className="p-8">
              <p className="text-[11px] tracking-[0.24em] text-secondary uppercase">What we keep</p>
              <h2 className="mt-3 font-display text-4xl">Mission</h2>
              <p className="mt-4 text-sm leading-7 text-cream/80">
                We sell soft silk that can be named, and we buy old, used, and damaged soft silk at the best price. Every piece is checked before a rate is offered, and the amount is paid the same day.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="bg-[#f7f1e8] py-8 md:py-10">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <p className="text-center text-[11px] tracking-[0.24em] text-secondary uppercase">
            Questions
          </p>
          <h2 className="mt-3 text-center font-display text-4xl text-primary md:text-5xl">
            FAQ
          </h2>
          <ul className="mt-6 space-y-3">
            {faqs.map((item, index) => {
              const shown = open === index
              return (
                <li key={item.question} className="overflow-hidden rounded-2xl border border-secondary/30 bg-white">
                  <button
                    type="button"
                    aria-expanded={shown}
                    onClick={() => setOpen(shown ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="font-display text-lg text-primary">{item.question}</span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary text-lg text-primary" aria-hidden="true">
                      {shown ? "−" : "+"}
                    </span>
                  </button>
                  {shown && (
                    <p className="px-5 pb-5 text-sm leading-7 text-ink/75">{item.answer}</p>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </section>
      <section className="relative min-h-[360px]">
        <img
          src={sareeImages[6]}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#3a1216]/72" />
        <div className="relative mx-auto flex min-h-[360px] max-w-3xl flex-col items-center justify-center px-6 py-12 text-center text-cream">
          <p className="text-[11px] tracking-[0.22em] text-[#d7c4a2] uppercase">
            Sell and buy
          </p>
          <h2 className="mt-4 font-display text-4xl leading-tight md:text-6xl">
            New soft silks to wear. Old soft silk we buy.
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-cream/85">
            New soft silks leave the counter with a blouse piece. Old, used, and torn soft silk is checked in daylight, and the money is paid the same day.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/shop"
              className="motion-btn motion-gold bg-[#d7c4a2] px-5 py-3 text-[11px] tracking-[0.14em] text-[#3a1216] uppercase"
            >
              Shop new silk
            </Link>
            <Link
              to="/old-silk"
              className="motion-btn motion-ghost border border-cream px-5 py-3 text-[11px] tracking-[0.14em] uppercase"
            >
              Sell old silk
            </Link>
            <a
              href="tel:+919894441500"
              className="motion-btn motion-ghost border border-cream px-5 py-3 text-[11px] tracking-[0.14em] uppercase"
            >
              Call the desk
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

function BeliefIcon({ name }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "h-7 w-7 text-[#8a6230]",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.3,
    "aria-hidden": true,
  }

  if (name === "leaf") {
    return (
      <svg {...common}>
        <path d="M12 21V10" />
        <path d="M12 13c0-4 2.5-7 7-8-1 5-4 8-7 8z" />
        <path d="M12 15c0-3-2-5.5-6-6.5 1 4 3.2 6.5 6 6.5z" />
      </svg>
    )
  }

  if (name === "diamond") {
    return (
      <svg {...common}>
        <path d="M4 9h16l-8 11L4 9z" />
        <path d="M4 9 8 4h8l4 5" />
        <path d="M8 4 12 9l4-5" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <path d="M20 12a8 8 0 1 1-2.2-5.5" />
      <path d="M20 4v4h-4" />
    </svg>
  )
}
