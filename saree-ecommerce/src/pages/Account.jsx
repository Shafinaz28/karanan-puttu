import { Link } from "react-router-dom"

export default function Account() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-[11px] tracking-[0.24em] text-secondary uppercase">The house</p>
      <h1 className="mt-3 font-display text-5xl text-primary">Account</h1>
      <p className="mt-6 text-sm leading-7 text-ink/80">
        Sign-in is not open on this preview. Write to the showroom and the desk will keep a drape aside for you.
      </p>
      <Link
        to="/contact"
        className="motion-btn motion-fill mt-8 inline-block bg-primary px-5 py-3 text-[11px] tracking-[0.16em] text-cream uppercase"
      >
        Contact the showroom
      </Link>
    </section>
  )
}
