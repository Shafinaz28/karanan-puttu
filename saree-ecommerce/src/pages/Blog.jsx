import { Link } from "react-router-dom"
import { sareeImages } from "../data/products"

const posts = [
  {
    title: "How we price an old silk saree",
    text: "Zari, tears, and the age of the weave all change the offer. The rate is told before you agree.",
    image: sareeImages[10],
    to: "/contact",
  },
  {
    title: "What to look for in a new Kanchipuram",
    text: "A named silk, a hand-drawn border, and a blouse piece that leaves with the drape.",
    image: sareeImages[3],
    to: "/shop",
  },
  {
    title: "A morning at the showroom",
    text: "Daylight is the best way to see gold. Book a visit in Chennai or Bengaluru.",
    image: sareeImages[7],
    to: "/locations",
  },
]

export default function Blog() {
  return (
    <>
      <section className="relative flex min-h-[420px] items-center bg-[#6b2d32]">
        <img
          src={sareeImages[4]}
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
            Blog
          </p>
          <h1 className="mt-4 font-display text-5xl md:text-7xl">Blog</h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#f7f1e8]/85">
            Notes from the loom, the counter, and the showroom.
          </p>
          <span className="mx-auto mt-6 block h-px w-16 bg-[#d7c4a2]" />
        </div>
      </section>
      <section className="bg-paper px-4 py-16">
        <ul className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <li key={post.title} className="motion-card border border-secondary/25 bg-white shadow-sm">
              <Link to={post.to} className="block">
                <img src={post.image} alt="" className="motion-zoom h-52 w-full object-cover" />
                <div className="p-5">
                  <h2 className="font-display text-2xl text-primary">{post.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-ink/70">{post.text}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
