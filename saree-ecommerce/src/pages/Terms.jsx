import { Link } from "react-router-dom"

const sections = [
  {
    title: "Using this site",
    text: "Karnan Pattu Centre sells new silk sarees and buys old, used, and damaged silk. By browsing the site, sending a message, or placing a request, you agree to these terms.",
  },
  {
    title: "New sarees",
    text: "Prices shown are in Indian rupees. A new drape includes a blouse piece unless the product page says otherwise. Colours on a screen can differ slightly from the silk in the shop. An order is confirmed only after the desk accepts it.",
  },
  {
    title: "Old silk we buy",
    text: "A price for an old saree is an offer, not a final payment, until the silk and zari are checked and you accept. Torn, faded, or damaged pieces are welcome. We may refuse a piece that is not silk.",
  },
  {
    title: "Payment",
    text: "Payment for a new saree, and cash for an old saree, is settled with the showroom or by the method the desk confirms. Same-day cash applies after the check is finished and you agree to the rate.",
  },
  {
    title: "Showrooms",
    text: "The shops are in V.V. Puram and Jayanagar, Bengaluru. Hours and pickup can change. Call the desk or write to us before you travel with a saree.",
  },
  {
    title: "Your account and bag",
    text: "The bag on this site is kept in your browser. Clearing the browser can empty it. Sign-in is not open on this preview.",
  },
  {
    title: "Changes",
    text: "We may update these terms. The version on this page is the one that applies when you use the site.",
  },
]

export default function Terms() {
  return (
    <>
      <section className="flex min-h-[280px] items-center bg-[#4a1520] sm:min-h-[340px]">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 text-center text-[#f7f1e8]">
          <p className="text-xs tracking-[0.16em] text-[#f7f1e8]/80 uppercase">
            <Link to="/" className="hover:text-[#d7c4a2]">Home</Link>
            <span className="mx-2 text-[#d7c4a2]">/</span>
            Terms & conditions
          </p>
          <h1 className="mt-4 font-display text-5xl md:text-6xl">Terms & conditions</h1>
          <span className="mx-auto mt-6 block h-px w-16 bg-[#d7c4a2]" />
        </div>
      </section>
      <section className="bg-[#f7f1e8] px-4 py-16">
        <div className="mx-auto max-w-3xl space-y-8">
          {sections.map((item) => (
            <article key={item.title}>
              <h2 className="font-display text-2xl text-primary">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-ink/75">{item.text}</p>
            </article>
          ))}
          <p className="text-sm leading-7 text-ink/75">
            Questions about these terms can go to{" "}
            <a href="mailto:karnanpattucenter@gmail.com" className="text-primary underline">
              karnanpattucenter@gmail.com
            </a>{" "}
            or the <Link to="/contact" className="text-primary underline">contact page</Link>.
          </p>
        </div>
      </section>
    </>
  )
}
