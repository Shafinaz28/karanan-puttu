import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { supabase, supabaseConfigured } from "../lib/supabase"

const storageKey = "karanan-user"
const legacyAdminKey = "karanan-admin"

function isAdmin(user) {
  return user?.app_metadata?.role === "admin"
}

function authErrorMessage(authError) {
  const message = authError instanceof Error ? authError.message : ""
  if (/email rate limit exceeded|rate limit.*email/i.test(message)) {
    return "Supabase has reached its email sending limit. Wait before trying again, or configure custom SMTP in Supabase Auth settings. Check Authentication → Users before retrying; the account may already have been created."
  }
  return message || "Unable to complete authentication. Please try again."
}

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
  window.localStorage.removeItem(legacyAdminKey)
}

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isSignUp, setIsSignUp] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (location.state?.signUp) setIsSignUp(true)
  }, [location.state?.signUp])

  async function submit(event) {
    event.preventDefault()
    const address = email.trim()
    const name = fullName.trim()
    if (!address || !password || (isSignUp && !name)) {
      setError(isSignUp ? "Enter your name, email, and password." : "Enter your email and password.")
      return
    }

    setError("")
    setMessage("")
    if (!supabaseConfigured || !supabase) {
      setError("Connect Supabase to create an account or sign in.")
      return
    }

    setBusy(true)
    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: address,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: new URL("/", window.location.origin).toString(),
          },
        })
        if (signUpError) {
          setError(authErrorMessage(signUpError))
          return
        }

        if (data.session && data.user) {
          if (isAdmin(data.user)) {
            window.localStorage.setItem(storageKey, JSON.stringify({
              email: data.user.email || address,
              full_name: name,
            }))
          }
        }

        navigate("/", {
          replace: true,
          state: {
            accountCreated: true,
            confirmationRequired: !data.session,
          },
        })
        return
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: address,
        password,
      })
      if (signInError) {
        setError(signInError.message)
        return
      }

      if (isAdmin(data.user)) {
        window.localStorage.setItem(storageKey, JSON.stringify({
          email: data.user.email || address,
          full_name: data.user.user_metadata?.full_name || "",
        }))
        navigate("/admin", { replace: true })
      } else {
        navigate("/", { replace: true })
      }
    } catch (authError) {
      setError(authErrorMessage(authError))
    } finally {
      setBusy(false)
    }
  }

  function changeMode() {
    setIsSignUp((current) => !current)
    setError("")
    setMessage("")
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <h1 className="mt-3 text-center font-display text-5xl text-primary">
        {isSignUp ? "Create account" : "Login"}
      </h1>
      <p className="mt-4 text-center text-sm leading-7 text-ink/70">
        {isSignUp ? "Create an account to keep a drape aside." : "Sign in to your account."}
      </p>
      <form onSubmit={submit} className="mt-8 border border-[#ead9bf] bg-white p-6">
        {isSignUp && (
          <>
            <label className="block text-[11px] tracking-[0.16em] text-ink/50 uppercase" htmlFor="signup-name">
              Full name
            </label>
            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Your name"
              className="mt-2 w-full border border-primary/15 bg-transparent px-3 py-3 text-sm outline-none"
            />
          </>
        )}
        <label className={`${isSignUp ? "mt-5 " : ""}block text-[11px] tracking-[0.16em] text-ink/50 uppercase`} htmlFor="login-email">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          required
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
          autoComplete={isSignUp ? "new-password" : "current-password"}
          minLength={isSignUp ? 8 : undefined}
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder={isSignUp ? "At least 8 characters" : "Password"}
          className="mt-2 w-full border border-primary/15 bg-transparent px-3 py-3 text-sm outline-none"
        />
        {error && <p className="mt-3 text-sm text-primary">{error}</p>}
        {message && <p className="mt-3 text-sm text-ink/70">{message}</p>}
        <button
          type="submit"
          disabled={busy}
          className="motion-btn motion-fill mt-6 w-full bg-primary px-6 py-3 text-[11px] tracking-[0.16em] text-cream uppercase disabled:opacity-60"
          style={{ borderRadius: 0 }}
        >
          {busy ? "Please wait…" : isSignUp ? "Create account" : "Login"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-ink/70">
        {isSignUp ? "Already have an account? " : "New customer? "}
        <button type="button" onClick={changeMode} className="text-primary underline">
          {isSignUp ? "Sign in" : "Create an account"}
        </button>
      </p>
    </section>
  )
}
