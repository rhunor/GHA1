"use client"
import React from 'react'
import Link from 'next/link'
import { Home, Clock, Wifi, Zap, Wind, Droplets, UtensilsCrossed, Sparkles, ArrowRight } from 'lucide-react'
import { BsWhatsapp } from 'react-icons/bs'
import SiteHeader from '@/components/site/SiteHeader'
import SiteFooter from '@/components/site/SiteFooter'
import WhatsAppButton from '@/components/site/WhatsAppButton'
import PageHero from '@/components/site/PageHero'
import { Reveal, MaskText, ParallaxImage, Eyebrow } from '@/components/site/Reveal'
import { whatsappLink } from '@/lib/site'

interface ServiceCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon: Icon, title, description }) => (
  <div className="group h-full bg-canvas p-7 transition-colors duration-500 hover:bg-paper md:p-8">
    <span className="grid h-12 w-12 place-items-center rounded-full border border-line text-clay transition-all duration-500 ease-silk group-hover:border-clay group-hover:bg-clay group-hover:text-on-clay">
      <Icon className="h-5 w-5" />
    </span>
    <h3 className="mt-8 font-marcellus text-xl">{title}</h3>
    <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
  </div>
)

const services = [
  {
    icon: Home,
    title: "Luxury Accommodation",
    description: "Fully furnished apartments designed for comfort and style."
  },
  {
    icon: Wifi,
    title: "High-Speed WiFi",
    description: "Stay connected with fast and reliable internet access."
  },
  {
    icon: Zap,
    title: "24/7 Power Supply",
    description: "Uninterrupted power supply for your convenience."
  },
  {
    icon: Wind,
    title: "Air Conditioning",
    description: "Climate-controlled environments in all rooms."
  },
  {
    icon: Droplets,
    title: "Hot Water",
    description: "Constant hot water supply in all bathrooms."
  },
  {
    icon: UtensilsCrossed,
    title: "Furnished Kitchen",
    description: "Fully equipped kitchen for all your cooking needs."
  },
  {
    icon: Sparkles,
    title: "Housekeeping",
    description: "Regular cleaning and maintenance services."
  },
  {
    icon: Clock,
    title: "Flexible Stays",
    description: "Accommodating both short and long-term stays."
  }
]

const facts = [
  { value: '2024', label: 'Founded' },
  { value: '24/7', label: 'Power & concierge' },
  { value: 'Lekki', label: 'Phase 1 & Ikate' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader overlay />

      <main>
        <PageHero
          image="/property1/3.webp"
          eyebrow="About us"
          title="Every stay should feel like a gift"
          subtitle="Short and long stay apartments for guests who want a true home away from home."
        />

        {/* Story */}
        <section className="py-24 md:py-36">
          <div className="container mx-auto grid gap-14 px-4 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-5">
              <div className="md:sticky md:top-32">
                <Reveal><Eyebrow>Our story</Eyebrow></Reveal>
                <MaskText text="Born in 2024, built on comfort" className="display mt-6 text-4xl md:text-5xl" />
                <ParallaxImage
                  src="/property2/4.webp"
                  alt="Living room in Meadowhaus"
                  className="mt-10 aspect-[4/5] rounded-3xl"
                  strength={40}
                />
              </div>
            </div>

            <div className="space-y-8 text-lg leading-relaxed text-muted md:col-span-6 md:col-start-7 md:pt-24">
              <Reveal>
                <p className="display text-2xl leading-snug text-fg md:text-3xl">
                  Gifted homes and apartments was birthed in 2024. We believe that every stay should
                  feel like a gift to be enjoyed just like life itself.
                </p>
              </Reveal>
              <Reveal>
                <p>
                  Our carefully curated shortlets are designed to offer more than just a place to
                  stay—they provide an experience of relaxation, comfort, and convenience that promotes
                  wellness. Each apartment is tailored for those who appreciate high-end living,
                  combining luxury with functionality to ensure every guest feels at home.
                </p>
              </Reveal>
              <Reveal>
                <p>
                  We provide luxurious and comfortable short and long stay apartments for guests seeking
                  a home away from home experience. Our apartments are fully furnished for the most
                  comfortable stay featuring modern amenities and exceptional service.
                </p>
              </Reveal>

              <Reveal>
                <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-line pt-8">
                  {facts.map((fact) => (
                    <div key={fact.label} className="flex flex-col">
                      <dt className="order-2 mt-1 text-xs uppercase tracking-[0.16em] text-muted">{fact.label}</dt>
                      <dd className="font-marcellus text-3xl text-fg md:text-4xl">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="bg-linen py-24 md:py-32">
          <div className="container mx-auto px-4">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <Reveal><Eyebrow>Our services</Eyebrow></Reveal>
                <MaskText text="Everything, already taken care of" className="display mt-6 max-w-2xl text-4xl md:text-6xl" />
              </div>
              <Reveal delay={0.2}>
                <p className="max-w-sm text-muted">Every residence comes with the same standard, so all that is left for you is to arrive.</p>
              </Reveal>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service, index) => (
                <Reveal key={service.title} delay={(index % 4) * 0.08} y={20}>
                  <ServiceCard {...service} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Homeowners */}
        <section className="py-24 md:py-32">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-16 text-cream md:px-16 md:py-24">
              <div aria-hidden className="pointer-events-none absolute -bottom-48 -right-48 h-[36rem] w-[36rem]">
                {[1, 0.75, 0.5, 0.25].map((s) => (
                  <span key={s} className="absolute inset-0 rounded-full border border-brass/15" style={{ transform: `scale(${s})` }} />
                ))}
              </div>
              <div className="relative grid gap-10 md:grid-cols-2 md:items-end">
                <div>
                  <p className="eyebrow !text-brass">For homeowners</p>
                  <MaskText text="We keep your property livable, luxurious and profitable" className="display mt-6 text-4xl md:text-5xl" />
                </div>
                <Reveal>
                  <p className="text-lg leading-relaxed text-cream/75">
                    We also help homeowners preserve the value of their properties through expert
                    shortlet management, ensuring that every space remains not only livable and luxurious
                    but also profitable. Our focus is on maintaining quality, both for our guests and for
                    those who entrust us with their properties.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href={whatsappLink('Good day, I would like to talk about shortlet management for my property.')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn bg-cream text-ink hover:bg-white"
                    >
                      <BsWhatsapp className="h-4 w-4" /> Talk to us
                    </a>
                    <Link href="/contactus" className="btn border border-white/25 text-cream hover:bg-white/10">
                      Contact details <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <WhatsAppButton />
    </div>
  )
}
