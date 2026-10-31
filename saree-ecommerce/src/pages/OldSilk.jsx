import { Link } from "react-router-dom"

const bought = [
  {
    name: "kanjipuram",
    text: "Worn silk is welcome. The body and the border are checked before a price is named.",
    image: "/sarees/worn/old-kanchipuram-silk.avif",
  },
  {
    name: "mysore silk",
    text: "Faded or still bright worn silk. The border is part of the rate.",
    image: "/sarees/worn/old-mysore-silk.avif",
  },
  {
    name: "Nalli",
    text: "Torn borders and split pallus are taken in. The weave is looked at in daylight.",
    image: "/sarees/worn/old-nalli-silk.avif",
  },
  {
    name: "tissue",
    text: "Worn silk folded away or never worn, including pieces with tired zari.",
    image: "/sarees/worn/old-tissue-silk.avif",
  },
  {
    name: "Banarsee",
    text: "Older worn silk drapes are checked for the handwork that is still on the cloth.",
    image: "/sarees/worn/old-banarasi-silk.avif",
  },
  {
    name: "Soft Silk",
    text: "Plain worn silk, light or heavy, folded away or already worn.",
    image: "/sarees/worn/old-soft-silk.avif",
  },
];

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
];

export default function OldSilk() {
  return (
    <>
 <section className="relative flex min-h-[320px] flex-col overflow-hidden sm:min-h-[480px]">
  {/* Full Background Image */}
  <img 
    src="/hero/image.avif" 
    alt="Faded antique silk saree texture" 
    className="absolute inset-0 h-full w-full object-cover object-center"
  />

  {/* Soft Deep Red Overlay to ensure text readability */}
  <div className="absolute inset-0 bg-[#3a1216]/85" />

  {/* Content Block */}
  <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-20 text-center text-[#f7f1e8] sm:py-24 lg:px-8">
    <div className="w-full">
      {/* Breadcrumbs */}
      <p className="text-xs tracking-[0.16em] text-[#d7c4a2]/80 uppercase">
        <Link to="/" className="transition-colors duration-300 hover:text-[#f7f1e8]">
          Home
        </Link>
        <span className="mx-2 text-[#d7c4a2]/50">/</span>
        <span className="text-[#f7f1e8]">Old silk</span>
      </p>

      {/* Main Heading */}
      <h1 className="mt-4 font-display text-5xl font-bold leading-tight text-[#faf6f0] md:text-7xl">
         We Buy All Kind Of Zari & Soft Silk Sarees In Any Condition
      </h1>

      {/* Divider Accent */}
      <div className="mx-auto mt-6 h-[1px] w-16 bg-[#c59b27]/70" />

      {/* Body Text */}
      <p className="mx-auto mt-6 max-w-lg text-sm leading-7 text-[#f7f1e8]/90 drop-shadow-sm md:text-base">
        Old, used, torn, and faded soft silk. The weave and the border are checked in daylight, then a cash price is named and paid the same day.
      </p>
    </div>
  </div>
</section>

      {/* Sarees Grid Section */}
      <section className="bg-[#f6efe4] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div data-slide="up" className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] tracking-[0.24em] text-[#8a6230] uppercase">What we take</p>
            <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">Soft silk in any condition</h2>
            <p className="mt-4 text-sm leading-7 text-ink/70">
              Soft silk only. A blouse piece is not required. Small tears and tired borders are still priced.
            </p>
          </div>

          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
            {bought.map((item, index) => (
              <li key={item.name} data-slide={index % 2 === 0 ? "left" : "right"}>
                <article className="flex h-full flex-col overflow-hidden rounded-xl border-2 border-[#c59b27] bg-[#3a1216]">
                  <img
                    src={item.image}
                    alt={item.name}
                    decoding="async"
                    fetchPriority="high"
                    className="aspect-[5/4] w-full object-cover object-center"
                  />
                  <div className="px-3 py-3 text-center text-[#f7f1e8] md:px-4 md:py-4">
                    <h3 className="font-display text-sm leading-tight md:text-lg">{item.name}</h3>
                    <p className="mt-1 text-[11px] leading-5 text-[#f7f1e8]/75 md:text-xs">{item.text}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* YouTube Shorts Section */}
      <section className="bg-[#efe7db] px-4 py-16 border-t border-[#c59b27]/20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] tracking-[0.24em] text-[#8a6230] uppercase">Watch & Learn</p>
            <h2 className="mt-3 font-display text-3xl text-primary md:text-4xl">See How We Value Your Sarees</h2>
            <p className="mt-3 text-sm text-ink/70">
              Watch our customer visits and on-the-spot evaluation process in Bengaluru.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {youtubeShorts.map((video, idx) => (
              <div key={idx} className="flex flex-col overflow-hidden rounded-xl border-2 border-[#c59b27] bg-[#3a1216] shadow-md">
                <div className="relative aspect-[9/16] w-full bg-black">
                  <iframe
                    src={video.embedUrl}
                    title={video.title}
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-3 text-center text-[#f7f1e8]">
                  <h3 className="font-display text-xs md:text-sm line-clamp-2">{video.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps & Call Action Section */}
      <section className="bg-shell px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {[
            ["01", "Show the saree", "Bring it to V.V. Puram or Jayanagar, or ask for a doorstep pickup in Bengaluru."],
            ["02", "Hear the rate", "Soft silk is looked at in daylight. The price is told before you agree."],
            ["03", "Take the cash", "Once you accept, the money is paid the same day."],
          ].map(([step, title, text], index) => (
            <article key={step} data-slide={index % 2 === 0 ? "left" : "right"} className="text-center">
              <p className="text-[11px] tracking-[0.16em] text-[#c48a3a] uppercase">{step}</p>
              <h3 className="mt-2 font-display text-2xl text-primary">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink/70">{text}</p>
            </article>
          ))}
        </div>
        <div className="mt-12 text-center">
          <a
            href="tel:+919894441500"
            className="motion-btn motion-fill inline-flex items-center gap-2 bg-primary px-6 py-3 text-[11px] tracking-[0.14em] text-cream uppercase"
            style={{ borderRadius: 0 }}
          >
            Call +91 98944 41500
          </a>
        </div>
      </section>
    </>
  )
}