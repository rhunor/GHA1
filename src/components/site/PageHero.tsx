"use client"
import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import RippleSurface from './RippleSurface'
import { MaskText, RippleMark } from './Reveal'
import { cn } from '@/lib/utils'

interface PageHeroProps {
  image: string
  eyebrow: string
  title: string
  subtitle?: string
  className?: string
  children?: React.ReactNode
}

/** Shorter version of the home hero for inner pages: same water, same voice */
export default function PageHero({ image, eyebrow, title, subtitle, className, children }: PageHeroProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 90])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={ref} className={cn('relative h-[68vh] min-h-[460px] md:h-[72vh]', className)}>
      <RippleSurface image={image} className="absolute inset-0">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/70" />
        <motion.div
          style={{ y, opacity }}
          className="pointer-events-none absolute inset-x-0 bottom-0 pb-14 md:pb-20"
        >
          <div className="container mx-auto px-4 text-white">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="eyebrow mb-5 flex items-center gap-3 !text-brass"
            >
              <RippleMark />
              {eyebrow}
            </motion.p>
            <MaskText
              as="h1"
              text={title}
              animateOnMount
              delay={0.25}
              className="display max-w-4xl text-5xl md:text-7xl"
            />
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="mt-5 max-w-xl text-base text-white/80 md:text-lg"
              >
                {subtitle}
              </motion.p>
            )}
            {children}
          </div>
        </motion.div>
      </RippleSurface>
    </section>
  )
}
