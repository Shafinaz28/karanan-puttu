import sharp from "sharp"
import { readFileSync, writeFileSync } from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const assets = path.join(
  process.env.USERPROFILE ?? "",
  ".cursor",
  "projects",
  "c-Users-Admin-OneDrive-Desktop-Karanan-Puttu",
  "assets",
)

const jobs = [
  {
    input: path.join(assets, "Banner_1-270d76da-7e43-4f37-a4b5-5e9ab281b8ad.png"),
    avif: path.join(root, "public/hero/banner-1.avif"),
    webp: path.join(root, "public/hero/banner-1.webp"),
  },
  {
    input: path.join(assets, "Banner_2-3d179ada-3070-40e8-9dde-65213b31a81b.png"),
    avif: path.join(root, "public/hero/banner-2.avif"),
    webp: path.join(root, "public/hero/banner-2.webp"),
  },
  {
    input: path.join(assets, "banner3-805be0c9-13e3-4435-8dbb-7043c259a107.png"),
    avif: path.join(root, "public/hero/banner-3.avif"),
    webp: path.join(root, "public/hero/banner-3.webp"),
  },
]

const sizes = []

for (const job of jobs) {
  const pipeline = sharp(job.input).rotate().resize({ width: 1920, withoutEnlargement: true })

  await pipeline.clone().avif({ quality: 68, effort: 4 }).toFile(job.avif)
  await pipeline.clone().webp({ quality: 82 }).toFile(job.webp)

  const meta = await sharp(job.avif).metadata()
  const avifBytes = readFileSync(job.avif).length
  const webpBytes = readFileSync(job.webp).length
  sizes.push({
    name: path.basename(job.avif, ".avif"),
    width: meta.width,
    height: meta.height,
    avifKb: Math.round(avifBytes / 1024),
    webpKb: Math.round(webpBytes / 1024),
  })
}

writeFileSync(path.join(root, "public/hero/banner-sizes.json"), JSON.stringify(sizes, null, 2))
console.log(JSON.stringify(sizes, null, 2))
