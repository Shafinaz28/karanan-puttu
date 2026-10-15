import { Link } from "react-router-dom"

const sections = [
  {
    title: "What we collect",
    text: "If you write to the desk, we receive the name, mobile number, email, and message you type. If you join the newsletter, we receive that email address. If you call or message on WhatsApp, we receive what you send, including photos of a saree.",
  },
  {
    title: "How we use it",
    text: "We use these details to answer you, to price an old saree, to arrange a shop visit or a doorstep pickup, and to tell you about a drape you asked for. We do not sell your details.",
  },
  {
    title: "The bag on this site",
    text: "Sarees you add to the bag are stored in your own browser, on this device. That list is not sent to us until you contact the desk about an order.",
  },
  {
    title: "How long we keep it",
    text: "Messages and WhatsApp notes are kept for as long as we need them to complete the check, the sale, or the payout, and for our shop records after that.",
  },
  {
    title: "Sharing",
    text: "We share a detail only when it is needed to pay you, to deliver a saree, or when the law asks for it. Staff at the V.V. Puram and Jayanagar shops can see an enquiry that belongs to their counter.",
  },
  {
    title: "Your choices",
    text: "You can ask us to correct or delete a message you sent. Email care@karananpattucentre.com or call +91 72000 16300. You can also clear the bag by removing the sarees in your browser.",
  },
]

export default function Privacy() {
  return (
    <>
      <section className="flex min-h-[280px] items-center bg-[#4a1520] sm:min-h-[340px]">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 text-center text-[#f7f1e8]">
          <p className="text-xs tracking-[0.16em] text-[#f7f1e8]/80 uppercase">
            <Link to="/" className="hover:text-[#d7c4a2]">Home</Link>
            <span className="mx-2 text-[#d7c4a2]">/</span>
            Privacy policy
          </p>
          <h1 className="mt-4 font-display text-5xl md:text-6xl">Privacy policy</h1>
          <span className="mx-auto mt-6 block h-px w-16 bg-[#d7c4a2]" />
        </div>
      </section>
      <section className="bg-[#f7f1e8] px-4 py-16">
        <div className="mx-auto max-w-3xl space-y-8">
          <p className="text-sm leading-7 text-ink/75">
            Karnan Pattu Centre keeps only what we need to sell new silk and to buy old silk.
          </p>
          {sections.map((item) => (
            <article key={item.title}>
              <h2 className="font-display text-2xl text-primary">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-ink/75">{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
