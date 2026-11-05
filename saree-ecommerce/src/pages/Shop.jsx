import { useMemo, useState, useEffect } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import ShopProductCard from "../components/ShopProductCard"
import PageDamaskHero from "../components/PageDamaskHero"
import { useProducts } from "../context/ProductsContext"
import { useMobileShopDrawer } from "../context/MobileShopDrawerContext"
import useShopMotion from "../hooks/useShopMotion"
import { resolveShopCategory } from "../data/products"
import { shopFilterCategories } from "../data/shopCategories"

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
    <nav
      className="mt-10 flex flex-wrap items-center justify-center gap-2 py-2 lg:mt-12 lg:gap-3"
      aria-label="Pagination"
      data-shop-pagination
    >
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

function GridColumnsIcon({ columns }) {
  const gap = 1.25
  const inset = 2
  const inner = 16 - inset * 2
  const barWidth = (inner - gap * (columns - 1)) / columns

  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      {Array.from({ length: columns }, (_, index) => (
        <rect
          key={index}
          x={inset + index * (barWidth + gap)}
          y={3}
          width={barWidth}
          height={10}
          rx={0.75}
        />
      ))}
    </svg>
  )
}

export default function Shop() {
  const { products, loading, fromDatabase, refreshProducts } = useProducts()
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
    refreshProducts()
  }, [refreshProducts])

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
  const cols = Math.min(4, Math.max(2, Number(searchParams.get("cols")) || 4))
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

  const shopMotionKey = useMemo(() => {
    if (loading) return ""
    return `${searchParams.toString()}|${pageItems.map((product) => product.id).join(",")}`
  }, [loading, searchParams, pageItems])

  useShopMotion(shopMotionKey)

  const gridClass =
    cols === 4
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
    <>
      <PageDamaskHero
        breadcrumb="Shop"
        title={collection ? pageTitle : "Browse the collection"}
        subtitle="“Soft Silks With Zari Work And Blouse Pieces Included—From Everyday Drapes To Tissue Weaves And Occasion Edits. Prices Include Tax; Shipping At Checkout.”"
      />
    <section className="bg-white" data-shop-section aria-label="Shop catalogue">
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
              <ShopFiltersPanel {...filterPanelProps} />
            </div>
          </aside>
        </div>
      )}

      <section className="site-section bg-shell">
        <div className="site-section-inner py-8">
        <div className="mt-2 flex flex-col gap-10 lg:flex-row lg:gap-12">
          <aside className="hidden w-full shrink-0 lg:block lg:w-[220px] xl:w-[240px]" data-shop-filters>
            <p className="text-sm font-semibold text-ink">Filters</p>
            <div className="mt-2">
              <ShopFiltersPanel {...filterPanelProps} />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div
              className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-4"
              data-shop-toolbar
            >
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

              <div className="hidden items-center gap-1.5 md:flex" aria-label="Grid columns">
                {[2, 3, 4].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => updateParams({ cols: String(n) })}
                    className={`flex h-9 w-9 items-center justify-center rounded border ${
                      cols === n
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-black/15 text-ink/50 hover:border-primary/40"
                    }`}
                    aria-pressed={cols === n}
                    aria-label={`${n} columns`}
                  >
                    <GridColumnsIcon columns={n} />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-ink/60" data-shop-meta>
              {fromDatabase && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-800">
                  Live from Supabase
                </span>
              )}
              {!loading && (
                <span>
                  {sorted.length} saree{sorted.length === 1 ? "" : "s"}
                  {collection ? ` · ${pageTitle}` : ""}
                </span>
              )}
            </div>

            {loading && <p className="mt-8 text-sm text-ink/50">Loading sarees…</p>}
            {search && (
              <p className="mt-4 text-sm text-ink/70">
                Results for “{searchParams.get("search")}” · {sorted.length} sarees
              </p>
            )}

            {!loading && products.length === 0 && fromDatabase && (
              <p className="mt-10 rounded-2xl border border-dashed border-black/10 bg-[#faf8f4] px-4 py-8 text-center text-sm text-ink/70">
                No sarees in the shop yet. Add products in the admin dashboard with{" "}
                <strong>Visible in shop</strong> turned on and a photo from the product-images bucket.
              </p>
            )}

            {!loading && products.length > 0 && pageItems.length === 0 && (
              <p className="mt-10 text-sm text-ink/70">No saree matches those filters.</p>
            )}

            <ul className={`mt-8 grid gap-x-5 gap-y-10 ${gridClass}`} data-shop-grid>
              {pageItems.map((product) => (
                <li key={product.id} data-shop-product>
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
      </section>
    </section>
    </>
  )
}
