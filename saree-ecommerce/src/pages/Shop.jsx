import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { products } from "../data/products"

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requested = searchParams.get("category") || "All"
  const collection = searchParams.get("collection") || ""
  const search = (searchParams.get("search") || "").trim().toLowerCase()
  const category = products.some((product) => product.category === requested)
    ? requested
    : "All"

  const categories = useMemo(() => {
    return ["All", ...new Set(products.map((product) => product.category))]
  }, [])

  function chooseCategory(item) {
    const next = {}
    if (item !== "All") next.category = item
    if (search) next.search = search
    if (collection) next.collection = collection
    setSearchParams(next)
  }

  const visible = products.filter((product) => {
    const categoryOk = category === "All" || product.category === category
    const searchOk =
      !search ||
      `${product.name} ${product.category} ${product.color}`
        .toLowerCase()
        .includes(search)
    return categoryOk && searchOk && matchesCollection(product, collection)
  })

  const collectionTitle = collectionNames[collection]

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs tracking-[0.22em] text-secondary uppercase">
        The collection
      </p>
      <h1 className="mt-2 font-display text-5xl text-primary">
        {collectionTitle || "Shop"}
      </h1>
      {search && (
        <p className="mt-3 text-sm text-ink/70">
          Results for “{searchParams.get("search")}”
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => chooseCategory(item)}
            className={
              category === item
                ? "motion-btn motion-fill bg-primary px-4 py-2 text-sm text-cream"
                : "motion-btn motion-line border border-primary/30 px-4 py-2 text-sm text-primary"
            }
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {visible.length === 0 && (
          <p className="text-sm text-ink/70">No saree matches that search.</p>
        )}
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

const collectionNames = {
  traditional: "Traditional Sarees",
  silk: "Silk Sarees",
  banarasi: "Banarasi Sarees",
  cotton: "Cotton Sarees",
  handloom: "Handloom Sarees",
  designer: "Designer Sarees",
  wedding: "Wedding Sarees",
  party: "Party Wear Sarees",
  new: "New Arrivals",
}

function matchesCollection(product, collection) {
  const text = `${product.name} ${product.category} ${product.fabric} ${product.description}`.toLowerCase()
  if (collection === "traditional") return /kanchi|kanji|banaras|korvai|handloom|bridal|temple/.test(text)
  if (collection === "silk") return product.category === "Silk" || text.includes("silk")
  if (collection === "banarasi") return /banaras/.test(text)
  if (collection === "cotton") return text.includes("cotton")
  if (collection === "handloom") return /handloom|kanchi|kanji/.test(text)
  if (collection === "designer") return Boolean(product.featured) || /tissue|organza/.test(text)
  if (collection === "wedding") return product.category === "Bridal" || /bridal|wedding/.test(text)
  if (collection === "party") return Boolean(product.party)
  if (collection === "new") return /new/.test(product.badge || "") || product.id >= 5
  return true
}
