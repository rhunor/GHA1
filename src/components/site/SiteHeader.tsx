"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun, Phone, ArrowUpRight } from 'lucide-react'
import { Instagram } from 'lucide-react'
import { BsWhatsapp } from 'react-icons/bs'
import { AiFillTikTok } from 'react-icons/ai'
import Logo from './Logo'
import { navLinks, site, whatsappLink } from '@/lib/site'
import { useTheme } from '@/providers/SiteProviders'
import { cn } from '@/lib/utils'

interface SiteHeaderProps {
  /** Transparent over a photo hero until the page is scrolled */
  overlay?: boolean
}

export default function SiteHeader({ overlay = false }: SiteHeaderProps) {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Solid once scrolled; slides away on scroll down and returns on scroll up
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      setHidden(y > 320 && y > last + 4 ? true : y < last - 4 ? false : (h) => h)
      last = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const onPhoto = overlay && !scrolled && !menuOpen

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-all duration-500 ease-silk',
          hidden && !menuOpen ? '-translate-y-full' : 'translate-y-0',
          onPhoto
            ? 'bg-gradient-to-b from-black/50 to-transparent text-white'
            : 'border-b border-line/60 bg-canvas/80 text-fg backdrop-blur-xl',
          menuOpen && 'border-transparent bg-transparent text-white backdrop-blur-none'
        )}
      >
        <div className="container mx-auto flex items-center justify-between gap-6 px-4 py-3 md:py-4">
          <Logo light={onPhoto || menuOpen} />

          <nav aria-label="Main" className="hidden items-center gap-9 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? 'page' : undefined}
                className="link-draw pb-1 text-sm tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 md:gap-3">
            <a
              href={site.phone.href}
              className={cn(
                'hidden items-center gap-2 text-sm xl:flex',
                onPhoto ? 'text-white/85 hover:text-white' : 'text-muted hover:text-fg'
              )}
            >
              <Phone className="h-4 w-4" />
              {site.phone.display}
            </a>
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className={cn(
                'grid h-10 w-10 place-items-center rounded-full transition-colors',
                onPhoto || menuOpen ? 'hover:bg-white/15' : 'hover:bg-fg/5'
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
                </motion.span>
              </AnimatePresence>
            </button>
            <Link
              href="/properties"
              className={cn(
                'hidden md:inline-flex',
                onPhoto ? 'btn-glass !py-2.5' : 'btn-clay !py-2.5'
              )}
            >
              Book a stay
            </Link>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="relative grid h-10 w-10 place-items-center lg:hidden"
            >
              <span
                className={cn(
                  'absolute h-px w-6 bg-current transition-transform duration-300',
                  menuOpen ? 'rotate-45' : '-translate-y-[4px]'
                )}
              />
              <span
                className={cn(
                  'absolute h-px w-6 bg-current transition-transform duration-300',
                  menuOpen ? '-rotate-45' : 'translate-y-[4px]'
                )}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu: a full-screen sheet that opens from a circle, like a drop spreading */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="menu"
            initial={{ clipPath: 'circle(0% at calc(100% - 2.5rem) 2.5rem)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 2.5rem) 2.5rem)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 2.5rem) 2.5rem)' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-ink px-6 pb-[calc(2.5rem+env(safe-area-inset-bottom))] pt-28 text-cream lg:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col gap-2">
              {[{ href: '/', label: 'Home' }, ...navLinks].map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="group flex items-baseline justify-between border-b border-white/10 py-3"
                  >
                    <span
                      className={cn(
                        'display text-3xl transition-colors min-[400px]:text-4xl',
                        pathname === link.href ? 'text-brass' : 'text-cream group-hover:text-brass'
                      )}
                    >
                      {link.label}
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-white/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-auto space-y-6 pt-10"
            >
              <Link href="/properties" onClick={() => setMenuOpen(false)} className="btn w-full bg-cream text-ink">
                Book a stay
              </Link>
              <div className="space-y-1 text-sm text-white/60">
                <a href={site.phone.href} className="block text-cream">{site.phone.display}</a>
                <p>{site.address}</p>
              </div>
              <div className="flex gap-3">
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
                    className="grid h-11 w-11 place-items-center rounded-full border border-white/15 hover:bg-white/10"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
