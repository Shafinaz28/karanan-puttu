import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { useProducts } from "../context/ProductsContext"

export default function Shop() {
  const { products, loading } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const requested = searchParams.get("category") || "All"
  const collection = searchParams.get("collection") || ""
  const search = (searchParams.get("search") || "").trim().toLowerCase()
  const category = products.some((product) => product.category === requested)
    ? requested
    : "All"

  const categories = useMemo(() => {
    return ["All", ...new Set(products.map((product) => product.category))]
  }, [products])

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
      {loading && <p className="mt-3 text-sm text-ink/50">Loading sarees…</p>}

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

      <div className="mt-8 grid items-stretch gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
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
  silk: "Soft Silk Sarees",
  soft: "Soft Silk Sarees",
  wedding: "Wedding Soft Silks",
  party: "Party Soft Silks",
  new: "New Soft Silks",
}

function matchesCollection(product, collection) {
  if (!collection) return true
  if (collection === "silk" || collection === "soft") return product.fabric === "Soft silk"
  if (collection === "wedding") return /wedding|ivory|maroon|crimson/.test(`${product.name} ${product.badge} ${product.color}`.toLowerCase())
  if (collection === "party") return Boolean(product.party)
  if (collection === "new") return /new/.test(product.badge || "") || product.id >= 5
  return product.fabric === "Soft silk"
}
