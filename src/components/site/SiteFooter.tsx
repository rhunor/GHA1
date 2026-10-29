import Link from 'next/link'
import { Instagram, ArrowUpRight } from 'lucide-react'
import { BsWhatsapp } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'
import { AiFillTikTok } from 'react-icons/ai'
import Logo from './Logo'
import { navLinks, site, whatsappLink } from '@/lib/site'

export default function SiteFooter() {
  const socials = [
    { href: site.instagram, icon: Instagram, label: 'Instagram' },
    { href: site.tiktok, icon: AiFillTikTok, label: 'TikTok' },
    { href: whatsappLink(), icon: BsWhatsapp, label: 'WhatsApp' },
    { href: `mailto:${site.email}`, icon: MdEmail, label: 'Email' },
  ]

  return (
    <footer className="relative overflow-hidden bg-night text-cream">
      {/* Faint ripple rings in the corner, echoing the hero */}
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem]">
        {[1, 0.75, 0.5, 0.25].map((s) => (
          <span
            key={s}
            className="absolute inset-0 rounded-full border border-brass/10"
            style={{ transform: `scale(${s})` }}
          />
        ))}
      </div>

      <div className="container relative mx-auto px-4 pb-10 pt-20">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo light className="h-16 md:h-20" />
            <p className="display mt-8 max-w-sm text-3xl text-cream/90">
              Every stay should feel like a gift.
            </p>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn mt-8 bg-cream text-ink hover:bg-white">
              <BsWhatsapp className="h-4 w-4" />
              Chat to book
            </a>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow !text-brass">Explore</p>
            <ul className="mt-5 space-y-3">
              {[{ href: '/', label: 'Home' }, ...navLinks].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="link-draw pb-0.5 text-cream/75 hover:text-cream">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="eyebrow !text-brass">Visit &amp; call</p>
            <address className="mt-5 space-y-3 not-italic text-cream/75">
              <p>{site.address}</p>
              <a href={site.phone.href} className="block hover:text-cream">{site.phone.display}</a>
              <a href={`mailto:${site.email}`} className="block hover:text-cream">{site.email}</a>
              <a
                href={site.mapsDirections}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-brass hover:text-cream"
              >
                Get directions <ArrowUpRight className="h-4 w-4" />
              </a>
            </address>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse items-start justify-between gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center">
          <p className="text-sm text-cream/50">
            © {new Date().getFullYear()} Gifted Homes and Apartments. All rights reserved.
          </p>
          <div className="flex gap-2">
            {socials.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-cream/70 transition-colors hover:border-brass/60 hover:text-brass"
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
