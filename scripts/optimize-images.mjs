// Generates web-sized copies of the property photos (the originals are 4608px camera files).
// Run after adding photos to public/property*/:  npm run images
import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'

const PUBLIC = path.resolve('public')
const OUT = path.join(PUBLIC, 'img')
const WIDTHS = [480, 1080, 1920]
const MANIFEST = path.resolve('src/lib/imageManifest.json')

const folders = (await fs.readdir(PUBLIC, { withFileTypes: true }))
  .filter((d) => d.isDirectory() && /^property/.test(d.name))
  .map((d) => d.name)

const manifest = []
let before = 0
let after = 0

for (const folder of folders) {
  const files = (await fs.readdir(path.join(PUBLIC, folder))).filter((f) => /\.(webp|jpe?g|png)$/i.test(f))
  await fs.mkdir(path.join(OUT, folder), { recursive: true })

  for (const file of files) {
    const src = path.join(PUBLIC, folder, file)
    const base = file.replace(/\.[^.]+$/, '')
    before += (await fs.stat(src)).size

    for (const width of WIDTHS) {
      const dest = path.join(OUT, folder, `${base}-${width}.webp`)
      await sharp(src)
        .rotate()
        .resize({ width, height: width, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: width === 480 ? 70 : 76 })
        .toFile(dest)
      if (width === 1920) after += (await fs.stat(dest)).size
    }
    manifest.push(`/${folder}/${file}`)
  }
}

await fs.writeFile(MANIFEST, JSON.stringify(manifest.sort(), null, 2) + '\n')
const mb = (n) => (n / 1024 / 1024).toFixed(1) + ' MB'
console.log(`${manifest.length} photos: originals ${mb(before)} -> 1920px set ${mb(after)}`)
