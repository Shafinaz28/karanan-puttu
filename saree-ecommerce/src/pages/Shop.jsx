import { useMemo, useState, useEffect } from "react"
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom"
import ShopProductCard from "../components/ShopProductCard"
import { useProducts } from "../context/ProductsContext"
import { useMobileShopDrawer } from "../context/MobileShopDrawerContext"
import { resolveShopCategory } from "../data/products"
import { shopFilterCategories } from "../data/shopCategories"
import VisitStoreBanner from "../components/VisitStoreBanner"

const PAGE_SIZE = 12

const shopCategories = shopFilterCategories

const collectionNames = {
  silk: "Silk collection",
  soft: "Silk collection",
  tissue: "Tissue collection",
  traditional: "Traditional wear",
  party: "Party wear",
  wedding: "Wedding collection",
  new: "New arrivals",
}

const sortOptions = [
  { id: "bestselling", label: "Bestselling" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "newest", label: "Newest" },
]

function matchesCollection(product, collection) {
  if (!collection) return true
  const key = resolveShopCategory(product)
  if (collection === "silk" || collection === "soft") return key === "soft"
  if (collection === "tissue") return key === "tissue"
  if (collection === "traditional") return key === "traditional"
  if (collection === "party") return key === "party"
  if (collection === "wedding") return /wedding/i.test(product.badge || "")
  if (collection === "new") return /new/i.test(product.badge || "")
  return key === collection
}

function sortProducts(list, sort) {
  const copy = [...list]
  if (sort === "price-asc") return copy.sort((a, b) => a.price - b.price)
  if (sort === "price-desc") return copy.sort((a, b) => b.price - a.price)
  if (sort === "newest") return copy.sort((a, b) => Number(b.id) - Number(a.id))
  return copy.sort((a, b) => {
    const score = (product) =>
      (/bestseller/i.test(product.badge || "") ? 2 : 0) + (product.featured ? 1 : 0)
    return score(b) - score(a)
  })
}

function FilterSection({ title, open, onToggle, children, chevron = false }) {
  return (
    <div className="border-b border-black/10 py-4">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between text-left text-sm font-semibold text-ink"
      >
        {title}
        {chevron ? (
          <svg
            viewBox="0 0 24 24"
            className={`h-4 w-4 text-ink/45 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        ) : (
          <span className="text-lg leading-none text-ink/40">{open ? "−" : "+"}</span>
        )}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  )
}

function ShopFiltersPanel({
  openFilters,
  setOpenFilters,
  shopCategories,
  collection,
  updateParams,
  fabricOptions,
  fabricParam,
  occasionParam,
  minPrice,
  maxPrice,
  chevron = false,
}) {
  return (
    <>
      <FilterSection
        title="Categories"
        chevron={chevron}
        open={openFilters.categories}
        onToggle={() => setOpenFilters((c) => ({ ...c, categories: !c.categories }))}
      >
        <ul className="space-y-2.5 text-sm text-ink/60">
          {shopCategories.map((item) => (
            <li key={item.id || "all"}>
              <button
                type="button"
                onClick={() => updateParams({ collection: item.id })}
                className={`text-left hover:text-primary ${collection === item.id ? "font-medium text-ink" : ""}`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection
        title="Fabric"
        chevron={chevron}
        open={openFilters.fabric}
        onToggle={() => setOpenFilters((c) => ({ ...c, fabric: !c.fabric }))}
      >
        <ul className="space-y-2">
          {fabricOptions.map((name) => (
            <li key={name}>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-ink/75">
                <input
                  type="checkbox"
                  checked={fabricParam === name}
                  onChange={() => updateParams({ fabric: fabricParam === name ? "" : name })}
                  className="accent-primary"
                />
                {name}
              </label>
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection
        title="Occasion"
        chevron={chevron}
        open={openFilters.occasion}
        onToggle={() => setOpenFilters((c) => ({ ...c, occasion: !c.occasion }))}
      >
        <ul className="space-y-2 text-sm">
          {[
            { id: "wedding", label: "Wedding" },
            { id: "party", label: "Party" },
          ].map((item) => (
            <li key={item.id}>
              <label className="flex cursor-pointer items-center gap-2 text-ink/75">
                <input
                  type="checkbox"
                  checked={occasionParam === item.id}
                  onChange={() => updateParams({ occasion: occasionParam === item.id ? "" : item.id })}
                  className="accent-primary"
                />
                {item.label}
              </label>
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection
        title="Price"
        chevron={chevron}
        open={openFilters.price}
        onToggle={() => setOpenFilters((c) => ({ ...c, price: !c.price }))}
      >
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(event) => updateParams({ min: event.target.value, page: "1" })}
            className="w-full rounded border border-black/15 px-2 py-1.5 text-sm outline-none focus:border-primary"
          />
          <span className="text-ink/40">–</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(event) => updateParams({ max: event.target.value, page: "1" })}
            className="w-full rounded border border-black/15 px-2 py-1.5 text-sm outline-none focus:border-primary"
          />
        </div>
      </FilterSection>
    </>
  )
}

function buildPaginationSequence(totalPages, currentPage) {
  if (totalPages <= 1) return [1]
  return Array.from({ length: totalPages }, (_, index) => index + 1)
    .filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
    .reduce((sequence, page, index, pages) => {
      if (index > 0 && page - pages[index - 1] > 1) sequence.push("…")
      sequence.push(page)
      return sequence
    }, [])
}

function ShopPagination({ totalPages, currentPage, onPageChange }) {
  if (totalPages <= 1) return null

  const items = buildPaginationSequence(totalPages, currentPage)

  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2 py-2 lg:mt-12 lg:gap-3" aria-label="Pagination">
          {totalPages > 1 && currentPage > 1 && (
            <button
              type="button"
              onClick={() => onPageChange(currentPage - 1)}
              className="hidden h-10 w-10 items-center justify-center text-lg text-ink/70 hover:text-primary lg:flex"
              aria-label="Previous page"
            >
              ‹
            </button>
          )}

          {items.map((item, index) =>
            item === "…" ? (
              <span key={`gap-${index}`} className="px-2 text-sm text-ink/45 lg:px-1">
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                aria-current={currentPage === item ? "page" : undefined}
                className={
                  currentPage === item
                    ? "flex h-10 w-10 items-center justify-center rounded-full bg-black/10 text-sm font-medium text-ink lg:bg-primary lg:text-cream"
                    : "flex h-10 min-w-[2rem] items-center justify-center px-2 text-sm text-ink hover:text-primary"
                }
              >
                {item}
              </button>
            ),
          )}

          {totalPages > 1 && (
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="flex h-10 min-w-[2rem] items-center justify-center px-2 text-lg text-ink disabled:opacity-30"
              aria-label="Next page"
            >
              »
            </button>
          )}
    </nav>
  )
}

export default function Shop() {
  const { products, loading } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { open: mobileFiltersOpen, openDrawer, closeDrawer } = useMobileShopDrawer()
  const [drawerMounted, setDrawerMounted] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [openFilters, setOpenFilters] = useState({
    categories: true,
    fabric: true,
    occasion: true,
    price: true,
  })

  useEffect(() => {
    if (location.state?.openMobileFilters) {
      openDrawer()
      navigate(`${location.pathname}${location.search}`, { replace: true, state: null })
    }
  }, [location.state, location.pathname, location.search, navigate, openDrawer])

  useEffect(() => {
    if (mobileFiltersOpen) {
      setDrawerMounted(true)
      const frame = window.requestAnimationFrame(() => setDrawerVisible(true))
      return () => window.cancelAnimationFrame(frame)
    }
    setDrawerVisible(false)
    const timeout = window.setTimeout(() => setDrawerMounted(false), 280)
    return () => window.clearTimeout(timeout)
  }, [mobileFiltersOpen])

  const collection = searchParams.get("collection") || ""
  const search = (searchParams.get("search") || "").trim().toLowerCase()
  const fabricParam = searchParams.get("fabric") || ""
  const occasionParam = searchParams.get("occasion") || ""
  const sort = searchParams.get("sort") || "bestselling"
  const page = Math.max(1, Number(searchParams.get("page")) || 1)
  const cols = Math.min(5, Math.max(2, Number(searchParams.get("cols")) || 4))
  const minPrice = searchParams.get("min") || ""
  const maxPrice = searchParams.get("max") || ""

  const pageTitle = collectionNames[collection] || "Full collection"

  const fabricOptions = useMemo(() => {
    return [...new Set(products.map((p) => p.fabric).filter(Boolean))]
  }, [products])

  function updateParams(partial) {
    const next = new URLSearchParams(searchParams)
    Object.entries(partial).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) next.delete(key)
      else next.set(key, String(value))
    })
    if (!("page" in partial)) next.delete("page")
    setSearchParams(next)
  }

  const filtered = useMemo(() => {
    const min = minPrice ? Number(minPrice) : null
    const max = maxPrice ? Number(maxPrice) : null

    return products.filter((product) => {
      if (!matchesCollection(product, collection)) return false
      if (fabricParam && product.fabric !== fabricParam) return false
      if (occasionParam === "wedding" && !/wedding|wedding edit/i.test(product.badge || "")) return false
      if (occasionParam === "party" && resolveShopCategory(product) !== "party") return false
      if (min !== null && !Number.isNaN(min) && product.price < min) return false
      if (max !== null && !Number.isNaN(max) && product.price > max) return false
      if (
        search &&
        !`${product.name} ${product.category} ${product.color} ${product.fabric} ${product.line}`
          .toLowerCase()
          .includes(search)
      ) {
        return false
      }
      return true
    })
  }, [products, collection, fabricParam, occasionParam, minPrice, maxPrice, search])

  const sorted = useMemo(() => sortProducts(filtered, sort), [filtered, sort])
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageItems = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const gridClass =
    cols === 5
      ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      : cols === 4
        ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        : cols === 3
          ? "grid-cols-2 md:grid-cols-3"
          : "grid-cols-2"

  const filterPanelProps = {
    openFilters,
    setOpenFilters,
    shopCategories,
    collection,
    updateParams,
    fabricOptions,
    fabricParam,
    occasionParam,
    minPrice,
    maxPrice,
  }

  return (
    <div className="bg-white">
      {drawerMounted && (
        <div className="fixed inset-0 z-[90] lg:hidden" role="presentation">
          <button
            type="button"
            aria-label="Close filters"
            className={`shop-filter-backdrop absolute inset-0 bg-black/40 ${drawerVisible ? "" : "is-closing"}`}
            onClick={closeDrawer}
          />
          <aside
            className={`shop-filter-panel absolute left-0 top-0 flex h-full w-[calc(100%-2.75rem)] max-w-[360px] flex-col bg-white shadow-2xl ${
              drawerVisible ? "" : "is-closing"
            }`}
            aria-label="Filters"
            aria-hidden={!drawerVisible}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-black/10 px-5 py-4">
              <h2 className="text-base font-semibold text-ink">Filters</h2>
              <button
                type="button"
                onClick={closeDrawer}
                className="p-1 text-2xl leading-none text-ink/70"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-8">
              <ShopFiltersPanel {...filterPanelProps} chevron />
            </div>
          </aside>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <nav className="text-xs text-ink/55">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-1.5">›</span>
          <span className="text-ink/80">Shop</span>
          {collection && (
            <>
              <span className="mx-1.5">›</span>
              <span className="text-ink/80">{pageTitle}</span>
            </>
          )}
        </nav>

        <header className="mx-auto mt-6 max-w-3xl text-center md:mt-8">
          <h1 className="font-display text-3xl text-ink md:text-4xl">
            {collection ? pageTitle : "Browse the collection"}
          </h1>
          <p className="mt-4 text-sm leading-7 text-ink/65">
            Drapes with zari work and blouse pieces included — from everyday silks to tissue weaves and occasion edits.
            Narrow your browse with the filters beside the grid.
          </p>
          <p className="mt-3 text-sm leading-7 text-ink/65">
            Prices include tax. Shipping is calculated at checkout.
          </p>
        </header>

        <div className="mt-12 flex flex-col gap-10 lg:flex-row lg:gap-12">
          <aside className="hidden w-full shrink-0 lg:block lg:w-[220px] xl:w-[240px]">
            <p className="text-sm font-semibold text-ink">Filters</p>
            <div className="mt-2">
              <ShopFiltersPanel {...filterPanelProps} />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={openDrawer}
                  className="rounded border border-black/15 bg-white px-3 py-2 text-sm text-ink lg:hidden"
                >
                  Filter
                </button>
                <label className="flex items-center gap-2 text-sm text-ink/70">
                <span className="sr-only">Sort by</span>
                <select
                  value={sort}
                  onChange={(event) => updateParams({ sort: event.target.value })}
                  className="rounded border border-black/15 bg-white py-2 pl-3 pr-8 text-sm outline-none focus:border-primary"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                </label>
              </div>

              <div className="hidden items-center gap-1 lg:flex" aria-label="Grid columns">
                {[2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => updateParams({ cols: String(n) })}
                    className={`flex h-9 w-9 items-center justify-center rounded border text-xs ${
                      cols === n
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-black/15 text-ink/50 hover:border-primary/40"
                    }`}
                    aria-pressed={cols === n}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {loading && <p className="mt-8 text-sm text-ink/50">Loading sarees…</p>}
            {search && (
              <p className="mt-4 text-sm text-ink/70">
                Results for “{searchParams.get("search")}” · {sorted.length} sarees
              </p>
            )}

            {!loading && pageItems.length === 0 && (
              <p className="mt-10 text-sm text-ink/70">No saree matches those filters.</p>
            )}

            <ul className={`mt-8 grid gap-x-5 gap-y-10 ${gridClass}`}>
              {pageItems.map((product) => (
                <li key={product.id}>
                  <ShopProductCard product={product} />
                </li>
              ))}
            </ul>

            {totalPages > 1 && (
              <ShopPagination
                totalPages={totalPages}
                currentPage={safePage}
                onPageChange={(nextPage) => {
                  updateParams({ page: String(nextPage) })
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
              />
            )}
          </div>
        </div>
      </div>
      <VisitStoreBanner />
    </div>
  )
}
