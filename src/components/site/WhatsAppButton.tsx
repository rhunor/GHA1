"use client"
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BsWhatsapp } from 'react-icons/bs'
import { whatsappLink } from '@/lib/site'

/** Floating "chat to book" button that appears once the visitor starts scrolling */
export default function WhatsAppButton({ message }: { message?: string }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="group fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-5 z-40 flex items-center gap-2 rounded-full bg-[#1F8F55] py-3.5 pl-3.5 pr-3.5 text-white shadow-[0_14px_40px_-12px_rgba(31,143,85,0.8)] transition-[padding] duration-300 hover:pr-5"
        >
          <span className="absolute inset-0 -z-10 animate-ring-out rounded-full border-2 border-[#1F8F55]" />
          <BsWhatsapp className="h-6 w-6" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium transition-[max-width] duration-300 group-hover:max-w-[8rem]">
            Chat to book
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  )
}
