import { useState } from "react"
import { Link } from "react-router-dom"
import { sareeImages } from "../data/products"

const services = [
  {
    mark: "01",
    title: "New silk sarees",
    text: "Kanchipuram, Banarasi, and soft silks for weddings, temples, and the week.",
  },
  {
    mark: "02",
    title: "Bridal drapes",
    text: "Heavy zari bridal sarees with a blouse piece, kept ready for the tailor.",
  },
  {
    mark: "03",
    title: "We buy old silk",
    text: "Old, used, and damaged silk sarees are welcome. We pay the best price.",
  },
  {
    mark: "04",
    title: "Doorstep check",
    text: "We collect the saree from your home, test the silk, and pay the same day.",
  },
]

const reasons = [
  {
    mark: "01",
    icon: "tag",
    title: "Best price for old silk",
    text: "Torn borders and faded zari are still valued. The rate is told before you agree.",
  },
  {
    mark: "02",
    icon: "seal",
    title: "Silk you can trust",
    text: "New drapes follow the house rule: named silk, and zari that is drawn by hand.",
  },
  {
    mark: "03",
    icon: "cash",
    title: "Same-day cash",
    text: "Once the saree is checked, the amount is paid the same day.",
  },
  {
    mark: "04",
    icon: "pin",
    title: "Showrooms near you",
    text: "Visit V.V. Puram or Jayanagar in Bengaluru, or call the desk.",
  },
]

const faqs = [
  {
    question: "Do you buy damaged silk sarees?",
    answer: "Yes. Old, used, torn, and faded silk sarees are welcome. We check the silk and the zari before we name a price.",
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
      <section className="relative flex min-h-[460px] items-center bg-[#6b2d32]">
        <img
          src={sareeImages[6]}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#3a1216]/55" />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-20 text-center text-[#f7f1e8] lg:px-8">
          <p className="text-xs tracking-[0.16em] text-[#f7f1e8]/80 uppercase">
            <Link to="/" className="transition-colors duration-300 hover:text-[#d7c4a2]">
              Home
            </Link>
            <span className="mx-2 text-[#d7c4a2]">/</span>
            About Us
          </p>
          <h1 className="mt-4 font-display text-5xl md:text-7xl">About Us</h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#f7f1e8]/85">
            A house that sells new silk, and buys old silk, with the same care.
          </p>
          <span className="mx-auto mt-6 block h-px w-16 bg-[#d7c4a2]" />
        </div>
      </section>
      <section className="bg-[#f6efe4] py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 lg:grid-cols-2 lg:px-8">
          <figure className="relative">
            <img
              src={sareeImages[9]}
              alt="Maroon Kanjivaram silk with gold buttas"
              className="h-[460px] w-full rounded-2xl object-cover"
            />
            <figcaption className="absolute bottom-4 left-4 rounded-xl bg-[#3a0c14] px-4 py-3 text-cream">
              <p className="font-display text-3xl">150 years</p>
              <p className="text-xs text-cream/75">22 karat handloom zari, still guaranteed</p>
            </figcaption>
          </figure>
          <div>
            <p className="text-[11px] tracking-[0.2em] text-[#8a6230] uppercase">
              A Kanchipuram legacy since 1875
            </p>
            <h2 className="mt-3 font-display text-4xl leading-tight text-ink md:text-5xl">
              Six generations devoted to the art of sacred handloom silk
            </h2>
            <p className="mt-5 text-sm leading-7 text-ink/75">
              Founded in the sacred temple corridors of South India in 1875,
              Karnan Pattu Centre began with three promises: unmixed silk,
              tested zari, and drapes for temple patronage and temple brides.
            </p>
            <p className="mt-4 text-sm leading-7 text-ink/75">
              Today the same house still melts old pattu honestly and weaves
              new silk for the next generation. A heritage drape that leaves
              our counter is a ceremony in itself.
            </p>
            <dl className="mt-8 grid grid-cols-3 gap-3">
              {[
                ["1875", "The first loom"],
                ["450+", "Weaver families"],
                ["100%", "Zari tested"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-xl border border-secondary/30 bg-white px-2 py-4 text-center">
                  <dt className="font-display text-2xl text-primary md:text-3xl">{value}</dt>
                  <dd className="mt-1 text-[11px] leading-4 text-ink/60">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <p className="text-center text-[11px] tracking-[0.24em] text-secondary uppercase">
            What we do
          </p>
          <h2 className="mt-3 text-center font-display text-4xl text-primary md:text-5xl">
            Our Service
          </h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((item) => (
              <li
                key={item.title}
                className="service-card flex h-full flex-col rounded-2xl border border-secondary/30 bg-[#f7f1e8] p-6 text-primary"
              >
                <span className="service-mark inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary font-display text-sm text-[#d7c4a2]">
                  {item.mark}
                </span>
                <h3 className="mt-5 min-h-14 font-display text-xl">{item.title}</h3>
                <p className="text-sm leading-7 text-ink/75">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[#f6efe4] py-16">
        <div className="mx-auto grid max-w-7xl items-stretch gap-6 px-4 md:grid-cols-2 lg:px-8">
          <article className="motion-card flex h-full flex-col overflow-hidden rounded-2xl border border-secondary/40 bg-white">
            <div className="h-2 bg-secondary" />
            <div className="p-8">
              <p className="text-[11px] tracking-[0.24em] text-secondary uppercase">Looking ahead</p>
              <h2 className="mt-3 font-display text-4xl text-primary">Vision</h2>
              <p className="mt-4 text-sm leading-7 text-ink/75">
                To be the trusted house of South India for pure silk: a place where a new bridal drape is woven with care, and an old saree is turned into honest cash.
              </p>
            </div>
          </article>
          <article className="motion-card flex h-full flex-col overflow-hidden rounded-2xl bg-primary text-cream">
            <div className="h-2 bg-[#d7c4a2]" />
            <div className="p-8">
              <p className="text-[11px] tracking-[0.24em] text-secondary uppercase">What we keep</p>
              <h2 className="mt-3 font-display text-4xl">Mission</h2>
              <p className="mt-4 text-sm leading-7 text-cream/80">
                We sell silk that can be named, and we buy old, used, and damaged silk sarees at the best price. Every piece is checked before a rate is offered, and the amount is paid the same day.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <p className="text-center text-[11px] tracking-[0.24em] text-secondary uppercase">
            The promise
          </p>
          <h2 className="mt-3 text-center font-display text-4xl text-primary md:text-5xl">
            Why Choose Us
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((item) => (
              <li key={item.title} className="motion-card flex h-full flex-col rounded-xl border border-[#e2b94a] bg-[#f6d56b] p-4 text-center shadow-sm">
                <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-secondary/70 text-secondary">
                  <ReasonIcon name={item.icon} />
                </span>
                <p className="mt-3 text-[10px] tracking-[0.16em] text-secondary uppercase">{item.mark}</p>
                <h3 className="mt-1 min-h-10 text-sm font-semibold text-primary">{item.title}</h3>
                <p className="text-xs leading-5 text-ink/70">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[#f7f1e8] py-16">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <p className="text-center text-[11px] tracking-[0.24em] text-secondary uppercase">
            Questions
          </p>
          <h2 className="mt-3 text-center font-display text-4xl text-primary md:text-5xl">
            FAQ
          </h2>
          <ul className="mt-10 space-y-3">
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
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-lg text-[#d7c4a2]" aria-hidden="true">
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
      <section className="relative min-h-[460px]">
        <img
          src={sareeImages[6]}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#3a1216]/72" />
        <div className="relative mx-auto flex min-h-[460px] max-w-3xl flex-col items-center justify-center px-6 py-16 text-center text-cream">
          <p className="text-[11px] tracking-[0.22em] text-[#d7c4a2] uppercase">
            Same-day desk
          </p>
          <h2 className="mt-4 font-display text-4xl leading-tight md:text-6xl">
            Get the best price for your old silk sarees
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-cream/85">
            Instant cash, payable the same day once the silk is checked and you accept the offer.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/contact"
              className="motion-btn motion-gold bg-[#d7c4a2] px-5 py-3 text-[11px] tracking-[0.14em] text-[#3a1216] uppercase"
            >
              Get the best price
            </Link>
            <a
              href="tel:+919894441500"
              className="motion-btn motion-ghost border border-cream px-5 py-3 text-[11px] tracking-[0.14em] uppercase"
            >
              Call Chandramuki
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

function ReasonIcon({ name }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "h-4 w-4",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    "aria-hidden": true,
  }

  if (name === "tag") {
    return (
      <svg {...common}>
        <path d="M12 4h6v6l-8 8-6-6 8-8z" />
        <circle cx="16" cy="8" r="1" />
      </svg>
    )
  }

  if (name === "seal") {
    return (
      <svg {...common}>
        <circle cx="12" cy="10" r="5" />
        <path d="M9 14.5 8 20l4-2 4 2-1-5.5" />
      </svg>
    )
  }

  if (name === "cash") {
    return (
      <svg {...common}>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <circle cx="12" cy="12" r="2.2" />
        <path d="M7 12h.01M17 12h.01" />
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
