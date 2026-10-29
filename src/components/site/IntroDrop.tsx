"use client"
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

/**
 * First-visit intro: a single drop falls into still water, rings spread and the logo surfaces.
 * When it lifts away the hero receives the same drop as a real WebGL splash (see onDone).
 */
export default function IntroDrop({ ready, onDone }: { ready: Promise<unknown>; onDone: (played: boolean) => void }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (document.documentElement.dataset.intro === 'seen') {
      setVisible(false)
      onDone(false)
      return
    }
    try {
      sessionStorage.setItem('gh-intro', '1')
    } catch {}

    const minimum = new Promise((r) => setTimeout(r, 2100))
    const cap = new Promise((r) => setTimeout(r, 4000))
    let cancelled = false
    Promise.race([Promise.all([minimum, ready]), cap]).then(() => {
      if (!cancelled) setVisible(false)
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AnimatePresence onExitComplete={() => onDone(true)}>
      {visible && (
        <motion.div
          key="intro"
          className="intro-loader fixed inset-0 z-[60] grid place-items-center bg-ink"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="relative flex h-64 w-64 items-center justify-center">
            {/* falling drop */}
            <motion.svg
              viewBox="0 0 20 28"
              className="absolute h-7 w-5 text-cream"
              initial={{ y: '-45vh', scaleY: 1.2, opacity: 0 }}
              animate={{ y: [null, 0, 0], scaleY: [1.2, 1, 0.2], opacity: [0, 1, 0] }}
              transition={{ duration: 0.95, times: [0, 0.8, 1], ease: 'easeIn' }}
            >
              <path fill="currentColor" d="M10 0C10 0 0 12.5 0 18a10 10 0 0 0 20 0C20 12.5 10 0 10 0Z" />
            </motion.svg>

            {/* rings on impact */}
            {[0, 0.18, 0.36].map((delay) => (
              <motion.span
                key={delay}
                className="absolute h-64 w-64 rounded-full border border-brass/60"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1], opacity: [0.9, 0] }}
                transition={{ delay: 0.85 + delay, duration: 1.6, ease }}
              />
            ))}

            {/* logo surfaces */}
            <motion.div
              initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 1.05, duration: 0.9, ease }}
            >
              <Image
                src="/logo-mark.png"
                alt=""
                width={720}
                height={480}
                priority
                className="h-20 w-auto brightness-0 invert"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
