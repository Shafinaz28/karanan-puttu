import fs from "node:fs"
import path from "node:path"

const transcript =
  "C:/Users/Admin/.cursor/projects/c-Users-Admin-OneDrive-Desktop-Karanan-Puttu/agent-transcripts/4b184383-324a-41e3-8e74-92227d75c5b8/4b184383-324a-41e3-8e74-92227d75c5b8.jsonl"

let lastShop = null
let lastProducts = null

for (const line of fs.readFileSync(transcript, "utf8").split("\n")) {
  if (!line.includes("tool_use")) continue
  let obj
  try {
    obj = JSON.parse(line)
  } catch {
    continue
  }
  for (const part of obj.message?.content || []) {
    if (part.type !== "tool_use") continue
    const p = part.input?.path?.replace(/\\/g, "/").toLowerCase() || ""
    if (part.name === "Write" && p.endsWith("src/pages/shop.jsx")) {
      lastShop = part.input.contents
    }
    if (part.name === "Write" && p.endsWith("src/data/products.js")) {
      lastProducts = part.input.contents
    }
  }
}

const root = path.resolve(".")
if (lastShop) {
  fs.writeFileSync(path.join(root, "src/pages/Shop.jsx"), lastShop)
  console.log("Shop.jsx", lastShop.length)
}
if (lastProducts) {
  fs.writeFileSync(path.join(root, "src/data/products.js"), lastProducts)
  console.log("products.js", lastProducts.length)
}
