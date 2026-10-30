import { Link } from "react-router-dom"
import { sareeImages } from "../data/products"

const posts = [
  {
    category: "A buyer's guide",
    title: "How to choose a soft silk saree",
    introduction:
      "A saree should feel right in your hands and feel like you when you wear it. Take a little time to look at the fabric, colour, border and details before choosing.",
    image: sareeImages[3],
    imageAlt: "A colourful soft silk saree from the collection",
    sections: [
      {
        title: "Start with the occasion",
        text: "Think about where you plan to wear it. A lighter look may suit a daytime gathering, while a richer colour or a more prominent border can work beautifully for a celebration. Choose what feels comfortable and true to your style.",
      },
      {
        title: "Look closely at the details",
        text: "Notice how the body colour sits beside the border, how the motifs are spaced, and how the pallu brings the design together. If you are shopping online, check the product description for the listed fabric, length and whether a blouse piece is included.",
      },
      {
        title: "Make room for a proper drape",
        text: "A saree's appearance changes when it is draped. If possible, view it in natural light and ask to see the pallu and border clearly. When shopping from photos, use the images and written details together rather than relying on colour alone.",
      },
    ],
    link: "/shop",
    linkText: "Explore the collection",
  },
  {
    category: "Care & craft",
    title: "Giving a much-loved saree a second life",
    introduction:
      "A saree kept in the family can carry memories as well as craftsmanship. Before deciding what to do with it, give the fabric and its details a careful, unhurried look.",
    image: sareeImages[6],
    imageAlt: "A traditional saree displayed for close inspection",
    sections: [
      {
        title: "Inspect it gently",
        text: "Lay the saree on a clean surface and check the body, edges, border and pallu for stains, fading, loose threads or weak areas. Avoid pulling at fragile sections; a close visual check is a good first step.",
      },
      {
        title: "Keep its story with it",
        text: "If you know when or where it was bought, or who wore it, write that down. Details about its history can be meaningful to the next person, even when they do not change the saree's condition.",
      },
      {
        title: "Ask before making a decision",
        text: "Condition, material and workmanship all matter when discussing an older saree. Share clear photographs and ask what information is needed for an assessment. Any offer should be based on the saree itself and explained before you decide.",
      },
    ],
    link: "/contact",
    linkText: "Ask us about an old saree",
  },
  {
    category: "Visit us",
    title: "What to expect when you visit our showroom",
    introduction:
      "Choosing a saree in person gives you time to compare colours, feel the fabric and look at the weave up close. A relaxed visit can make it easier to find a piece you will enjoy wearing.",
    image: sareeImages[1],
    imageAlt: "A soft silk saree from the Karnan Pattu Centre collection",
    sections: [
      {
        title: "Bring a little inspiration",
        text: "A note about the occasion, colours you enjoy or a blouse you plan to pair with the saree can help narrow the search. You do not need to have every detail decided before you arrive.",
      },
      {
        title: "Take your time comparing",
        text: "Look at the sarees in the light, compare borders and ask to see the pallu. If you have questions about fabric, length, blouse pieces or care, ask the team before making your choice.",
      },
      {
        title: "Plan your visit",
        text: "We welcome you at our Bengaluru showrooms in V.V. Puram and Jayanagar. Check our locations page for directions and contact us if you would like help planning your visit.",
      },
    ],
    link: "/locations",
    linkText: "Find our showrooms",
  },
]

export default function Blog() {
  return (
    <>
      <section className="relative flex min-h-[420px] items-center bg-[#6b2d32] overflow-hidden">
  {/* Full Background Image */}
  <img
    src="/hero/image.avif"
    alt="The Saree Journal Background"
    className="absolute inset-0 h-full w-full object-cover object-center"
  />

  {/* Soft Dark Overlay */}
  <div className="absolute inset-0 bg-[#3a1216]/75" />

  {/* Content Block */}
  <div className="relative mx-auto w-full max-w-6xl px-6 py-20 text-center text-[#f7f1e8] md:px-10">
    <p className="text-xs tracking-[0.16em] text-[#f7f1e8]/80 uppercase">
      <Link to="/" className="transition-colors duration-300 hover:text-[#d7c4a2]">
        Home
      </Link>
      <span className="mx-2 text-[#d7c4a2]">/</span>
      Journal
    </p>

    <h1 className="mt-4 font-display text-5xl font-bold tracking-wide text-[#faf6f0] md:text-7xl">
      The Saree Journal
    </h1>

    <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#f7f1e8]/85 md:text-base">
      Thoughtful guides to choosing, caring for and enjoying sarees, from the team at Karnan Pattu Centre.
    </p>

    <span className="mx-auto mt-6 block h-px w-16 bg-[#d7c4a2]" />
  </div>
</section>

      <section className="bg-paper px-4 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs tracking-[0.18em] text-secondary uppercase">Stories & guides</p>
            <h2 className="mt-2 font-display text-3xl text-primary md:text-4xl">
              A little more about the saree you choose
            </h2>
            <p className="mt-3 text-sm leading-7 text-ink/70">
              Practical notes to help you make a considered choice, care for a treasured piece and enjoy the experience of finding your next saree.
            </p>
          </div>

          <div className="space-y-8">
            {posts.map((post, index) => (
              <article
                key={post.title}
                className="grid overflow-hidden border border-secondary/25 bg-white shadow-sm md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"
              >
                <img
                  src={post.image}
                  alt={post.imageAlt}
                  className="h-auto max-h-[70vh] w-full bg-[#f0e6d8] object-contain md:h-full md:min-h-[440px] md:object-cover"
                />
                <div className="p-6 sm:p-8 lg:p-10">
                  <p className="text-xs tracking-[0.16em] text-secondary uppercase">
                    {String(index + 1).padStart(2, "0")} &nbsp;·&nbsp; {post.category}
                  </p>
                  <h2 className="mt-3 font-display text-3xl leading-tight text-primary sm:text-4xl">
                    {post.title}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-ink/75">{post.introduction}</p>

                  <div className="mt-6 space-y-5">
                    {post.sections.map((section) => (
                      <section key={section.title}>
                        <h3 className="font-medium text-primary">{section.title}</h3>
                        <p className="mt-1.5 text-sm leading-7 text-ink/70">{section.text}</p>
                      </section>
                    ))}
                  </div>

                  <Link
                    to={post.link}
                    className="motion-btn motion-line mt-7 inline-flex border border-primary/30 px-5 py-3 text-xs tracking-[0.12em] text-primary uppercase transition-colors hover:bg-primary hover:text-cream"
                  >
                    {post.linkText}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
