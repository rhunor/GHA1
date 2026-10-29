"use client"
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import type WaterWaveComponent from 'react-water-wave'
import type { WaterWaveControls } from 'react-water-wave'
import { cn } from '@/lib/utils'
import { sized } from '@/lib/images'

type WaterWaveType = typeof WaterWaveComponent

export interface RippleHandle {
  /** Drop a splash. Coordinates are 0-1 fractions of the surface; defaults to the centre. */
  splash: (opts?: { x?: number; y?: number; radius?: number; strength?: number }) => void
  /** Swap the photo under the water (preloads first so the swap is seamless). */
  setImage: (url: string) => Promise<void>
}

interface RippleSurfaceProps {
  image: string
  className?: string
  children?: React.ReactNode
  /** Soft random drops so the surface is alive without a mouse (phones especially). */
  ambient?: boolean
  dropRadius?: number
  perturbance?: number
  /** Scales the ambient rain (size, strength and frequency); 1 is the default */
  rainIntensity?: number
}

let supportCache: boolean | null = null

// Mirrors the checks jquery.ripples does internally. The plugin throws if they fail,
// so we only mount it when the GPU can render to a floating point texture.
function supportsRipples(): boolean {
  if (supportCache !== null) return supportCache
  if (typeof window === 'undefined') return false

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // Older Android GPUs report support but render the effect with artefacts
  const android = /android/i.test(navigator.userAgent)
  if (reduceMotion || android) return (supportCache = false)

  try {
    const canvas = document.createElement('canvas')
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
    if (!gl) return (supportCache = false)

    const float = gl.getExtension('OES_texture_float')
    if (!float) return (supportCache = false)
    const half = gl.getExtension('OES_texture_half_float')

    const types = [gl.FLOAT, half?.HALF_FLOAT_OES].filter(Boolean) as number[]
    const texture = gl.createTexture()
    const framebuffer = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

    let ok = false
    for (const type of types) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 32, 32, 0, gl.RGBA, type, null)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) {
        ok = true
        break
      }
    }
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return (supportCache = ok)
  } catch {
    return (supportCache = false)
  }
}

const preload = (url: string) =>
  new Promise<void>((resolve) => {
    const img = new window.Image()
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = url
  })

const RippleSurface = forwardRef<RippleHandle, RippleSurfaceProps>(function RippleSurface(
  { image, className, children, ambient = true, dropRadius = 20, perturbance = 0.03, rainIntensity = 1 },
  ref
) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const controlsRef = useRef<WaterWaveControls | null>(null)
  const visibleRef = useRef(true)
  const [supported, setSupported] = useState<boolean | null>(null)
  // Loaded by hand (not next/dynamic) so the photo and content stay painted while it loads
  const [WaterWave, setWaterWave] = useState<WaterWaveType | null>(null)
  // The plugin is re-created whenever imageUrl changes, so keep the first one and swap with set().
  // 1920px copies: sharp enough full-screen, and small enough for phone GPUs to use as a texture.
  const [initialImage] = useState(() => sized(image, 1920))
  const [fallbackImage, setFallbackImage] = useState(initialImage)
  const [resolution, setResolution] = useState(512)

  useEffect(() => {
    const ok = supportsRipples()
    setSupported(ok)
    setResolution(window.innerWidth < 768 ? 256 : 512)
    if (!ok) return
    let cancelled = false
    import('react-water-wave')
      .then((mod) => {
        if (!cancelled) setWaterWave(() => mod.default)
      })
      .catch(() => setSupported(false))
    return () => {
      cancelled = true
    }
  }, [])

  const size = () => {
    const el = wrapperRef.current
    return el ? { w: el.clientWidth, h: el.clientHeight } : { w: 0, h: 0 }
  }

  useImperativeHandle(ref, () => ({
    splash: ({ x = 0.5, y = 0.5, radius = 36, strength = 0.32 } = {}) => {
      const { w, h } = size()
      if (!controlsRef.current || !w) return
      controlsRef.current.drop({ x: x * w, y: y * h, radius, strength })
    },
    setImage: async (original: string) => {
      const url = sized(original, 1920)
      await preload(url)
      setFallbackImage(url)
      controlsRef.current?.set({ property: 'imageUrl', value: url })
    },
  }))

  // Stop rendering when the surface scrolls out of view or the tab is hidden
  useEffect(() => {
    if (!WaterWave) return
    const el = wrapperRef.current
    if (!el) return

    const sync = () => {
      const c = controlsRef.current
      if (!c) return
      if (visibleRef.current && !document.hidden) c.show()
      else c.hide()
    }

    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting
      sync()
    })
    observer.observe(el)
    document.addEventListener('visibilitychange', sync)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [supported, WaterWave])

  // Ambient rain
  useEffect(() => {
    if (!WaterWave || !ambient) return
    let timer: ReturnType<typeof setTimeout>
    const rain = () => {
      const { w, h } = size()
      if (controlsRef.current && visibleRef.current && !document.hidden && w) {
        controlsRef.current.drop({
          x: Math.random() * w,
          y: Math.random() * h,
          radius: (8 + Math.random() * 10) * Math.max(rainIntensity, 0.5),
          strength: (0.03 + Math.random() * 0.04) * rainIntensity,
        })
      }
      timer = setTimeout(rain, (1400 + Math.random() * 2200) / rainIntensity)
    }
    timer = setTimeout(rain, 1800)
    return () => clearTimeout(timer)
  }, [WaterWave, ambient, rainIntensity])

  return (
    <div ref={wrapperRef} className={cn('relative overflow-hidden bg-ink', className)}>
      {/* Static photo: shown while WebGL loads, when it's unsupported, and when the canvas is paused */}
      <div
        aria-hidden
        className={cn('absolute inset-0 bg-cover bg-center', !supported && 'animate-slow-zoom')}
        style={{ backgroundImage: `url(${fallbackImage})` }}
      />
      {supported && WaterWave ? (
        <WaterWave
          imageUrl={initialImage}
          dropRadius={dropRadius}
          perturbance={perturbance}
          resolution={resolution}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {(controls) => {
            controlsRef.current = controls
            return children
          }}
        </WaterWave>
      ) : (
        children
      )}
    </div>
  )
})

export default RippleSurface
