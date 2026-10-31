import { Link } from "react-router-dom"
import { shopCategoryCards } from "../data/shopCategories"

export default function ShopCategoriesSection({ variant = "home", activeCollection = "" }) {
  const compact = variant === "compact"

  return (
    <section className={compact ? "border-b border-black/10 bg-[#faf6f0] px-4 py-10 sm:px-6" : "bg-[#faf6f0] px-5 py-14 md:px-8 md:py-16"}>
      <div className={compact ? "mx-auto max-w-7xl" : "mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12"}>
        {!compact && (
          <div data-slide="left" className="min-w-0 text-center lg:max-w-sm lg:text-left">
            <p className="text-[11px] tracking-[0.28em] text-primary/80 uppercase">Shop by category</p>
            <h2 className="mt-3 font-display text-4xl leading-tight text-primary md:text-5xl">Explore our collections</h2>
            <p className="mt-4 text-sm leading-7 text-ink/65">Discover sarees for every mood, occasion, and style.</p>
            <Link
              to="/shop"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              View all
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}

        {compact && (
          <div className="mb-8 text-center md:mb-10">
            <p className="text-[11px] tracking-[0.28em] text-primary/80 uppercase">Shop by category</p>
            <h2 className="mt-2 font-display text-2xl text-primary md:text-3xl">Browse by collection</h2>
          </div>
        )}

        <ul
          className={
            compact
              ? "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-6"
              : "grid min-w-0 flex-1 grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-6"
          }
        >
          {shopCategoryCards.map((item, index) => {
            const isActive = activeCollection === item.id
            return (
              <li key={item.id} data-slide={compact ? undefined : index % 2 === 0 ? "right" : "left"} className="text-center">
                <Link
                  to={`/shop?collection=${item.id}`}
                  className={`group mx-auto block max-w-[140px] ${isActive ? "ring-2 ring-primary/30 ring-offset-2 ring-offset-[#faf6f0] rounded-full" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="mx-auto block h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-cream shadow-md ring-1 ring-primary/10 transition-transform duration-500 group-hover:scale-[1.04] sm:h-32 sm:w-32">
                    <img
                      src={item.image}
                      alt={item.alt}
                      decoding="async"
                      className="h-full w-full object-cover object-center"
                    />
                  </span>
                  <span className="mt-4 block font-display text-lg leading-tight text-primary sm:text-xl">{item.label}</span>
                  <span className="mt-1 block text-xs text-ink/55">{item.note}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
