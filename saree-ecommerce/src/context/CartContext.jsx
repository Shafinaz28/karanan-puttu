import { createContext, useContext, useEffect, useState } from "react"

const CartContext = createContext(null)
const STORAGE_KEY = "karanan-cart"

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function addToCart(productId, qty = 1) {
    const id = Number(productId)
    const amount = Math.max(1, Number(qty) || 1)
    setItems((current) => {
      const found = current.find((item) => Number(item.id) === id)
      if (found) {
        return current.map((item) =>
          Number(item.id) === id ? { ...item, qty: item.qty + amount, id } : item,
        )
      }
      return [...current, { id, qty: amount }]
    })
  }

  function removeFromCart(productId) {
    setItems((current) => current.filter((item) => item.id !== productId))
  }

  function updateQty(productId, qty) {
    if (qty < 1) {
      removeFromCart(productId)
      return
    }
    setItems((current) =>
      current.map((item) => (item.id === productId ? { ...item, qty } : item)),
    )
  }

  function clearCart() {
    setItems([])
  }

  const count = items.reduce((sum, item) => sum + item.qty, 0)

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQty, clearCart, count }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
