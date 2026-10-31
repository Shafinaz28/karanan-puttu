import fs from "node:fs"
import path from "node:path"

const transcript =
  "C:/Users/Admin/.cursor/projects/c-Users-Admin-OneDrive-Desktop-Karanan-Puttu/agent-transcripts/4b184383-324a-41e3-8e74-92227d75c5b8/4b184383-324a-41e3-8e74-92227d75c5b8.jsonl"
const root = path.resolve(".")

const want = new Set([
  "src/pages/home.jsx",
  "src/pages/shop.jsx",
  "src/app.jsx",
  "src/components/layout.jsx",
  "src/main.jsx",
  "index.html",
  "src/data/products.js",
  "src/lib/productmap.js",
  "src/pages/productdetails.jsx",
  "src/index.css",
  "src/components/navbar.jsx",
  "src/pages/about.jsx",
  "src/pages/oldsilk.jsx",
])

const latest = new Map()

for (const line of fs.readFileSync(transcript, "utf8").split("\n")) {
  if (!line.includes('"Write"')) continue
  let obj
  try {
    obj = JSON.parse(line)
  } catch {
    continue
  }
  for (const part of obj.message?.content || []) {
    if (part.type !== "tool_use" || part.name !== "Write") continue
    const filePath = part.input?.path
    const contents = part.input?.contents
    if (!filePath || typeof contents !== "string") continue
    const rel = filePath.replace(/\\/g, "/").split("saree-ecommerce/").pop()?.toLowerCase()
    if (!rel || !want.has(rel)) continue
    latest.set(rel, contents)
  }
}

for (const [rel, contents] of latest) {
  const out = path.join(root, rel.replace(/\//g, path.sep))
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, contents)
  console.log("wrote", rel, contents.length)
}

if (!latest.size) console.log("nothing extracted")
