"use client"
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Bed, Bath, Maximize, MapPin, CreditCard, Home as HomeIcon } from 'lucide-react'
import { BsWhatsapp } from 'react-icons/bs'
import SiteHeader from '@/components/site/SiteHeader'
import SiteFooter from '@/components/site/SiteFooter'
import WhatsAppButton from '@/components/site/WhatsAppButton'
import RippleSurface, { RippleHandle } from '@/components/site/RippleSurface'
import IntroDrop from '@/components/site/IntroDrop'
import { Reveal, MaskText, ScrollFillText, ParallaxImage, Eyebrow } from '@/components/site/Reveal'
import { useProperties, propertyHref } from '@/hooks/useProperties'
import { whatsappLink } from '@/lib/site'
import { cn } from '@/lib/utils'
import { sized } from '@/lib/images'

// Rooms the hero "dips" between
const rooms = [
  { src: '/property1/3.webp', name: 'Ezrahaus', place: 'Lekki Phase 1' },
  { src: '/property2/4.webp', name: 'Meadowhaus', place: 'Ikate, Lekki' },
  { src: '/property1/1.webp', name: 'Ezrahaus', place: 'Lekki Phase 1' },
  { src: '/property2/1.webp', name: 'Meadowhaus', place: 'Ikate, Lekki' },
]

const ROOM_DURATION = 9000

const amenities = [
  '24/7 power', 'High-speed WiFi', 'Concierge', 'Hot water', 'Swimming pool', 'Smart home',
  'Secure parking', 'Housekeeping', 'Air conditioning', 'Treated water', 'Fully equipped kitchen',
]

const preload = (src: string) =>
  new Promise<void>((resolve) => {
    const img = new window.Image()
    img.onload = img.onerror = () => resolve()
    img.src = src
  })

function Hero() {
  const ripple = useRef<RippleHandle>(null)
  const sectionRef = useRef<HTMLElement>(null)
  // Picked after mount so server and client markup match
  const [start, setStart] = useState<number | null>(null)
  const [index, setIndex] = useState(0)
  const [dim, setDim] = useState(false)
  const [introDone, setIntroDone] = useState(false)
  const busy = useRef(false)
  const readyResolve = useRef<() => void>(() => {})
  const ready = useMemo(() => new Promise<void>((resolve) => (readyResolve.current = resolve)), [])

  useEffect(() => {
    const first = Math.floor(Math.random() * rooms.length)
    setStart(first)
    setIndex(first)
    preload(sized(rooms[first].src, 1920)).then(() => readyResolve.current())
  }, [])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 160])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const shade = useTransform(scrollYProgress, [0, 1], [0, 0.5])

  const goTo = useCallback(async (next: number) => {
    if (busy.current) return
    busy.current = true
    setDim(true)
    await new Promise((r) => setTimeout(r, 380))
    await ripple.current?.setImage(rooms[next].src)
    setIndex(next)
    ripple.current?.splash({ radius: 34, strength: 0.22 })
    setDim(false)
    busy.current = false
  }, [])

  // Auto-advance through the rooms after the intro
  useEffect(() => {
    if (!introDone) return
    const timer = setTimeout(() => goTo((index + 1) % rooms.length), ROOM_DURATION)
    return () => clearTimeout(timer)
  }, [index, introDone, goTo])

  // Warm the cache so room swaps are instant
  useEffect(() => {
    rooms.forEach((r) => preload(sized(r.src, 1920)))
  }, [])

  const onIntroDone = useCallback((played: boolean) => {
    setIntroDone(true)
    // The drop from the intro lands in the water
    setTimeout(() => ripple.current?.splash({ radius: played ? 38 : 26, strength: played ? 0.26 : 0.14 }), played ? 80 : 900)
  }, [])

  return (
    <>
      <IntroDrop ready={ready} onDone={onIntroDone} />
      <section ref={sectionRef} className="relative h-[100svh] min-h-[560px] bg-ink">
        {start !== null && (
        <RippleSurface ref={ripple} image={rooms[start].src} perturbance={0.02} rainIntensity={0.55} className="absolute inset-0">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/70" />
          <motion.div style={{ opacity: shade }} className="pointer-events-none absolute inset-0 bg-ink" />
          <div
            className={cn(
              'pointer-events-none absolute inset-0 bg-ink transition-opacity duration-500 ease-silk',
              dim ? 'opacity-50' : 'opacity-0'
            )}
          />

          <motion.div
            style={{ y: contentY, opacity: contentOpacity }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center px-4"
          >
            {introDone && (
              <div className="max-w-4xl text-center text-white">
                <motion.p
                  initial={{ opacity: 0, letterSpacing: '0.6em' }}
                  animate={{ opacity: 1, letterSpacing: '0.28em' }}
                  transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                  className="eyebrow mb-6 !text-brass"
                >
                  Shortlet apartments · Lagos
                </motion.p>
                <MaskText
                  as="h1"
                  text="Find the perfect short stay apartment"
                  animateOnMount
                  delay={0.15}
                  className="display text-[2.6rem] sm:text-6xl md:text-7xl lg:text-[5.5rem]"
                />
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="mx-auto mt-6 max-w-md text-lg text-white/80 md:text-xl"
                >
                  Luxury Apartments in Lekki
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="pointer-events-auto mt-10 flex flex-wrap items-center justify-center gap-3"
                >
                  <Link href="/properties" className="btn bg-cream px-7 py-3.5 text-ink hover:bg-white">
                    View Properties <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-glass px-7 py-3.5">
                    <BsWhatsapp className="h-4 w-4" /> Chat to book
                  </a>
                </motion.div>
              </div>
            )}
          </motion.div>

          {/* Room switcher */}
          {introDone && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 1 }}
              className="absolute inset-x-0 bottom-0 pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
            >
              <div className="container mx-auto flex items-end justify-between gap-6 px-4 text-white">
                <div className="pointer-events-none hidden md:block">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.5 }}
                    >
                      <p className="text-xs uppercase tracking-label text-white/60">Now showing</p>
                      <p className="mt-1 flex items-center gap-2 font-marcellus text-xl">
                        {rooms[index].name}
                        <span className="text-sm font-outfit text-white/60">· {rooms[index].place}</span>
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <p className="pointer-events-none hidden text-xs uppercase tracking-label text-white/50 lg:block">
                  Move across the water
                </p>

                <div className="flex w-full items-center justify-center gap-2 md:w-auto">
                  {rooms.map((room, i) => (
                    <button
                      key={room.src}
                      onClick={() => i !== index && goTo(i)}
                      aria-label={`Show ${room.name}, view ${i + 1}`}
                      aria-current={i === index}
                      className="group relative h-10 w-12 py-4"
                    >
                      <span className="block h-[2px] w-full overflow-hidden rounded-full bg-white/25">
                        {i === index && (
                          <motion.span
                            key={`${index}-progress`}
                            className="block h-full bg-white"
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: ROOM_DURATION / 1000, ease: 'linear' }}
                          />
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </RippleSurface>
        )}

        {/* Scroll cue */}
        <div aria-hidden className="pointer-events-none absolute bottom-24 left-1/2 hidden h-12 w-px -translate-x-1/2 overflow-hidden bg-white/20 md:block">
          <span className="block h-full w-full animate-drip bg-white" />
        </div>
      </section>
    </>
  )
}

function Philosophy() {
  return (
    <section className="relative py-28 md:py-40">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Eyebrow>Our philosophy</Eyebrow>
          </Reveal>
          <ScrollFillText
            text="Gifted Homes was birthed in 2024 on one belief: every stay should feel like a gift, to be enjoyed just like life itself."
            className="display mt-8 text-3xl leading-[1.2] md:text-5xl lg:text-6xl"
          />
          <Reveal className="mt-12 grid gap-8 md:grid-cols-2 md:gap-16" delay={0.1}>
            <p className="text-lg leading-relaxed text-muted">
              Our shortlets are curated for relaxation, comfort and convenience. Each apartment pairs high-end
              finishes with the practical things that make a stay effortless, from constant power to a concierge
              who picks up the phone.
            </p>
            <div className="flex items-end">
              <Link href="/about" className="group inline-flex items-center gap-3 text-fg">
                <span className="link-draw pb-1 text-lg">Our story</span>
                <span className="grid h-11 w-11 place-items-center rounded-full border border-line transition-all duration-300 group-hover:border-clay group-hover:bg-clay group-hover:text-on-clay">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Residences() {
  const { properties, loading } = useProperties()

  return (
    <section className="bg-linen py-28 md:py-36">
      <div className="container mx-auto px-4">
        <div className="mb-16 flex flex-col justify-between gap-6 md:mb-24 md:flex-row md:items-end">
          <div>
            <Reveal><Eyebrow>The residences</Eyebrow></Reveal>
            <MaskText text="Homes worth coming back to" className="display mt-6 max-w-2xl text-4xl md:text-6xl" />
          </div>
          <Reveal delay={0.2}>
            <Link href="/properties" className="btn-ghost">
              All properties <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        {loading ? (
          <div className="grid gap-8 md:grid-cols-2">
            {[0, 1].map((i) => (
              <div key={i} className="aspect-[4/5] animate-pulse rounded-3xl bg-fg/5" />
            ))}
          </div>
        ) : (
          <div className="space-y-28 md:space-y-40">
            {properties.slice(0, 4).map((property, i) => {
              const flip = i % 2 === 1
              return (
                <article key={property._id || property.id} className="grid items-center gap-10 md:grid-cols-12 md:gap-12">
                  <Link
                    href={propertyHref(property)}
                    className={cn('group block md:col-span-7', flip && 'md:order-2')}
                  >
                    <ParallaxImage
                      src={property.thumbnail}
                      sizes="(min-width: 768px) 58vw, 100vw"
                      alt={property.title}
                      className="aspect-[4/5] rounded-3xl md:aspect-[5/6]"
                    />
                  </Link>
                  <div className={cn('md:col-span-5', flip ? 'md:order-1 md:pr-8' : 'md:pl-8')}>
                    <Reveal>
                      <p className="font-marcellus text-6xl text-clay/30">{String(i + 1).padStart(2, '0')}</p>
                      <h3 className="display mt-4 text-[1.75rem] leading-tight md:text-4xl">{property.title}</h3>
                      <p className="mt-6 flex items-center gap-2 text-sm text-muted">
                        <MapPin className="h-4 w-4 text-clay" /> {property.location}
                      </p>
                      <dl className="mt-8 grid grid-cols-3 border-y border-line py-5 text-sm">
                        <div>
                          <dt className="flex items-center gap-1.5 text-muted"><Bed className="h-4 w-4" /> Beds</dt>
                          <dd className="mt-1 font-marcellus text-2xl">{property.specifications.bedrooms}</dd>
                        </div>
                        <div>
                          <dt className="flex items-center gap-1.5 text-muted"><Bath className="h-4 w-4" /> Baths</dt>
                          <dd className="mt-1 font-marcellus text-2xl">{property.specifications.bathrooms}</dd>
                        </div>
                        <div>
                          <dt className="flex items-center gap-1.5 text-muted"><Maximize className="h-4 w-4" /> Size</dt>
                          <dd className="mt-1 font-marcellus text-2xl">{property.specifications.size}</dd>
                        </div>
                      </dl>
                      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                        <p className="font-marcellus text-2xl">{property.price}</p>
                        <Link href={propertyHref(property)} className="btn-clay">
                          View residence <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </Reveal>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

function AmenityBand() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const left = useTransform(scrollYProgress, [0, 1], ['0%', '-30%'])
  const right = useTransform(scrollYProgress, [0, 1], ['-30%', '0%'])
  const row = [...amenities, ...amenities]

  const Row = ({ x, outline }: { x: typeof left; outline?: boolean }) => (
    <motion.div style={{ x }} className="flex w-max items-center gap-10 whitespace-nowrap">
      {row.map((item, i) => (
        <span key={i} className="flex items-center gap-10">
          <span
            className={cn(
              'display text-5xl md:text-7xl',
              outline ? 'text-transparent [-webkit-text-stroke:1px_rgb(var(--c-fg)/0.35)]' : 'text-fg'
            )}
          >
            {item}
          </span>
          <span className="h-2.5 w-2.5 rounded-full bg-clay" />
        </span>
      ))}
    </motion.div>
  )

  return (
    <section ref={ref} aria-label="Amenities" className="overflow-hidden py-24 md:py-32">
      <p className="sr-only">Amenities: {amenities.join(', ')}</p>
      <div aria-hidden className="space-y-6">
        <Row x={left} />
        <Row x={right} outline />
      </div>
    </section>
  )
}

function WaysToBook() {
  const ways = [
    {
      icon: BsWhatsapp,
      title: 'WhatsApp',
      body: 'The fastest way. Message our bookings team, ask anything and confirm your dates in minutes.',
      action: { label: 'Start a chat', href: whatsappLink(), external: true },
    },
    {
      icon: CreditCard,
      title: 'Pay online',
      body: 'Pick a residence, choose your dates and pay securely with Paystack. Your reference arrives instantly.',
      action: { label: 'Choose a residence', href: '/properties', external: false },
    },
    {
      icon: HomeIcon,
      title: 'Airbnb',
      body: 'Prefer the platform you know? Every residence is also listed on Airbnb.',
      action: { label: 'See listings', href: '/properties', external: false },
    },
  ]

  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl">
          <Reveal><Eyebrow>Booking</Eyebrow></Reveal>
          <MaskText text="Three easy ways to book" className="display mt-6 text-4xl md:text-6xl" />
        </div>
        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-3">
          {ways.map((way, i) => (
            <Reveal key={way.title} delay={i * 0.1} className="group relative bg-canvas p-8 transition-colors duration-500 hover:bg-paper md:p-10">
              <div className="flex items-center justify-between">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-clay/10 text-clay transition-transform duration-500 ease-silk group-hover:scale-110">
                  <way.icon className="h-6 w-6" />
                </span>
                <span className="font-marcellus text-lg text-muted">0{i + 1}</span>
              </div>
              <h3 className="display mt-10 text-3xl">{way.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{way.body}</p>
              {way.action.external ? (
                <a href={way.action.href} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-clay">
                  <span className="link-draw pb-0.5">{way.action.label}</span> <ArrowUpRight className="h-4 w-4" />
                </a>
              ) : (
                <Link href={way.action.href} className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-clay">
                  <span className="link-draw pb-0.5">{way.action.label}</span> <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function ClosingCta() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const ringScale = useTransform(scrollYProgress, [0, 1], [0.4, 1.1])

  return (
    <section ref={ref} className="relative overflow-hidden bg-ink py-32 text-cream md:py-44">
      <motion.div aria-hidden style={{ scale: ringScale }} className="pointer-events-none absolute left-1/2 top-1/2 h-[60rem] w-[60rem] -translate-x-1/2 -translate-y-1/2">
        {[1, 0.8, 0.6, 0.4, 0.2].map((s) => (
          <span key={s} className="absolute inset-0 rounded-full border border-brass/15" style={{ transform: `scale(${s})` }} />
        ))}
      </motion.div>
      <div className="container relative mx-auto px-4 text-center">
        <Reveal><p className="eyebrow !text-brass">Your stay</p></Reveal>
        <MaskText text="Your key is waiting" className="display mx-auto mt-6 max-w-3xl text-5xl md:text-7xl" />
        <Reveal delay={0.3} className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/properties" className="btn bg-cream px-7 py-3.5 text-ink hover:bg-white">
            View Properties <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/contactus" className="btn border border-white/25 px-7 py-3.5 text-cream hover:bg-white/10">
            Contact us
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader overlay />
      <main>
        <Hero />
        <Philosophy />
        <Residences />
        <AmenityBand />
        <WaysToBook />
        <ClosingCta />
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </div>
  )
}
