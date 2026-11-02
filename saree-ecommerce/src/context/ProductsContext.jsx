import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { products as localProducts } from "../data/products"
import { mapDbProduct } from "../lib/productMap"
import { supabase, supabaseConfigured } from "../lib/supabase"

const ProductsContext = createContext(null)

export const PRODUCTS_UPDATED_EVENT = "karnan-products-updated"

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(localProducts)
  const [loading, setLoading] = useState(supabaseConfigured)
  const [fromDatabase, setFromDatabase] = useState(false)
  const [loadError, setLoadError] = useState("")

  const refreshProducts = useCallback(async () => {
    if (!supabaseConfigured || !supabase) {
      setProducts(localProducts)
      setFromDatabase(false)
      setLoadError("")
      setLoading(false)
      return
    }

    setLoading(true)
    setLoadError("")
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .order("id", { ascending: true })

    if (error) {
      setLoadError(error.message)
      setProducts(localProducts)
      setFromDatabase(false)
    } else {
      setProducts((data || []).map(mapDbProduct))
      setFromDatabase(true)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    refreshProducts()
  }, [refreshProducts])

  useEffect(() => {
    const onRefresh = () => {
      refreshProducts()
    }
    window.addEventListener(PRODUCTS_UPDATED_EVENT, onRefresh)
    window.addEventListener("focus", onRefresh)
    return () => {
      window.removeEventListener(PRODUCTS_UPDATED_EVENT, onRefresh)
      window.removeEventListener("focus", onRefresh)
    }
  }, [refreshProducts])

  return (
    <ProductsContext.Provider value={{ products, loading, fromDatabase, loadError, refreshProducts }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const value = useContext(ProductsContext)
  if (!value) throw new Error("useProducts must be used inside ProductsProvider")
  return value
}
