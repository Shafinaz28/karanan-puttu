import { Link } from "react-router-dom"
import VisitStores from "../components/VisitStores"

export default function Locations() {
  return (
    <>
      <section className="relative flex min-h-[420px] items-center bg-[#6b2d32]">
        <img
          src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#3a1216]/55" />
        <div className="relative mx-auto w-full max-w-6xl px-6 py-20 text-center text-[#f7f1e8] md:px-10">
          <p className="text-xs tracking-[0.16em] text-[#f7f1e8]/80 uppercase">
            <Link to="/" className="transition-colors duration-300 hover:text-[#d7c4a2]">
              Home
            </Link>
            <span className="mx-2 text-[#d7c4a2]">/</span>
            Our Locations
          </p>
          <h1 className="mt-4 font-display text-5xl md:text-7xl">Our Locations</h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#f7f1e8]/85">
            Showrooms across South India, for new silk and for old sarees sold for cash.
          </p>
          <span className="mx-auto mt-6 block h-px w-16 bg-[#d7c4a2]" />
        </div>
      </section>
      <VisitStores />
    </>
  )
}
