import { useState } from "react"
import { Link } from "react-router-dom"
import { clearUser, readUser } from "./Login"

export default function Account() {
  const [user, setUser] = useState(() => readUser())

  function signOut() {
    clearUser()
    setUser(null)
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center">
      <p className="text-[11px] tracking-[0.24em] text-secondary uppercase">The house</p>
      <h1 className="mt-3 font-display text-5xl text-primary">Account</h1>
      {user ? (
        <>
          <p className="mt-6 text-sm leading-7 text-ink/80">You are signed in as {user.email}.</p>
          <button
            type="button"
            onClick={signOut}
            className="motion-btn motion-fill mt-8 inline-block bg-primary px-5 py-3 text-[11px] tracking-[0.16em] text-cream uppercase"
            style={{ borderRadius: 0 }}
          >
            Log out
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
