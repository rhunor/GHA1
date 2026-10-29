"use client"
import React, { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'
import { cn } from '@/lib/utils'
import { sized, srcSetFor } from '@/lib/images'

const ease = [0.22, 1, 0.36, 1] as const

interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
  as?: 'div' | 'section' | 'li' | 'article'
}

/** Fades and lifts content in the first time it scrolls into view */
export function Reveal({ children, className, delay = 0, y = 28, as = 'div' }: RevealProps) {
  const Component = motion[as]
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </Component>
  )
}

/** Heading whose words rise out of a mask one after another */
export function MaskText({
  text,
  className,
  delay = 0,
  as = 'h2',
  animateOnMount = false,
}: {
  text: string
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'p'
  animateOnMount?: boolean
}) {
  const Component = motion[as]
  const words = text.split(' ')
  const trigger = animateOnMount
    ? { initial: 'hidden', animate: 'show' }
    : { initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '0px 0px -10% 0px' } }

  return (
    <Component className={className} aria-label={text} {...trigger}>
      {words.map((word, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: '110%' },
              show: { y: 0, transition: { duration: 0.9, delay: delay + i * 0.06, ease } },
            }}
          >
            {word}
            {i < words.length - 1 && ' '}
          </motion.span>
        </span>
      ))}
    </Component>
  )
}

function ScrollWord({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return (
    <motion.span style={{ opacity }} className="inline">
      {word}{' '}
    </motion.span>
  )
}

/** Paragraph that "fills in" word by word as you scroll through it */
export function ScrollFillText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = text.split(' ')

  return (
    <p ref={ref} className={cn(className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, i) => (
          <ScrollWord
            key={i}
            word={word}
            progress={scrollYProgress}
            range={[i / words.length, (i + 1) / words.length]}
          />
        ))}
      </span>
    </p>
  )
}

/** Image that is unveiled by a curtain and drifts slightly with scroll */
export function ParallaxImage({
  src,
  alt,
  className,
  strength = 60,
  priority,
  sizes = '(min-width: 768px) 50vw, 100vw',
}: {
  src: string
  alt: string
  className?: string
  strength?: number
  priority?: boolean
  sizes?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength])

  return (
    <motion.div
      ref={ref}
      className={cn('relative overflow-hidden', className)}
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.3, ease }}
    >
      <motion.img
        src={sized(src, 1080)}
        srcSet={srcSetFor(src)}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        style={{ y, scale: 1.18 }}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </motion.div>
  )
}

/** Small concentric rings: the site's water-drop motif, used beside section labels */
export function RippleMark({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn('relative inline-grid h-3 w-3 place-items-center', className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      <span className="absolute inset-0 animate-ring-out rounded-full border border-current" />
      <span className="absolute inset-0 animate-ring-out rounded-full border border-current [animation-delay:1.2s]" />
    </span>
  )
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('eyebrow flex items-center gap-3', className)}>
      <RippleMark />
      {children}
    </p>
  )
}
