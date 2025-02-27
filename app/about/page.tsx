"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Sun, Moon, Instagram, Menu, X, Home, Clock, Wifi, Zap, Wind, Droplets, UtensilsCrossed, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BsWhatsapp } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'
import { AiFillTikTok } from "react-icons/ai";
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

interface NavItemProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ href, children, onClick }) => (
  <a
    href={href}
    onClick={onClick}
    className="block px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:text-primary md:inline-block dark:text-white"
  >
    {children}
  </a>
)

interface ServiceCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800 transform hover:-translate-y-1 transition-transform duration-300">
    <Icon className="h-8 w-8 text-primary mb-4" />
    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
)

export default function AboutPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const servicesRef = useRef(null)
  const aboutRef = useRef(null)

  useEffect(() => {
    const servicesSection = servicesRef.current
    const aboutSection = aboutRef.current

    gsap.from(servicesSection, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: servicesSection,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    })

    gsap.from(aboutSection, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: aboutSection,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    })
  }, [])

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

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md dark:bg-gray-900/80">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link href="/">
            <div className="h-20 w-auto md:h-24 lg:h-28 shrink-0">
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
              className="md:hidden rounded-full p-2 hover:bg-gray-100"
            >
              {isMenuOpen ? 
                <X className="h-6 w-6 text-gray-800 dark:text-white" /> : 
                <Menu className="h-6 w-6 text-gray-800 dark:text-white" />
              }
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <NavItem href="/about">About</NavItem> 
              <NavItem href="/properties">Properties</NavItem>
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {darkMode ? 
                  <Sun className="h-5 w-5 text-gray-800 dark:text-white" /> : 
                  <Moon className="h-5 w-5 text-gray-800 dark:text-white" />
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
              className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md"
            >
              <div className="container mx-auto py-4 px-4 flex flex-col space-y-4">
                <NavItem href="/about" onClick={() => setIsMenuOpen(false)}>About</NavItem> 
                <NavItem href="/properties" onClick={() => setIsMenuOpen(false)}>Properties</NavItem>
                
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-800 dark:text-white"
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

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32 md:pt-40 lg:pt-48">
        {/* Services Section */}
        <section ref={servicesRef} className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                Our Services
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                We provide luxurious and comfortable short and long stay apartments for guests seeking 
                a home away from home experience. Our apartments are fully furnished for the most 
                comfortable stay featuring modern amenities and exceptional service.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ServiceCard {...service} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section ref={aboutRef} className="py-16 px-4 bg-white dark:bg-gray-800">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-4xl font-bold text-gray-900 dark:text-white"
                >
                  About Us
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-lg text-gray-600 dark:text-gray-300"
                >
                  Gifted homes and apartments was birthed in 2024. We believe that every stay should 
                  feel like a gift to be enjoyed just like life itself.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-lg text-gray-600 dark:text-gray-300"
                >
                  Our carefully curated shortlets are designed to offer more than just a place to 
                  stay—they provide an experience of relaxation, comfort, and convenience that promotes 
                  wellness. Each apartment is tailored for those who appreciate high-end living, 
                  combining luxury with functionality to ensure every guest feels at home.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-lg text-gray-600 dark:text-gray-300"
                >
                  We also help homeowners preserve the value of their properties through expert 
                  shortlet management, ensuring that every space remains not only livable and luxurious 
                  but also profitable. Our focus is on maintaining quality, both for our guests and for 
                  those who entrust us with their properties.
                </motion.p>
              </div>
              <div className="relative h-[600px] rounded-lg overflow-hidden shadow-xl">
                <Image
                width={600}
                height={600}
                  src="property1/3.jpg"
                  alt="Luxury Apartment Interior"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>
            </div>
          </div>
        </section>
      </div>

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