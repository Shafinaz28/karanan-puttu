import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { clearUser } from "./Login"
import { supabase } from "../lib/supabase"

export default function Account() {
  const [user, setUser] = useState(null)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadAccount() {
      if (!supabase) {
        setLoading(false)
        return
      }

      try {
        const { data, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError
        if (!data.session) {
          if (active) setUser(null)
          return
        }

        const authUser = data.session.user
        if (active) {
          setUser({
            email: authUser.email,
            full_name: authUser.user_metadata?.full_name || "",
          })
        }
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", authUser.id)
          .maybeSingle()
        if (profileError) throw profileError

        if (active) {
          setUser({
            email: authUser.email,
            full_name: profile?.full_name || authUser.user_metadata?.full_name || "",
          })
        }
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : "Unable to load your account.")
      } finally {
        if (active) setLoading(false)
      }
    }

    loadAccount()
    return () => {
      active = false
    }
  }, [])

  async function signOut() {
    setError("")
    setBusy(true)
    try {
      if (supabase) {
        const { error: signOutError } = await supabase.auth.signOut()
        if (signOutError) {
          setError(signOutError.message)
          return
        }
      }
      clearUser()
      setUser(null)
    } catch (signOutError) {
      setError(signOutError instanceof Error ? signOutError.message : "Unable to log out. Please try again.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center">
      <p className="text-[11px] tracking-[0.24em] text-secondary uppercase">The house</p>
      <h1 className="mt-3 font-display text-5xl text-primary">Account</h1>
      {loading ? (
        <p className="mt-6 text-sm leading-7 text-ink/80">Loading your account…</p>
      ) : user ? (
        <>
          <p className="mt-6 text-sm leading-7 text-ink/80">
            {user.full_name && <span className="block">Welcome, {user.full_name}.</span>}
            You are signed in as {user.email}.
          </p>
          {error && <p className="mt-4 text-sm text-primary">{error}</p>}
          <button
            type="button"
            onClick={signOut}
            disabled={busy}
            className="motion-btn motion-fill mt-8 inline-block bg-primary px-5 py-3 text-[11px] tracking-[0.16em] text-cream uppercase"
            style={{ borderRadius: 0 }}
          >
            {busy ? "Logging out…" : "Log out"}
          </button>
        </>
      ) : (
        <>
          <p className="mt-6 text-sm leading-7 text-ink/80">
            Login to keep a drape aside. This preview stays on your device.
          </p>
          <Link
            to="/login"
            className="motion-btn motion-fill mt-8 inline-block bg-primary px-5 py-3 text-[11px] tracking-[0.16em] text-cream uppercase"
            style={{ borderRadius: 0 }}
          >
            Login
          </Link>
        </>
      )}
    </section>
  )
}
