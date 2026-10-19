import { Link } from "react-router-dom"

const bought = [
  {
    name: "Old Soft Silk",
    text: "Worn soft silk is welcome. The body and the border are checked before a price is named.",
    image: "/sarees/soft/soft-02.jpg",
  },
  {
    name: "Faded Soft Silk",
    text: "Faded or still bright soft silk. The border is part of the rate.",
    image: "/sarees/soft/soft-01.jpg",
  },
  {
    name: "Torn Soft Silk",
    text: "Torn borders and split pallus are taken in. The weave is looked at in daylight.",
    image: "/sarees/soft/soft-08.jpg",
  },
  {
    name: "Unused Soft Silk",
    text: "Soft silk folded away or never worn, including pieces with tired zari.",
    image: "/sarees/soft/soft-04.jpg",
  },
  {
    name: "Antique Soft Silk",
    text: "Older soft silk drapes are checked for the handwork that is still on the cloth.",
    image: "/sarees/soft/soft-10.jpg",
  },
  {
    name: "Plain Soft Silk",
    text: "Plain soft silk, light or heavy, folded away or already worn.",
    image: "/sarees/soft/soft-06.jpg",
  },
  {
    name: "Gold Soft Silk",
    text: "Soft silk with a gold border. Stains and small tears do not rule it out.",
    image: "/sarees/soft/soft-07.jpg",
  },
  {
    name: "Butta Soft Silk",
    text: "Soft silk with buttas, even when a panel has caught or the edge has frayed.",
    image: "/sarees/soft/soft-11.jpg",
  },
]

export default function OldSilk() {
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
              Old silk
            </p>
            <h1 className="mt-4 font-display text-5xl md:text-7xl">Soft silks we buy</h1>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#f7f1e8]/85">
              Old, used, torn, and faded soft silk. The weave and the border are checked, then a cash price is named the same day.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f6efe4] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div data-slide="up" className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] tracking-[0.24em] text-[#8a6230] uppercase">What we take</p>
            <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">Soft silk in any condition</h2>
            <p className="mt-4 text-sm leading-7 text-ink/70">
              Soft silk only. A blouse piece is not required. Small tears and tired borders are still priced.
            </p>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {bought.map((item, index) => (
              <li key={item.name} data-slide={index % 2 === 0 ? "left" : "right"}>
                <article className="flex h-full flex-col overflow-hidden rounded-xl border-2 border-[#c59b27] bg-[#3a1216]">
                  <img
                    src={item.image}
                    alt={item.name}
                    decoding="async"
                    fetchPriority="high"
                    className="aspect-[3/4] w-full object-cover object-center"
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
