import { Link } from "react-router-dom"

export default function Wishlist() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-[11px] tracking-[0.24em] text-secondary uppercase">Saved drapes</p>
      <h1 className="mt-3 font-display text-5xl text-primary">Wishlist</h1>
      <p className="mt-6 text-sm leading-7 text-ink/80">
        No sarees are saved yet. Browse the shop and keep the ones you want to see again.
      </p>
      <Link
        to="/shop"
        className="motion-btn motion-fill mt-8 inline-block bg-primary px-5 py-3 text-[11px] tracking-[0.16em] text-cream uppercase"
      >
        Shop sarees
      </Link>
    </section>
  )
}
