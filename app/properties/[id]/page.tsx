"use client"
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Bed, Bath, Home, ArrowLeft } from 'lucide-react'
import { properties, Property } from '@/lib/propertyData'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Sun, Moon, Facebook, Twitter, Instagram, Linkedin, Menu, X, Building } from 'lucide-react'


export default function PropertyDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [property, setProperty] = useState<Property | null>(null)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    const propertyId = Number(params.id)
    const foundProperty = properties.find(p => p.id === propertyId)
    
    if (!foundProperty) {
      router.push('/properties')
      return
    }
    
    setProperty(foundProperty)
  }, [params.id, router])

  useEffect(() => {
    if (!property || !isAutoPlaying) return

    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      )
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(timer)
  }, [property, isAutoPlaying])

  if (!property) {
    return <div>Loading...</div>
  }

  const nextImage = () => {
    setIsAutoPlaying(false) // Pause auto-play when manually navigating
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setIsAutoPlaying(false) // Pause auto-play when manually navigating
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    )
  }

  return (
   
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32 md:pt-40 lg:pt-48">
        {/* Back Button */}
        <Link 
          href="/properties"
          className="fixed top-20 left-4 z-10 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>

        {/* Image Slideshow */}
        <div className="relative h-[50vh] md:h-[70vh] bg-black">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={property.images[currentImageIndex]}
              alt={`${property.title} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
            {currentImageIndex + 1} / {property.images.length}
          </div>
        </div>

        {/* Property Details */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {property.title}
              </h1>
              <span className="text-2xl font-semibold text-primary">
                {property.price}
              </span>
            </div>

            <div className="mb-8">
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                {property.location}
              </p>

              {/* Specifications */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-primary" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {property.specifications.bedrooms} Bedrooms
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-primary" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {property.specifications.bathrooms} Bathrooms
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {property.specifications.size}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 dark:text-gray-300">
                    {property.specifications.type}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Description
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {property.description}
                </p>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.features.map((feature, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 text-gray-600 dark:text-gray-300"
                    >
                      <div className="h-2 w-2 bg-primary rounded-full" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full md:w-auto px-8 py-4 bg-primary text-white rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Book Now
            </motion.button>
          </div>
        </div>
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