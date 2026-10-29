import { createHmac, randomUUID } from "node:crypto"
import { createServer } from "node:http"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY
const jwtSecret = process.env.JWT_SECRET
const port = Number.parseInt(process.env.PORT ?? "3001", 10)
const host = process.env.HOST ?? "127.0.0.1"
const tokenLifetimeSeconds = 15 * 60

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be configured.")
}
if (!jwtSecret || Buffer.byteLength(jwtSecret) < 32) {
  throw new Error("JWT_SECRET must be configured with at least 32 bytes.")
}
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535.")
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    detectSessionInUrl: false,
    persistSession: false,
  },
})

function respond(response, status, body, headers = {}) {
  response.writeHead(status, {
    "cache-control": "no-store",
    "content-type": "application/json; charset=utf-8",
    "x-content-type-options": "nosniff",
    ...headers,
  })
  response.end(JSON.stringify(body))
}

function signJwt(userId) {
  const issuedAt = Math.floor(Date.now() / 1000)
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url")
  const payload = Buffer.from(JSON.stringify({
    aud: "karanan-puttu-api",
    exp: issuedAt + tokenLifetimeSeconds,
    iat: issuedAt,
    iss: "karanan-puttu",
    jti: randomUUID(),
    sub: userId,
  })).toString("base64url")
  const unsignedToken = `${header}.${payload}`
  const signature = createHmac("sha256", jwtSecret).update(unsignedToken).digest("base64url")

  return `${unsignedToken}.${signature}`
}

const server = createServer(async (request, response) => {
  const path = request.url?.split("?")[0]
  if (path !== "/api/token") {
    respond(response, 404, { error: "Not found." })
    return
  }
  if (request.method !== "POST") {
    respond(response, 405, { error: "Method not allowed." }, { allow: "POST" })
    return
  }

  const authorization = request.headers.authorization
  const match = typeof authorization === "string"
    ? authorization.match(/^Bearer\s+([^\s]+)$/i)
    : null
  if (!match || match[1].length > 8192) {
    respond(response, 401, { error: "A valid Supabase bearer token is required." })
    return
  }

  try {
    const { data, error } = await supabase.auth.getUser(match[1])
    if (error || !data.user) {
      respond(response, 401, { error: "The Supabase session is invalid or expired." })
      return
    }

    respond(response, 200, {
      access_token: signJwt(data.user.id),
      expires_in: tokenLifetimeSeconds,
      token_type: "Bearer",
    })
  } catch (error) {
    console.error("JWT endpoint could not verify the Supabase session:", error)
    respond(response, 503, { error: "Unable to verify the Supabase session." })
  }
})

server.listen(port, host, () => {
  console.log(`JWT server listening at http://${host}:${port}`)
})
