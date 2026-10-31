import fs from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const publicDir = path.resolve("public")

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...(await walk(full)))
    else files.push(full)
  }
  return files
}

const files = (await walk(publicDir)).filter((file) => /\.(jpe?g|png)$/i.test(file))

for (const file of files) {
  const out = file.replace(/\.(jpe?g|png)$/i, ".avif")
  try {
    const [srcStat, outStat] = await Promise.all([
      fs.stat(file),
      fs.stat(out).catch(() => null),
    ])
    if (outStat && outStat.mtimeMs >= srcStat.mtimeMs) {
      continue
    }
    await sharp(file)
      .rotate()
      .avif({ quality: 62, effort: 4 })
      .toFile(out)
    console.log(path.relative(publicDir, out))
  } catch (error) {
    console.error("Failed:", file, error.message)
  }
}
