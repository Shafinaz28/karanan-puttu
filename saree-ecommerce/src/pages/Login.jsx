import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase, supabaseConfigured } from "../lib/supabase"

const storageKey = "karanan-user"
const adminKey = "karanan-admin"

export function readUser() {
  try {
    const saved = window.localStorage.getItem(storageKey)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

export function clearUser() {
  window.localStorage.removeItem(storageKey)
  window.localStorage.removeItem(adminKey)
}

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  async function signIn(event) {
    event.preventDefault()
    const address = email.trim()
    if (!address || !password.trim()) {
      setError("Enter your email and password.")
      return
    }

    setBusy(true)
    setError("")

    if (supabaseConfigured && supabase) {
      const { error: signError } = await supabase.auth.signInWithPassword({
        email: address,
        password,
      })
      if (signError) {
        setBusy(false)
        setError(signError.message)
        return
      }
    }

    window.localStorage.setItem(storageKey, JSON.stringify({ email: address }))
    window.localStorage.setItem(adminKey, "1")
    setBusy(false)
    navigate("/admin", { replace: true })
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <p className="text-center text-[11px] tracking-[0.24em] text-secondary uppercase">The house</p>
      <h1 className="mt-3 text-center font-display text-5xl text-primary">Login</h1>
      <p className="mt-4 text-center text-sm leading-7 text-ink/70">
        Sign in to open the admin panel and manage sarees.
      </p>
      <form onSubmit={signIn} className="mt-8 border border-[#ead9bf] bg-white p-6">
        <label className="block text-[11px] tracking-[0.16em] text-ink/50 uppercase" htmlFor="login-email">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@email.com"
          className="mt-2 w-full border border-primary/15 bg-transparent px-3 py-3 text-sm outline-none"
        />
        <label className="mt-5 block text-[11px] tracking-[0.16em] text-ink/50 uppercase" htmlFor="login-password">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          className="mt-2 w-full border border-primary/15 bg-transparent px-3 py-3 text-sm outline-none"
        />
        {error && <p className="mt-3 text-sm text-primary">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="motion-btn motion-fill mt-6 w-full bg-primary px-6 py-3 text-[11px] tracking-[0.16em] text-cream uppercase disabled:opacity-60"
          style={{ borderRadius: 0 }}
        >
          {busy ? "Signing in…" : "Login"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-ink/70">
        Admin only?{" "}
        <Link to="/admin/login" className="text-primary underline">
          Admin login
        </Link>
      </p>
    </section>
  )
}
