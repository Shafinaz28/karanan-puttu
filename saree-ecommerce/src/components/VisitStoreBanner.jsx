import { Link } from "react-router-dom"

export default function VisitStoreBanner() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-10 text-center md:py-12">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-[#8a6230] uppercase md:text-xs">
          Handcrafted elegance, woven in India
        </p>
        <h2 className="mt-3 font-display text-xl leading-snug text-primary md:mt-4 md:text-3xl md:leading-tight">
          Come experience our collection in person and consult with our stylists
        </h2>
        <Link
          to="/locations"
          className="motion-btn mt-6 inline-flex items-center justify-center border border-primary px-6 py-3 text-xs font-medium tracking-[0.14em] text-primary uppercase transition hover:bg-primary hover:text-cream md:mt-7 md:px-8 md:py-3.5 md:text-sm"
        >
          Visit our store
        </Link>
      </div>
      <div className="w-full overflow-hidden">
        <img
          src="/hero/visit-store-showroom.avif"
          alt="Karnan Pattu Centre showroom with folded silks and hanging sarees"
          decoding="async"
          width={1024}
          height={205}
          className="h-[120px] w-full object-cover object-center sm:h-[145px] md:h-[165px] lg:h-[185px]"
        />
      </div>
    </section>
  )
}
