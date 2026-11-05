import PageDamaskHero from "../components/PageDamaskHero"
import useOldSilkMotion from "../hooks/useOldSilkMotion"

const bought = [
  {
    name: "Old Zari Saree Buying",
    text: "We welcome enquiries for old Zari sarees featuring traditional gold-toned and silver-toned work.",
    image: "/sarees/worn/old-zari-silk.avif",
  },
  {
    name: "Zari Dhoti Buying",
    text: "Enquire about selling traditional dhotis with gold or silver Zari borders. Share clear photos of the fabric and border for review.",
    image: "/sarees/worn/zari-dhoti.avif",
  },
  {
    name: "Kanchipuram Silk Saree Buying",
    text: "Kanchipuram silk sarees are valued for their traditional craftsmanship, rich colours and intricate borders. Contact us and share photographs of unused sarees for assessment.",
    image: "/sarees/worn/old-kanchipuram-silk.avif",
  },
  {
    name: "Mysore Silk Saree Buying",
    text: "We welcome enquiries for old Mysore silk sarees, including traditional designs with Zari borders. Share photographs of the fabric and border to help us understand your saree.",
    image: "/sarees/worn/old-mysore-silk.avif",
  },
  {
    name: "Banarasi Silk Saree Buying",
    text: "Have old Banarasi silk sarees stored away? Contact Karnan Pattu Centre to enquire about selling your traditional Banarasi sarees.",
    image: "/sarees/worn/old-banarasi-silk.avif",
  },
  {
    name: "Wedding and Bridal Saree Buying",
    text: "We welcome enquiries for old bridal silk sarees, wedding Pattu sarees and traditional occasion-wear collections.",
    image: "/sarees/worn/crimson.avif",
  },
  {
    name: "Antique and Vintage Saree Buying",
    text: "Share photographs and any details you know about your vintage or inherited saree, such as its age, origin and weaving.",
    image: "/sarees/worn/antique-silk.avif",
  },
  {
    name: "Bulk Saree Buying Enquiries",
    text: "If you have several old sarees, enquire about selling the collection together. Share the approximate number of sarees and photographs of different varieties.",
    image: "/sarees/worn/old-bulk-sarees.avif",
  },
  {
    name: "Torn Sarees",
    text: "Enquire about selling torn or damaged sarees. Share clear photos of the tear, fabric and Zari border for an individual review.",
    image: "/sarees/worn/torn-saree.avif",
  },
]

const assessmentDetails = [
  { label: "Full saree photos", icon: "saree" },
  { label: "Border photos", icon: "border" },
  { label: "Pallu photos", icon: "pallu" },
  { label: "Zari work close-ups", icon: "zari" },
  { label: "Damage or stain photos", icon: "condition" },
  { label: "Number of sarees", icon: "quantity" },
]

const youtubeShorts = [
  {
    title: "Bangalore's Trusted Old Silk Saree Buyers",
    embedUrl: "https://www.youtube.com/embed/G13acqhWgC8",
  },
  {
    title: "Spot Cash for Old Silk Sarees at V.V. Puram",
    embedUrl: "https://www.youtube.com/embed/JvovXMw0GgU",
  },
  {
    title: "Visit Karnan Pattu Center for Best Rates",
    embedUrl: "https://www.youtube.com/embed/fojwLiRTW8U",
  },
]

export default function OldSilk() {
  useOldSilkMotion()

  return (
    <>
      <PageDamaskHero
        breadcrumb="Old silk"
        title="Old Saree Buying Services in Bangalore"
        subtitle="Enquire about selling traditional silk, Zari, Pattu and wedding sarees at Karnan Pattu Centre."
      />

      {/* Saree Categories Section */}
      <section className="bg-[#f6efe4] py-16 md:py-20" data-old-silk-section>
        <div className="site-container">
          <div data-old-silk-intro className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] tracking-[0.24em] text-[#8a6230] uppercase">Old saree buying services</p>
            <h2 className="mt-3 font-display text-3xl text-primary md:text-5xl">Enquire about your saree</h2>
            <p className="mt-4 text-sm leading-7 text-ink/70">
              Are you searching for a place to sell your old silk sarees in Bangalore? We review each saree individually based on its fabric, weaving, Zari work, design and overall condition. Our aim is to make the enquiry and assessment process simple and clear.
            </p>
          </div>

          <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" data-old-silk-grid>
            {bought.map((item) => (
              <li key={item.name} className="h-full">
                <article data-old-silk-card className="flex h-full flex-col overflow-hidden rounded-xl border-2 border-[#c59b27] bg-[#3a1216] shadow-sm transition-transform duration-300 hover:-translate-y-1">
                  <div className="aspect-[5/4] w-full overflow-hidden bg-black/10">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5 text-left text-[#f7f1e8] md:p-6">
                    <h3 className="font-display text-xl leading-tight tracking-wide md:text-2xl">{item.name}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#f7f1e8]/80">{item.text}</p>
                    {item.items && (
                      <ul className="mt-4 space-y-2 border-t border-[#c59b27]/30 pt-4 text-sm text-[#f7f1e8]/85">
                        {item.items.map((detail) => (
                          <li key={detail} className="flex items-start gap-2">
                            <span className="text-[#c59b27]" aria-hidden="true">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Detailed Services & Info Section */}
      <section className="bg-white py-16 md:py-20" data-old-silk-section>
        <div className="site-container">
          {/* Assessment Checklist */}
          <div className="mt-10 w-full rounded-xl bg-[#f6efe4] p-6 sm:p-8">
            <h2 className="font-display text-2xl text-primary md:text-3xl">What Information Should You Share?</h2>
            <p className="mt-3 text-sm leading-7 text-ink/75">
              To help us understand your saree quickly and accurately, please share:
            </p>
            <ul className="mt-6 grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {assessmentDetails.map(({ label, icon }) => (
                <li
                  key={label}
                  className="flex min-w-0 flex-col items-center gap-3 rounded-xl border border-[#c59b27]/25 bg-white/70 px-3 py-4 text-center text-sm font-medium text-ink/75 sm:px-4"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3a1216] text-[#c59b27]">
                    <AssessmentIcon name={icon} />
                  </span>
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* YouTube Shorts / Videos Section */}
      <section
        className="border-t border-[#c59b27]/20 bg-[#efe7db] py-16 md:py-20"
        data-old-silk-section
      >
        <div className="site-container">
          <div data-old-silk-intro className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] tracking-[0.24em] text-[#8a6230] uppercase">Watch & Learn</p>
            <h2 className="mt-3 font-display text-3xl text-primary md:text-4xl">See How We Value Your Sarees</h2>
            <p className="mt-3 text-sm text-ink/70">
              Watch videos and customer visits from Karnan Pattu Centre.
            </p>
          </div>

          <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" data-old-silk-videos>
            {youtubeShorts.map((video) => (
              <li
                key={video.embedUrl}
                data-old-silk-video
                className="flex flex-col overflow-hidden rounded-xl border-2 border-[#c59b27] bg-[#3a1216] shadow-md"
              >
                <div className="relative aspect-[9/16] w-full bg-black">
                  <iframe
                    src={video.embedUrl}
                    title={video.title}
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-4 text-center text-[#f7f1e8]">
                  <h3 className="line-clamp-2 font-display text-sm">{video.title}</h3>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[#3a1216] px-6 py-10 text-center text-[#f7f1e8] shadow-lg sm:px-10" data-old-silk-section>
        <div className="site-container">
          <h2 className="font-display text-3xl sm:text-4xl">Contact Us for Old Saree Assessment</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#f7f1e8]/80">
            Have old silk or Zari sarees to sell? Contact Karnan Pattu Centre today for honest valuations and spot cash.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href="tel:+919894441500"
              className="inline-flex items-center justify-center rounded-md bg-[#c59b27] px-6 py-3 text-xs font-semibold tracking-wider text-[#2c1814] uppercase transition-colors hover:bg-[#b08822]"
            >
              Call +91 98944 41500
            </a>
            <a
              href="https://wa.me/919894441500"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-[#c59b27] px-6 py-3 text-xs font-semibold tracking-wider text-[#f7f1e8] uppercase transition-colors hover:bg-white/10"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

function AssessmentIcon({ name }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "h-6 w-6",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  }

  const paths = {
    saree: <><path d="M7 3h10l-2 5 4 13H5L9 8 7 3z" /><path d="M9 8h6M7 17h10" /></>,
    border: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 4v16M12 4v16M16 4v16" /></>,
    pallu: <><path d="M4 5h16v14H4z" /><path d="m4 15 5-5 3 3 3-4 5 6" /><circle cx="9" cy="8" r="1" /></>,
    zari: <><path d="m12 2 2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2L12 2z" /><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z" /></>,
    condition: <><path d="M12 3 22 20H2L12 3z" /><path d="M12 9v5M12 17h.01" /></>,
    quantity: <><path d="M8 4h8l1 3H7l1-3zM6 7h12l1 13H5L6 7z" /><path d="M9 11h6M9 15h6" /></>,
  }

  return <svg {...common}>{paths[name]}</svg>
}