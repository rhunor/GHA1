"use client"

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Phone, Clock, Mail, Plus, ArrowUpRight } from 'lucide-react'
import { BsWhatsapp } from 'react-icons/bs'
import { AiFillTikTok } from "react-icons/ai"
import { Instagram } from 'lucide-react'
import SiteHeader from '@/components/site/SiteHeader'
import SiteFooter from '@/components/site/SiteFooter'
import WhatsAppButton from '@/components/site/WhatsAppButton'
import PageHero from '@/components/site/PageHero'
import { Reveal, Eyebrow, MaskText } from '@/components/site/Reveal'
import { officeHours, site, whatsappLink } from '@/lib/site'
import { cn } from '@/lib/utils'

const faqs = [
  {
    q: 'What is your check-in and check-out time?',
    a: 'Standard check-in time is 3:00 PM and check-out time is 11:00 AM. Early check-in or late check-out may be available upon request, subject to availability.',
  },
  {
    q: 'Do you offer airport transfers?',
    a: 'Yes, we can arrange airport transfers for our guests. Please contact our concierge at least 24 hours before your arrival to make arrangements.',
  },
  {
    q: 'Is there a security deposit required?',
    a: 'Yes, we require a refundable security deposit which varies depending on the property. The deposit is returned within 7 days after check-out, provided there are no damages.',
  },
  {
    q: 'Do you offer long-term stays?',
    a: 'Yes, we offer discounted rates for long-term stays. Please contact our booking team for special rates on stays longer than 30 days.',
  },
]

// Whether the office is open right now, in Lagos time
function useOfficeStatus() {
  const [open, setOpen] = useState<boolean | null>(null)
  useEffect(() => {
    const check = () => {
      const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Africa/Lagos',
        weekday: 'short',
        hour: 'numeric',
        hour12: false,
      }).formatToParts(new Date())
      const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.find((p) => p.type === 'weekday')?.value || '')
      const hour = Number(parts.find((p) => p.type === 'hour')?.value)
      const hours = officeHours[day]
      setOpen(!!hours && hour >= hours[0] && hour < hours[1])
    }
    check()
    const timer = setInterval(check, 60_000)
    return () => clearInterval(timer)
  }, [])
  return open
}

function FaqItem({ q, a, open, onToggle, id }: { q: string; a: string; open: boolean; onToggle: () => void; id: string }) {
  return (
    <div className="border-b border-line">
      <h3>
        <button
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          className="flex w-full items-center justify-between gap-6 py-6 text-left"
        >
          <span className="font-marcellus text-xl md:text-2xl">{q}</span>
          <span
            className={cn(
              'grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line transition-all duration-500 ease-silk',
              open && 'rotate-45 border-clay bg-clay text-on-clay'
            )}
          >
            <Plus className="h-4 w-4" />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-panel`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-6 leading-relaxed text-muted">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ContactPage() {
  const isOpen = useOfficeStatus()
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className="min-h-screen">
      <SiteHeader overlay />

      <main>
        <PageHero
          image="/property1/1.webp"
          eyebrow="Contact us"
          title="We're here to help"
          subtitle="Questions about a stay, a booking or your property? Reach the right person directly."
          className="!h-[62vh]"
        >
          <div className="pointer-events-auto mt-8 flex flex-wrap gap-3">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn bg-cream text-ink hover:bg-white">
              <BsWhatsapp className="h-4 w-4" /> WhatsApp us
            </a>
            <a href={site.phone.href} className="btn-glass">
              <Phone className="h-4 w-4" /> Call now
            </a>
          </div>
        </PageHero>

        {/* Contact Information */}
        <section className="container mx-auto px-4 py-20 md:py-28">
          <div className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
            <Reveal className="bg-paper p-7 md:p-8">
              <Phone className="h-5 w-5 text-clay" />
              <h2 className="mt-6 font-marcellus text-2xl">Phone Numbers</h2>
              <ul className="mt-4 space-y-3">
                {site.phones.map((phone) => (
                  <li key={phone.label}>
                    <span className="block text-xs uppercase tracking-[0.14em] text-muted">{phone.label}</span>
                    <a href={phone.href} className="link-draw pb-0.5 hover:text-clay">{phone.display}</a>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.08} className="bg-paper p-7 md:p-8">
              <Clock className="h-5 w-5 text-clay" />
              <h2 className="mt-6 font-marcellus text-2xl">Office Hours</h2>
              {isOpen !== null && (
                <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-fg/5 px-3 py-1 text-xs font-medium">
                  <span className={cn('h-2 w-2 rounded-full', isOpen ? 'bg-[#1F8F55]' : 'bg-muted')} />
                  {isOpen ? 'Open now' : 'Closed now'}
                </p>
              )}
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-muted">Mon – Fri</dt><dd>9AM – 6PM</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-muted">Saturday</dt><dd>10AM – 4PM</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-muted">Sunday</dt><dd>Closed</dd></div>
              </dl>
            </Reveal>

            <Reveal delay={0.16} className="bg-paper p-7 md:p-8">
              <MapPin className="h-5 w-5 text-clay" />
              <h2 className="mt-6 font-marcellus text-2xl">Office Address</h2>
              <address className="mt-4 not-italic leading-relaxed text-muted">
                {site.officeAddress.map((line) => <span key={line} className="block">{line}</span>)}
              </address>
              <a href={site.mapsDirections} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-clay">
                <span className="link-draw pb-0.5">Get Directions</span> <ArrowUpRight className="h-4 w-4" />
              </a>
            </Reveal>

            <Reveal delay={0.24} className="bg-paper p-7 md:p-8">
              <Mail className="h-5 w-5 text-clay" />
              <h2 className="mt-6 font-marcellus text-2xl">Email & Social</h2>
              <a href={`mailto:${site.email}`} className="link-draw mt-4 inline-block break-all pb-0.5 hover:text-clay">
                {site.email}
              </a>
              <div className="mt-6 flex gap-2">
                {[
                  { href: site.instagram, icon: Instagram, label: 'Instagram' },
                  { href: site.tiktok, icon: AiFillTikTok, label: 'TikTok' },
                  { href: whatsappLink(), icon: BsWhatsapp, label: 'WhatsApp' },
                ].map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid h-11 w-11 place-items-center rounded-full border border-line transition-colors hover:border-clay hover:bg-clay hover:text-on-clay"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Map */}
          <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-4">
              <Reveal><Eyebrow>Find us</Eyebrow></Reveal>
              <MaskText text="Easy to reach from anywhere in Lagos" className="display mt-6 text-4xl" />
              <Reveal delay={0.2}>
                <p className="mt-5 leading-relaxed text-muted">
                  Our office is conveniently located in Shonibare Estate, Maryland.
                  It&apos;s easily accessible via the Third Mainland Bridge and Ikorodu Road.
                </p>
              </Reveal>
            </div>
            <Reveal className="lg:col-span-8">
              <div className="overflow-hidden rounded-3xl border border-line">
                <iframe
                  title="Map showing the Gifted Homes office"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.5162883494946!2d3.3641112!3d6.5767226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b92639e175397%3A0xdee42878e0883be8!2s4%20Olatunbosun%20St%2C%20Shomolu%20102216%2C%20Lagos!5e0!3m2!1sen!2sng!4v1709914532969!5m2!1sen!2sng"
                  width="100%"
                  height="420"
                  style={{ border: 0 }}
                  className="block grayscale-[35%] transition-[filter] duration-700 hover:grayscale-0 dark:opacity-90 dark:invert-[0.9] dark:hue-rotate-180"
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </Reveal>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-linen py-20 md:py-28">
          <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Reveal><Eyebrow>Good to know</Eyebrow></Reveal>
              <MaskText text="Frequently Asked Questions" className="display mt-6 text-4xl md:text-5xl" />
            </div>
            <Reveal className="border-t border-line lg:col-span-8">
              {faqs.map((faq, i) => (
                <FaqItem
                  key={faq.q}
                  id={`faq-${i}`}
                  q={faq.q}
                  a={faq.a}
                  open={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                />
              ))}
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
      <WhatsAppButton />
    </div>
  )
}
