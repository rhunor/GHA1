// components/Header.tsx
"use client"
import { useState } from 'react'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

interface NavItemProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const NavItem = ({ href, children, onClick }: NavItemProps) => (
  <Link
    href={href}
    onClick={onClick}
    className="block px-4 py-2 text-sm font-medium text-white transition-colors hover:text-primary/80 md:inline-block"
  >
    {children}
  </Link>
)

const Header = ({ darkMode, setDarkMode }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="absolute top-0 z-50 w-full">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="h-20 w-auto md:h-24 lg:h-28 shrink-0">
          <Link href="/">
            <img
              src="/logo.png"
              alt="Gifted Homes and Apartments"
              className="h-full w-auto object-contain"
            />
          </Link>
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
            <NavItem href="#about">About</NavItem>
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
              <NavItem href="#about" onClick={() => setIsMenuOpen(false)}>About</NavItem>
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
  )
}

export default Header