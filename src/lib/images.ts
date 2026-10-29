// lib/images.ts
// Picks a web-sized version of a property photo instead of the full camera original.
import manifest from './imageManifest.json'

export type ImageWidth = 480 | 1080 | 1920

// Local photos that have resized copies in public/img (see scripts/optimize-images.mjs)
const resized = new Set<string>(manifest)

export function sized(src: string, width: ImageWidth): string {
  if (!src) return src
  if (resized.has(src)) {
    return src.replace(/^\/(.+)\.[^.]+$/, `/img/$1-${width}.webp`)
  }
  // Photos uploaded through the admin live on Cloudinary, which resizes on the fly
  if (src.includes('res.cloudinary.com') && src.includes('/upload/')) {
    return src.replace('/upload/', `/upload/f_auto,q_auto,c_limit,w_${width}/`)
  }
  return src
}

/** srcSet so phones download the small copy and large screens the big one */
export function srcSetFor(src: string): string | undefined {
  const small = sized(src, 480)
  if (small === src) return undefined
  return `${small} 480w, ${sized(src, 1080)} 1080w, ${sized(src, 1920)} 1920w`
}
