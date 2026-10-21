import { createContext, useContext, useEffect, useState } from "react"
import { products as localProducts } from "../data/products"
import { mapDbProduct } from "../lib/productMap"
import { supabase, supabaseConfigured } from "../lib/supabase"

const ProductsContext = createContext(null)

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(localProducts)
  const [loading, setLoading] = useState(supabaseConfigured)
  const [fromDatabase, setFromDatabase] = useState(false)

  async function refreshProducts() {
    if (!supabaseConfigured || !supabase) {
      setProducts(localProducts)
      setFromDatabase(false)
      setLoading(false)
      return
    }

    setLoading(true)
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .order("id", { ascending: true })

    if (error || !data?.length) {
      setProducts(localProducts)
      setFromDatabase(false)
    } else {
      setProducts(data.map(mapDbProduct))
      setFromDatabase(true)
    }
    setLoading(false)
  }

  useEffect(() => {
    refreshProducts()
  }, [])

  return (
    <ProductsContext.Provider value={{ products, loading, fromDatabase, refreshProducts }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const value = useContext(ProductsContext)
  if (!value) throw new Error("useProducts must be used inside ProductsProvider")
  return value
}
