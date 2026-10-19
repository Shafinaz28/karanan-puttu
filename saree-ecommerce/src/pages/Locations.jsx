import { Link } from "react-router-dom"
import VisitStores from "../components/VisitStores"

export default function Locations() {
  return (
    <>
      <section className="flex min-h-[320px] items-center bg-[#4a1520] sm:min-h-[380px]">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 text-center text-[#f7f1e8] md:px-10">
          <p className="text-xs tracking-[0.16em] text-[#f7f1e8]/80 uppercase">
            <Link to="/" className="transition-colors duration-300 hover:text-[#d7c4a2]">
              Home
            </Link>
            <span className="mx-2 text-[#d7c4a2]">/</span>
            Our Locations
          </p>
          <h1 className="mt-4 font-display text-5xl md:text-7xl">Our Locations</h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#f7f1e8]/85">
            Three shops in Bengaluru, for new silk and for old sarees sold for cash.
          </p>
          <span className="mx-auto mt-6 block h-px w-16 bg-[#d7c4a2]" />
        </div>
      </section>
      <VisitStores />
    </>
  )
}
