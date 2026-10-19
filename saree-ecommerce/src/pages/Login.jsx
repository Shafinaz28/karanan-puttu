import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const storageKey = "karanan-user"

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
}

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  function signIn(event) {
    event.preventDefault()
    const address = email.trim()
    if (!address || !password.trim()) {
      setError("Enter your email and password.")
      return
    }
    window.localStorage.setItem(storageKey, JSON.stringify({ email: address }))
    navigate("/account")
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <p className="text-center text-[11px] tracking-[0.24em] text-secondary uppercase">The house</p>
      <h1 className="mt-3 text-center font-display text-5xl text-primary">Login</h1>
      <p className="mt-4 text-center text-sm leading-7 text-ink/70">
        This preview keeps your sign-in on this device only. It is not sent to the showroom.
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
          className="motion-btn motion-fill mt-6 w-full bg-primary px-6 py-3 text-[11px] tracking-[0.16em] text-cream uppercase"
          style={{ borderRadius: 0 }}
        >
          Login
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-ink/70">
        New here?{" "}
        <Link to="/account" className="text-primary underline">
          Open your account
        </Link>
      </p>
    </section>
  )
}
