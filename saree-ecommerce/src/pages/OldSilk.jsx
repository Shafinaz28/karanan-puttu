import { Link } from "react-router-dom"
import { sareeImages } from "../data/products"

const photo = (index) => sareeImages[index]

const bought = [
  {
    name: "Old and used pure silk",
    text: "Worn silk is welcome. The body and the border are checked before a price is named.",
    image: photo(0),
  },
  {
    name: "Banarasi silk",
    text: "Kadhua and tissue Banarasi, faded or still bright. The zari is part of the rate.",
    image: photo(2),
  },
  {
    name: "Brocade",
    text: "Heavy brocade and split pallus are taken in. The weave is looked at in daylight.",
    image: photo(10),
  },
  {
    name: "Kanjivaram silk",
    text: "Korvai and temple borders from Kanchipuram, including pieces with tired zari.",
    image: photo(1),
  },
  {
    name: "Antique silk",
    text: "Older heirloom drapes are checked for the handwork that is still on the cloth.",
    image: photo(5),
  },
  {
    name: "Mysore silk",
    text: "Plain and crepe Mysore silk, light or heavy, folded away or already worn.",
    image: photo(7),
  },
  {
    name: "Tussar silk",
    text: "Tussar with a soft gold or a plain body. Stains and small tears do not rule it out.",
    image: photo(8),
  },
  {
    name: "Tissue sarees",
    text: "Gold and silver tissue, even when a panel has caught or the edge has frayed.",
    image: photo(4),
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
            <h1 className="mt-4 font-display text-5xl md:text-7xl">Sarees we buy</h1>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#f7f1e8]/85">
              Old, used, torn, and faded silk. The weave and the zari are checked, then a cash price is named the same day.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f6efe4] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div data-slide="up" className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] tracking-[0.24em] text-[#8a6230] uppercase">What we take</p>
            <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">Silk in any condition</h2>
            <p className="mt-4 text-sm leading-7 text-ink/70">
              Kanjivaram, Banarasi, Mysore, tissue, brocade, and tussar. A blouse piece is not required. Small tears and tired zari are still priced.
            </p>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {bought.map((item, index) => (
              <li key={item.name} data-slide={index % 2 === 0 ? "left" : "right"}>
                <article className="overflow-hidden border-2 border-[#c59b27] bg-[#3a1216]">
                  <img src={item.image} alt={item.name} decoding="async" fetchPriority="high" className="aspect-[5/4] w-full object-cover" />
                  <div className="px-3 py-3 text-[#f7f1e8] md:px-4 md:py-4">
                    <h3 className="font-display text-sm leading-tight md:text-lg">{item.name}</h3>
                    <p className="mt-1 text-[11px] leading-5 text-[#f7f1e8]/75 md:text-xs">{item.text}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {[
            ["01", "Show the saree", "Bring it to V.V. Puram or Jayanagar, or ask for a doorstep pickup in Bengaluru."],
            ["02", "Hear the rate", "Silk and zari are looked at in daylight. The price is told before you agree."],
            ["03", "Paid the same day", "Once you accept, the amount is paid that day."],
          ].map(([mark, title, text]) => (
            <article key={mark} data-slide="up" className="border border-[#ead9bf] bg-[#fbf7f1] p-6 text-center">
              <p className="font-display text-2xl text-[#c59b27]">{mark}</p>
              <h2 className="mt-3 font-display text-2xl text-primary">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-ink/70">{text}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a
            href="tel:+917200016300"
            className="motion-btn motion-fill inline-flex items-center gap-2 bg-primary px-6 py-3 text-[11px] tracking-[0.14em] text-cream uppercase"
            style={{ borderRadius: 0 }}
          >
            Call +91 72000 16300
          </a>
        </div>
      </section>
    </>
  )
}
