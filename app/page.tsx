"use client"
import React, { useState, useEffect } from 'react'
import { Sun, Moon, Facebook, Twitter, Instagram, Linkedin, Home, Menu, X, Building } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import WaterWave from 'react-water-wave'

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
    className="block px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:text-primary dark:text-white md:inline-block"
  >
    {children}
  </a>
)

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false)
  const [currentImage, setCurrentImage] = useState(images[Math.floor(Math.random() * images.length)])
  const [loading, setLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

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
      <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md dark:bg-gray-900/80">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="text-xl font-bold text-primary dark:text-white md:text-2xl">
            Gifted Homes and Apartments
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isMenuOpen ? 
              <X className="h-6 w-6 text-gray-800 dark:text-white" /> : 
              <Menu className="h-6 w-6 text-gray-800 dark:text-white" />
            }
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavItem href="#home">Home</NavItem>
            <NavItem href="#about">About</NavItem>
            <NavItem href="#properties">Properties</NavItem>
            <NavItem href="#contact">Contact</NavItem>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {darkMode ? 
                <Sun className="h-5 w-5 text-white" /> : 
                <Moon className="h-5 w-5 text-gray-800" />
              }
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md"
            >
              <div className="container mx-auto py-4 px-4 flex flex-col space-y-4">
                <NavItem href="#home" onClick={() => setIsMenuOpen(false)}>Home</NavItem>
                <NavItem href="#about" onClick={() => setIsMenuOpen(false)}>About</NavItem>
                <NavItem href="#properties" onClick={() => setIsMenuOpen(false)}>Properties</NavItem>
                <NavItem href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</NavItem>
                
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-800 dark:text-white"
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
              style={{
                backgroundImage: `url(${currentImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <WaterWave
                imageUrl={currentImage}
                dropRadius={20}
                perturbance={0.03}
                resolution={512}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {() => (
                  <div className="h-screen">
                    <div className="absolute inset-0 bg-black/30" />
                    
                    <div className="absolute inset-0 flex items-center justify-center px-4">
                      <div className="text-center text-white">
                        <h1 className="mb-6 text-4xl font-bold md:text-6xl">
                          Find Your Dream Home
                        </h1>
                        <p className="mb-8 text-lg md:text-xl">
                          Discover luxury properties in Lekki Phase 1
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="rounded-full bg-primary px-6 py-3 md:px-8 md:py-4 text-lg font-semibold text-white transition-colors hover:bg-primary/90"
                        >
                          View Properties
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}
              </WaterWave>
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="bg-white py-12 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
            <div className="text-xl font-bold text-primary dark:text-white md:text-2xl">
              Gifted Homes and Apartments
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