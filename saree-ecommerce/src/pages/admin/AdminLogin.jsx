import { useEffect, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { supabase, supabaseConfigured } from "../../lib/supabase"

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)
  const [hasSession, setHasSession] = useState(false)

  useEffect(() => {
    if (!supabase) {
      setSessionReady(true)
      return undefined
    }
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(Boolean(data.session))
      setSessionReady(true)
    })
    return undefined
  }, [])

  if (sessionReady && hasSession) {
    return <Navigate to="/admin" replace />
  }

  async function onSubmit(event) {
    event.preventDefault()
    setError("")
    if (!supabaseConfigured || !supabase) {
      setError("Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env, then restart the app.")
      return
    }
    setBusy(true)
    const { error: signError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    setBusy(false)
    if (signError) {
      setError(signError.message)
      return
    }
    navigate("/admin", { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6efe4] px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md border border-primary/15 bg-white p-8 shadow-sm"
      >
        <p className="text-[11px] tracking-[0.2em] text-[#8a6230] uppercase">Karnan Pattu Centre</p>
        <h1 className="mt-2 font-display text-4xl text-primary">Admin login</h1>
        <p className="mt-2 text-sm text-ink/60">Sign in with your Supabase admin user.</p>

        {!supabaseConfigured && (
          <p className="mt-4 rounded border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Supabase is not configured yet. Copy <code>.env.example</code> to <code>.env</code> and add your project keys.
          </p>
        )}

        <label className="mt-6 block text-xs tracking-wide text-ink/55 uppercase">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full border border-primary/20 px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </label>
        <label className="mt-4 block text-xs tracking-wide text-ink/55 uppercase">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full border border-primary/20 px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </label>

        {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full bg-primary py-3 text-[11px] tracking-[0.16em] text-cream uppercase disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>

        <Link to="/" className="mt-4 block text-center text-sm text-primary/70 hover:text-primary">
          ← Back to store
        </Link>
      </form>
    </div>
  )
}
