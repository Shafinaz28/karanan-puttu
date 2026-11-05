import { Link } from "react-router-dom"
import PageDamaskHero from "../components/PageDamaskHero"

const posts = [
  {
    category: "A buyer's guide",
    title: "How to choose a soft silk saree",
    introduction:
      "A saree should feel right in your hands and feel like you when you wear it. Take a little time to look at the fabric, colour, border and details before choosing.",
    image: "/sarees/worn/old-soft-silk.avif",
    imageAlt: "Old soft silk saree checked at the counter",
    meta: "Buying guide",
    link: "/shop",
    linkText: "Explore the collection",
  },
  {
    category: "Care & craft",
    title: "Giving a much-loved saree a second life",
    introduction:
      "A saree kept in the family can carry memories as well as craftsmanship. Before deciding what to do with it, give the fabric and its details a careful, unhurried look.",
    image: "/sarees/worn/old-kanchipuram-silk.avif",
    imageAlt: "Old Kanchipuram silk saree with zari border",
    meta: "Care & resale",
    link: "/contact",
    linkText: "Ask us about an old saree",
  },
  {
    category: "Visit us",
    title: "What to expect when you visit our showroom",
    introduction:
      "Choosing a saree in person gives you time to compare colours, feel the fabric and look at the weave up close. A relaxed visit can make it easier to find a piece you will enjoy wearing.",
    image: "/sarees/worn/old-mysore-silk.avif",
    imageAlt: "Old Mysore silk saree from a customer collection",
    meta: "Showroom visit",
    link: "/locations",
    linkText: "Find our showrooms",
  },
]

export default function Blog() {
  return (
    <>
      <PageDamaskHero
        breadcrumb="Journal"
        title="The Saree Journal"
        subtitle="“Thoughtful Guides To Choosing, Caring For, And Enjoying Sarees, From The Team At Karnan Pattu Centre.”"
      />

      <section className="about-subtle-linen border-b border-secondary/20 py-16 md:pb-24 md:pt-20">
        <div className="site-container">
          <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
            <p className="text-xs font-bold tracking-[0.28em] text-[#8a6626] uppercase">Stories &amp; guides</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-primary md:text-4xl">
              A little more about the saree you choose
            </h2>
            <p className="mt-4 font-sans text-sm leading-7 text-ink/70 md:text-base">
              Practical notes to help you make a considered choice, care for a treasured piece and enjoy the experience
              of finding your next saree.
            </p>
          </div>

          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {posts.map((post, index) => (
              <li key={post.title}>
                <BlogPreviewCard post={post} index={index} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

function BlogPreviewCard({ post, index }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="aspect-[3/2] overflow-hidden bg-[#f0e6d8]">
        <img
          src={post.image}
          alt={post.imageAlt}
          className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.02]"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="flex flex-1 flex-col px-5 pt-5 pb-6">
        <p className="text-xs font-semibold tracking-[0.14em] text-secondary uppercase">
          {String(index + 1).padStart(2, "0")} &nbsp;·&nbsp; {post.category}
        </p>
        <h3 className="mt-2 text-lg font-semibold leading-snug text-ink">{post.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-ink/60">{post.introduction}</p>
        <Link
          to={post.link}
          className="motion-btn mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-soft"
        >
          {post.linkText}
          <span aria-hidden="true">→</span>
        </Link>
        <div className="mt-5 flex items-center gap-3 border-t border-black/[0.06] pt-4">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-display text-[11px] font-bold text-secondary"
            aria-hidden
          >
            KPC
          </span>
          <div className="min-w-0 text-xs leading-snug text-ink/55">
            <span className="block font-semibold text-ink/80">Karnan Pattu Centre</span>
            <span>
              {post.meta}
              <span className="mx-1.5 text-ink/30">·</span>
              Guide {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
