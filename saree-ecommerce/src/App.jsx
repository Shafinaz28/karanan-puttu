import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import { CartProvider } from "./context/CartContext"
import About from "./pages/About"
import Account from "./pages/Account"
import Blog from "./pages/Blog"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import Contact from "./pages/Contact"
import Home from "./pages/Home"
import Locations from "./pages/Locations"
import ProductDetails from "./pages/ProductDetails"
import Shop from "./pages/Shop"
import Wishlist from "./pages/Wishlist"

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </Layout>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
