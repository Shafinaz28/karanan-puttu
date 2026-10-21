import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom"
import Layout from "./components/Layout"
import { CartProvider } from "./context/CartContext"
import { ProductsProvider } from "./context/ProductsContext"
import About from "./pages/About"
import Account from "./pages/Account"
import Blog from "./pages/Blog"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import Contact from "./pages/Contact"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Locations from "./pages/Locations"
import OldSilk from "./pages/OldSilk"
import Privacy from "./pages/Privacy"
import ProductDetails from "./pages/ProductDetails"
import Shop from "./pages/Shop"
import Terms from "./pages/Terms"
import Track from "./pages/Track"
import Wishlist from "./pages/Wishlist"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminLogin from "./pages/admin/AdminLogin"

function AppRoutes() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith("/admin")

  return (
    <ProductsProvider>
      <CartProvider>
        {isAdmin ? (
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        ) : (
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
              <Route path="/track" element={<Track />} />
              <Route path="/old-silk" element={<OldSilk />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/login" element={<Login />} />
              <Route path="/account" element={<Account />} />
            </Routes>
          </Layout>
        )}
      </CartProvider>
    </ProductsProvider>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
