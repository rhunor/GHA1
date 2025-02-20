"use client"
import React, { useState, useEffect } from 'react'
import { Sun, Moon, Facebook, Twitter, Instagram, Linkedin, Menu, X, Building } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import Link from 'next/link'

// Dynamically import WaterWave with no SSR
const WaterWave = dynamic(() => import('react-water-wave'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
  ),
})

const images = [
  '/1.jpg',
  '/2.jpg',
  '/3.jpg',
  '/4.jpg'
]

interface NavItemProps {
  href: string
  children: React.ReactNode
  onClick?: () => void
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
          className="rounded-full bg-primary px-6 py-3 md:px-8 md:py-4 text-lg font-semibold text-white transition-colors hover:bg-primary/90"
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
          <div className="h-20 w-auto md:h-24 lg:h-48 shrink-0">
            <img
              src="/logo.png"
              alt="Gifted Homes and Apartments"
              className="h-full w-auto object-contain"
            />
          </div>
          
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
              {/* <NavItem href="#home">Home</NavItem>
              <NavItem href="#about">About</NavItem> */}
              <NavItem href="/properties">Properties</NavItem>
              <NavItem href="#contact">Contact</NavItem>
              
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
                {/* <NavItem href="#home" onClick={() => setIsMenuOpen(false)}>Home</NavItem>
                <NavItem href="#about" onClick={() => setIsMenuOpen(false)}>About</NavItem> */}
                <NavItem href="/properties" onClick={() => setIsMenuOpen(false)}>Properties</NavItem>
                <NavItem href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</NavItem>
                
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white"
                >
                  <span>Toggle Theme</span>
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
                {() => <HeroContent />}
              </WaterWave>
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="bg-white py-12 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
            <div className="h-20 w-auto md:h-24 lg:h-48 shrink-0">
              <img
                src="/logo.png"
                alt="Gifted Homes and Apartments"
                className="h-full w-auto object-contain"
              />
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-400">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-400">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-400">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-400">
                <Linkedin className="h-6 w-6" />
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