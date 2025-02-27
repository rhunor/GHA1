"use client"
import React, { useState, useEffect } from 'react'
import { Sun, Moon, Instagram,  Menu, X, Building } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { BsWhatsapp } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'
import { AiFillTikTok } from "react-icons/ai";
import Image from 'next/image'

interface BackgroundImageProps {
  currentImage: string;
  children: React.ReactNode;
}

function detectIncompatibleDevice(): boolean {
  if (typeof window === 'undefined') return false
  const userAgent = navigator.userAgent.toLowerCase()
  return /android/.test(userAgent)
}

// Import WaterWave without type checking to avoid deployment issues
const WaterWave = dynamic(
  () => import('react-water-wave').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
    ),
  }
)

const BackgroundImage: React.FC<BackgroundImageProps> = ({ currentImage, children }) => {
  const isIncompatibleDevice = detectIncompatibleDevice()

  if (isIncompatibleDevice) {
    return (
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${currentImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {children}
      </div>
    )
  }

  return (
    <WaterWave
      imageUrl={currentImage}
      dropRadius={20}
      perturbance={0.03}
      resolution={512}
      style={{
        width: '100%',
        height: '100%',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {() => children}
    </WaterWave>
  )
}

const images = [
  'property1/3.jpg',
  'property2/1.jpg',
  'property2/4.jpg',
  'property1/1.jpg'
]

interface NavItemProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ href, children, onClick }) => (
  <a
    href={href}
    onClick={onClick}
    className="block px-4 py-2 text-sm font-medium text-white transition-colors hover:text-primary/80 md:inline-block"
  >
    {children}
  </a>
)

// HeroContent component to avoid prop drilling
const HeroContent = () => (
  <div className="h-screen">
    <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
    
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <div className="text-center text-white">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-6 text-4xl font-bold md:text-6xl"
        >
          Find the perfect short stay apartment 
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mb-8 text-lg md:text-xl"
        >
          Luxury Apartments in Lekki
        </motion.p>
        <Link href="/properties">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-sm bg-gray-300 px-5 py-2 md:px-6 md:py-3 text-base font-medium text-gray-800 transition-all hover:bg-gray-400 hover:shadow-lg"
          >
            View Properties
          </motion.button>
        </Link>
      </div>
    </div>
  </div>
)

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false)
  const [currentImage] = useState(images[Math.floor(Math.random() * images.length)])
  const [loading, setLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!isMounted) {
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <motion.div
          className="relative"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Building className="h-16 w-16 text-primary dark:text-white" />
          <motion.div
            className="absolute inset-0"
            animate={{
              opacity: [0, 1, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Building className="h-16 w-16 text-primary/50 dark:text-white/50" />
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <nav className="absolute top-0 z-30 w-full">
        <div className="container mx-auto flex items-center justify-between p-0">
          <Link href="/">
            <div className="h-20 w-auto md:h-24 lg:h-48 shrink-0">
              <Image
              width={200}
              height={200}
                src="/logo.png"
                alt="Gifted Homes and Apartments"
                className="h-full w-auto object-contain"
              />
            </div>
          </Link>
          
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden rounded-full p-2 hover:bg-white/20"
            >
              {isMenuOpen ? 
                <X className="h-6 w-6 text-white" /> : 
                <Menu className="h-6 w-6 text-white" />
              }
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <NavItem href="/about">About</NavItem> 
              <NavItem href="/properties">Properties</NavItem>
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="rounded-full p-2 hover:bg-white/20 text-white"
              >
                {darkMode ? 
                  <Sun className="h-5 w-5" /> : 
                  <Moon className="h-5 w-5" />
                }
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/70 backdrop-blur-md"
            >
              <div className="container mx-auto py-4 px-4 flex flex-col space-y-4">
                <NavItem href="/about" onClick={() => setIsMenuOpen(false)}>About</NavItem> 
                <NavItem href="/properties" onClick={() => setIsMenuOpen(false)}>Properties</NavItem>
                
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white"
                >
                  {darkMode ? 
                    <Sun className="h-5 w-5" /> : 
                    <Moon className="h-5 w-5" />
                  }
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="relative min-h-screen">
        <div className="relative h-screen overflow-hidden">
          <div className="absolute inset-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 4 }} 
              className="absolute inset-0"
            >
              <BackgroundImage currentImage={currentImage}>
                <HeroContent />
              </BackgroundImage>
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="bg-white py-12 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
            <div className="h-20 w-auto md:h-24 lg:h-48 shrink-0">
              <Link href="/">
                <Image
                width={200}
                height={200}
                  src="/logo.png"
                  alt="Gifted Homes and Apartments"
                  className="h-full w-auto object-contain"
                />
              </Link>
            </div>
            
            <div className="flex space-x-6">
              {/* <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-400">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-400">
                <Twitter className="h-6 w-6" />
              </a> */}
              <a href="https://www.instagram.com/giftedapartments?igsh=MXFtc29ldjFjaGdiOA==" className="text-gray-600 hover:text-primary dark:text-gray-400">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://www.tiktok.com/@gifted_apartments?_t=ZM-8uGMEX3jFZd&_r=1" className="text-gray-600 hover:text-primary dark:text-gray-400">
                <AiFillTikTok className="h-6 w-6" />
              </a>
              <a 
  href="https://wa.link/inwgi0?text=Good%20day,%20I%20would%20like%20to%20book%20a%20stay%20with%20Gifted%20Homes%20and%20Apartments%20please."
  target="_blank" 
  rel="noopener noreferrer" 
  className="text-gray-600 hover:text-primary dark:text-gray-400"
>
  <BsWhatsapp className="h-6 w-6" />
</a>
            <a 
              href="mailto:Horizon2haus@gmail.com" 
              className="text-gray-600 hover:text-primary dark:text-gray-400"
            >
              <MdEmail className="h-6 w-6" />
            </a>
            </div>
            
            <div className="text-sm text-center text-gray-600 dark:text-gray-400">
              © 2025 Gifted Homes and Apartments. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}