import { Link } from "react-router-dom"
import PageDamaskHero, { ZariOrnament } from "../components/PageDamaskHero"

const storyParagraphs = [
  "Welcome to Karnan Pattu Centre, your destination in Jayanagar, Bengaluru, for enquiries about buying and selling traditional silk and Zari sarees.",
  "Traditional sarees are more than clothing. They often represent family memories, weddings, celebrations and cultural traditions. Many households have beautiful silk sarees stored away for years. We offer families an opportunity to enquire about selling unused traditional sarees through an individual assessment process.",
  "Established in 1985, Karnan Pattu Centre brings three generations of experience with traditional sarees. We welcome people looking to explore silk and Pattu collections, as well as families considering what to do with sarees they already own.",
  "For a selling enquiry, we consider each saree individually, including its fabric, weaving, Zari work, design and condition. You can share photographs with us before visiting; we explain our assessment clearly, and any sale goes ahead only when you agree to the value and terms.",
]

const sareeTypes = [
  { label: "Old Kanchipuram silk sarees", icon: "temple" },
  { label: "Traditional Pattu sarees", icon: "weave" },
  { label: "Mysore silk sarees", icon: "diamond" },
  { label: "Banarasi silk sarees", icon: "flower" },
  { label: "Gold and silver Zari sarees", icon: "sparkle" },
  { label: "Wedding and bridal sarees", icon: "bridal" },
  { label: "Antique and vintage sarees", icon: "heritage" },
]

const founder = {
  name: "Karnan",
  role: "Founder, Karnan Pattu Centre",
  image: "/hero/Karnan Pattu Owner.jpg",
  tagline: "BUY • SELL • TRUST",
  quote: "Every traditional saree carries a story worth valuing.",
  bio: [
    "Karnan Pattu Centre helps preserve the value of traditional Indian silk sarees through quality, personal service and trusted customer relationships.",
    "From old Zari sarees to traditional Pattu collections, we value every saree and its story. Our approach is built around clear communication, individual assessment and your choice.",
    "Based in Jayanagar, Bengaluru, we welcome enquiries about Kanchipuram, Mysore silk, Banarasi, Pattu and Zari sarees.",
    "You can share photographs to begin an enquiry before visiting the centre.",
    "We explain how each saree is assessed, and leave the decision to you once the value and terms are discussed.",
  ],
}

const whyChoose = [
  {
    icon: "quality",
    title: "Clear Communication",
    text: "We explain the assessment process and the factors considered when reviewing each saree.",
  },
  {
    icon: "heritage",
    title: "Convenient Enquiries",
    text: "Share saree photographs through WhatsApp before visiting our centre.",
  },
  {
    icon: "trust",
    title: "Individual Assessment",
    text: "We consider each saree's fabric, weaving, Zari work and overall condition before discussing its value.",
  },
  {
    icon: "reach",
    title: "Your Decision Matters",
    text: "The sale proceeds only when both parties agree on the value and terms.",
  },
]

export default function About() {
  return (
    <>
      <PageDamaskHero
        breadcrumb="About Us"
        title="About Karnan Pattu Centre"
        subtitle="Your Jayanagar destination for enquiries about buying and selling traditional silk and Zari sarees."
      />

      {/* Our story */}
      <section className="about-subtle-linen border-b border-secondary/20 py-20 md:py-28">
        <div className="site-container grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-6 lg:col-span-7" data-motion-text>
            <div className="space-y-2">
              <span
                data-motion-item
                className="block font-sans text-xs font-bold tracking-[0.3em] text-[#8a6626] uppercase"
              >
                Our story
              </span>
              <h2
                data-motion-item
                className="font-display text-3xl font-semibold tracking-tight text-primary sm:text-4xl lg:text-5xl"
              >
                About Karnan Pattu Centre
              </h2>
              <div data-motion-item className="mt-2 h-0.5 w-20 bg-secondary" aria-hidden />
            </div>
            <div className="space-y-4 font-sans text-base leading-relaxed text-ink/85 sm:text-lg">
              {storyParagraphs.map((paragraph, index) => (
                <p key={index} data-motion-item>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <figure className="relative lg:col-span-5" data-motion-image>
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div
                className="absolute -inset-3 rotate-1 rounded-2xl bg-gradient-to-tr from-secondary/20 via-primary/10 to-secondary/30 sm:-inset-4 sm:rotate-2"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-2xl border-2 border-secondary/50 bg-[#2c1814] shadow-2xl">
                <div className="relative aspect-[4/5] w-full">
                  <img
                    src="/sarees/worn/worn-crimson.avif"
                    alt="Model in handwoven crimson soft silk saree with zari border"
                    className="absolute inset-0 h-full w-full object-cover object-[center_12%]"
                    decoding="async"
                  />
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-[#32020f]/92 via-[#32020f]/35 to-transparent"
                    aria-hidden
                  />
                </div>
                <div className="absolute right-3 bottom-3 left-3 rounded-lg border border-secondary/25 bg-[#32020f]/88 px-3 py-3 backdrop-blur-[2px] sm:right-4 sm:bottom-4 sm:left-4 sm:px-4 sm:py-3.5">
                  <span className="block text-[10px] font-semibold tracking-[0.2em] text-secondary uppercase sm:text-xs">
                    Handwoven soft silk
                  </span>
                  <span className="mt-0.5 block font-display text-sm leading-snug text-stone-200 italic sm:text-base">
                    Kanchipuram &amp; Arani weaving masterpieces
                  </span>
                </div>
              </div>
            </div>
          </figure>
        </div>
      </section>

      {/* Founder */}
      <section className="relative border-b border-secondary/20 bg-[#f6f0e6] py-20 md:py-28">
        <div className="site-container grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <figure
            className="order-2 lg:order-1 lg:col-span-5"
            data-motion-image="left"
          >
            <div className="relative mx-auto max-w-sm lg:max-w-md">
              <div
                className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-secondary to-primary opacity-30 blur-lg"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow-xl">
                <img
                  src={founder.image}
                  alt={`${founder.name}, founder of Karnan Pattu Centre`}
                  width={1122}
                  height={1402}
                  decoding="async"
                  className="w-full object-cover object-top contrast-[1.05]"
                />
              </div>
            </div>
          </figure>

          <div className="order-1 space-y-6 lg:order-2 lg:col-span-7" data-motion-text>
            <div className="space-y-2">
              <span
                data-motion-item
                className="block font-sans text-xs font-bold tracking-[0.25em] text-[#8a6626] uppercase"
              >
                Founder · Since 1985
              </span>
              <h2
                data-motion-item
                className="font-display text-4xl font-bold tracking-tight text-primary sm:text-5xl"
              >
                {founder.name}
              </h2>
              <h3
                data-motion-item
                className="font-display text-2xl font-medium text-secondary italic sm:text-3xl"
              >
                {founder.tagline}
              </h3>
              <p data-motion-item className="pt-1 text-xs font-semibold tracking-wider text-stone-600 uppercase">
                {founder.role}
              </p>
              <div data-motion-item className="my-4 h-0.5 w-16 bg-secondary" aria-hidden />
            </div>
            <div className="space-y-4 font-sans text-base leading-relaxed text-ink/85 sm:text-lg">
              {founder.bio.map((paragraph, index) => (
                <p key={index} data-motion-item>
                  {paragraph}
                </p>
              ))}
            </div>
            <p
              data-motion-item
              className="border-t border-secondary/30 pt-4 font-display text-sm text-primary italic sm:text-base"
            >
              “{founder.quote}”
            </p>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="border-b border-secondary/20 bg-[#fcfaf6] py-16 md:py-20">
        <div className="site-container">
          <div className="mx-auto max-w-2xl text-center" data-motion-text>
            
            <h2
              data-motion-item
              className="font-display text-3xl font-semibold tracking-tight text-primary sm:text-4xl md:text-5xl"
            >
              What We Do
            </h2>
            <ZariOrnament data-motion-item className="mt-4" dark />
            <p data-motion-item className="mt-5 text-base leading-relaxed text-ink/75 sm:text-lg">
              We welcome enquiries for a range of traditional saree collections:
            </p>
          </div>
          <ul className="mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-3 lg:grid-cols-4" data-motion-stagger>
            {sareeTypes.map(({ label, icon }) => (
              <li
                key={label}
                data-motion-item
                className="flex min-h-24 items-center gap-2 rounded-lg border border-secondary/25 bg-white px-3 py-4 text-xs text-ink/85 shadow-sm sm:gap-3 sm:px-4 sm:text-base"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/5 text-secondary sm:h-11 sm:w-11" aria-hidden="true">
                  <SareeTypeIcon name={icon} />
                </span>
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Promise cards */}
      <section className="border-b border-secondary/20 bg-[#fcfaf6] py-20 md:py-28">
        <div className="site-container">
          <div className="mx-auto mb-16 max-w-2xl text-center" data-motion-text>
            <span
              data-motion-item
              className="mb-2 block font-sans text-xs font-bold tracking-[0.3em] text-[#8a6626] uppercase"
            >
              Our approach
            </span>
            <h2
              data-motion-item
              className="font-display text-3xl font-semibold tracking-tight text-primary sm:text-4xl md:text-5xl"
            >
              How We Work
            </h2>
            <ZariOrnament data-motion-item className="mt-4" dark />
          </div>
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8" data-motion-stagger>
            {whyChoose.map((item) => (
              <li
                key={item.title}
                data-motion-item
                className="about-promise-card-luxury about-shadow-card-gold flex flex-col items-center rounded-xl border border-secondary/30 bg-white p-8 text-center"
              >
                <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-secondary/40 bg-[#faf6ee] text-secondary">
                  <ChooseIcon name={item.icon} />
                </span>
                <h3 className="font-display text-xl font-bold text-primary">{item.title}</h3>
                <p className="mt-3 font-sans text-sm leading-relaxed text-stone-600">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Vision & mission */}
      <section className="about-subtle-linen border-b border-secondary/20 py-20 md:py-24">
        <div className="site-container grid grid-cols-1 items-stretch gap-8 md:grid-cols-2" data-motion-stagger>
          <article
            data-motion-item
            className="about-shadow-card-gold rounded-2xl border border-t-4 border-secondary/30 border-t-secondary bg-white p-8 sm:p-12"
          >
            <span className="mb-2 block font-sans text-xs font-bold tracking-[0.25em] text-[#8a6626] uppercase">
              Vision
            </span>
            <h2 className="font-display text-3xl font-bold text-primary sm:text-4xl">Looking ahead</h2>
            <p className="mt-6 font-sans text-base leading-relaxed text-ink/85 sm:text-lg">
              Indian silk sarees carry generations of craftsmanship and cultural heritage. From Kanchipuram Pattu to Mysore silk and Banarasi designs, each variety has distinctive weaving traditions. We welcome enquiries from families who want their unused traditional sarees to be considered for purchase.
            </p>
          </article>
          <article
            data-motion-item
            className="about-shadow-luxury rounded-2xl border border-t-4 border-[#32020f] border-t-secondary bg-primary p-8 text-white sm:p-12"
          >
            <span className="mb-2 block font-sans text-xs font-bold tracking-[0.25em] text-secondary uppercase">
              Mission
            </span>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">What we keep</h2>
            <p className="mt-6 font-sans text-base leading-relaxed text-stone-200 sm:text-lg">
              We explain our process, accept photo enquiries through WhatsApp and individually assess each saree. We consider its fabric, weaving, Zari work and condition. The sale proceeds only when both parties agree on the value and terms.
            </p>
          </article>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-b border-secondary/30 bg-[#32020f] py-16 text-center text-white md:py-20">
        <div className="about-damask-hero pointer-events-none absolute inset-0 opacity-30" aria-hidden />
        <div className="site-container relative z-10 max-w-4xl space-y-8" data-motion-hero>
          <h2
            data-motion-item
            className="font-display text-3xl font-normal tracking-wide sm:text-4xl md:text-5xl"
          >
            Visit Karnan Pattu Centre
          </h2>
          
          <div data-motion-item>
            <Link
              to="/location"
              className="motion-btn inline-flex items-center justify-center rounded-md bg-gradient-to-r from-secondary via-[#e5c378] to-secondary px-10 py-4 font-sans text-sm font-bold tracking-widest text-primary uppercase shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-secondary/25"
            >
              Explore
              <span className="ml-2" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

function SareeTypeIcon({ name }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "h-6 w-6",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  }

  const paths = {
    temple: (
      <>
        <path d="M3 10h18L12 3 3 10z" />
        <path d="M5 10v9m4-9v9m6-9v9m4-9v9M3 21h18M7 14h2m6 0h2" />
      </>
    ),
    weave: (
      <>
        <path d="M4 5h16M4 9h16M4 13h16M4 17h16M4 21h16" />
        <path d="M7 5v4m5 0v4m5 0v4m-7 0v4" />
      </>
    ),
    diamond: (
      <>
        <path d="m12 3 8 9-8 9-8-9 8-9z" />
        <path d="m4 12 16 0M12 3l-3 9 3 9 3-9-3-9z" />
      </>
    ),
    flower: (
      <>
        <path d="M12 12c-4-1-5-5-2-7 2-1 3 1 2 7zm0 0c1-4 5-5 7-2 1 2-1 3-7 2zm0 0c4 1 5 5 2 7-2 1-3-1-2-7zm0 0c-1 4-5 5-7 2-1-2 1-3 7-2z" />
        <circle cx="12" cy="12" r="1.5" />
      </>
    ),
    sparkle: (
      <>
        <path d="m12 2 2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z" />
        <path d="m19 2 .8 2.2L22 5l-2.2.8L19 8l-.8-2.2L16 5l2.2-.8L19 2z" />
      </>
    ),
    bridal: (
      <>
        <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
        <path d="M8 11h2l1-2 2 5 1-3h2" />
      </>
    ),
    heritage: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2M8 3.8 6.5 6M16 3.8 17.5 6" />
      </>
    ),
  }

  return <svg {...common}>{paths[name] ?? paths.weave}</svg>
}

function ChooseIcon({ name }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "h-6 w-6",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    "aria-hidden": true,
  }
  if (name === "heritage") {
    return (
      <svg {...common}>
        <path
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (name === "trust") {
    return (
      <svg {...common}>
        <path
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (name === "reach") {
    return (
      <svg {...common}>
        <path
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <path d="M12 3l8 14H4L12 3z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 9l3 6H9l3-6z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
