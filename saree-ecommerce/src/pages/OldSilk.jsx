import PageDamaskHero from "../components/PageDamaskHero"
import useOldSilkMotion from "../hooks/useOldSilkMotion"

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
        title="We buy all kind of zari & soft silk sarees in any condition"
        subtitle="“Old, used, torn, and faded soft silk. The weave and the border are checked in daylight, then a cash price is named and paid the same day.”"
      />

      <section className="bg-[#f6efe4] py-16" data-old-silk-section>
        <div className="site-container">
          <div data-old-silk-intro className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] tracking-[0.24em] text-[#8a6230] uppercase">What we take</p>
            <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">Soft silk in any condition</h2>
            <p className="mt-4 text-sm leading-7 text-ink/70">
              Soft silk only. A blouse piece is not required. Small tears and tired borders are still priced.
            </p>
          </div>

          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6" data-old-silk-grid>
            {bought.map((item) => (
              <li key={item.name}>
                <article data-old-silk-card className="flex h-full flex-col overflow-hidden rounded-xl border-2 border-[#c59b27] bg-[#3a1216]">
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

      <section
        className="border-t border-[#c59b27]/20 bg-[#efe7db] py-16"
        data-old-silk-section
      >
        <div className="site-container">
          <div data-old-silk-intro className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] tracking-[0.24em] text-[#8a6230] uppercase">Watch & Learn</p>
            <h2 className="mt-3 font-display text-3xl text-primary md:text-4xl">See How We Value Your Sarees</h2>
            <p className="mt-3 text-sm text-ink/70">
              Watch our customer visits and on-the-spot evaluation process in Bengaluru.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3" data-old-silk-videos>
            {youtubeShorts.map((video) => (
              <div
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
                <div className="p-3 text-center text-[#f7f1e8]">
                  <h3 className="line-clamp-2 font-display text-xs md:text-sm">{video.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
