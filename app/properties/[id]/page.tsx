"use client"
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Bed, Bath, Home, ArrowLeft, X, CreditCard } from 'lucide-react'
import { properties, Property } from '@/lib/propertyData'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import { BsWhatsapp } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'

interface BookingFormData {
  name: string
  email: string
  phone: string
  checkIn: string
  checkOut: string
  guests: number
}

export default function PropertyDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [property, setProperty] = useState<Property | null>(null)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [activeOption, setActiveOption] = useState<string | null>(null)
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  })

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

  useEffect(() => {
    // Add Paystack script dynamically
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    document.body.appendChild(script)
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const extractPrice = (priceString: string): number => {
    const match = priceString.match(/₦([\d,]+)/)
    if (match && match[1]) {
      return parseInt(match[1].replace(/,/g, ''), 10)
    }
    return 100000 // Default fallback
  }

  const handlePaystackCheckout = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Create unique reference for this transaction
    const reference = 'GHA_' + Math.floor(Math.random() * 1000000000) + Date.now()
    
    // Calculate price from string (e.g. "₦200,000/night")
    const price = extractPrice(property.price)
    
    // Calculate number of nights
    const checkIn = new Date(formData.checkIn)
    const checkOut = new Date(formData.checkOut)
    const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)))
    
    // Calculate total amount
    const totalAmount = price * nights
    
    // Initialize Paystack checkout
    const handler = (window as any).PaystackPop.setup({
      key: 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Replace with your Paystack public key
      email: formData.email,
      amount: totalAmount * 100, // Paystack amount is in kobo (multiply by 100)
      currency: 'NGN',
      ref: reference,
      metadata: {
        custom_fields: [
          {
            display_name: "Guest Name",
            variable_name: "guest_name",
            value: formData.name
          },
          {
            display_name: "Check In",
            variable_name: "check_in",
            value: formData.checkIn
          },
          {
            display_name: "Check Out",
            variable_name: "check_out",
            value: formData.checkOut
          },
          {
            display_name: "Number of Guests",
            variable_name: "guests",
            value: formData.guests.toString()
          },
          {
            display_name: "Phone Number",
            variable_name: "phone",
            value: formData.phone
          },
          {
            display_name: "Property",
            variable_name: "property",
            value: property.title
          }
        ]
      },
      onClose: function() {
        console.log('Payment window closed')
      },
      callback: function(response: any) {
        console.log('Payment complete! Reference: ' + response.reference)
        setIsBookingModalOpen(false)
        // Show success message or redirect
        alert('Booking successful! Reference: ' + response.reference)
      }
    })
    
    handler.openIframe()
  }

  const openWhatsApp = () => {
    const message = `Good day, I would like to book ${property.title} (${property.price}). Please provide more information.`
    window.open(`https://wa.me/+2347036560630?text=${encodeURIComponent(message)}`, '_blank')
  }

  const openAirbnb = () => {
    // Replace with your actual Airbnb listing URL
    window.open('https://www.airbnb.com/your-listing-url', '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-0 md:pt-0 lg:pt-0">
      <Link href="/">
        <div className="h-20 w-auto md:h-24 lg:h-48 shrink-0">
          <img
            src="/logo.png"
            alt="Gifted Homes and Apartments"
            className="h-full w-auto object-contain"
          />
        </div>
      </Link>
      
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
            onClick={() => setIsBookingModalOpen(true)}
            className="w-full md:w-auto px-8 py-4 bg-primary text-white rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Book Now
          </motion.button>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Book Your Stay</h2>
                  <button 
                    onClick={() => {
                      setIsBookingModalOpen(false)
                      setActiveOption(null)
                    }}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {!activeOption ? (
                  <div className="space-y-6">
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Choose your preferred booking method for:
                      <span className="block font-bold text-lg text-primary mt-1">{property.title}</span>
                      <span className="block font-bold text-gray-900 dark:text-white mt-1">{property.price}</span>
                    </p>

                    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                      <button
                        onClick={() => setActiveOption('whatsapp')}
                        className="flex flex-col items-center justify-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <BsWhatsapp className="h-10 w-10 text-green-500 mb-3" />
                        <span className="font-medium text-gray-900 dark:text-white">WhatsApp</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Chat with us directly</span>
                      </button>

                      <button
                        onClick={() => setActiveOption('paystack')}
                        className="flex flex-col items-center justify-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <CreditCard className="h-10 w-10 text-blue-500 mb-3" />
                        <span className="font-medium text-gray-900 dark:text-white">Pay with Paystack</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Secure online payment</span>
                      </button>

                      <button
                        onClick={() => setActiveOption('airbnb')}
                        className="flex flex-col items-center justify-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Home className="h-10 w-10 text-red-500 mb-3" />
                        <span className="font-medium text-gray-900 dark:text-white">Airbnb</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Book through Airbnb</span>
                      </button>
                    </div>
                  </div>
                ) : activeOption === 'paystack' ? (
                  <form onSubmit={handlePaystackCheckout} className="space-y-6">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Please provide your details to complete your booking.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number of Guests</label>
                        <select
                          name="guests"
                          value={formData.guests}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        >
                          {[1, 2, 3, 4, 5, 6].map(num => (
                            <option key={num} value={num}>{num} {num === 1 ? 'guest' : 'guests'}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Check-in Date</label>
                        <input
                          type="date"
                          name="checkIn"
                          value={formData.checkIn}
                          onChange={handleInputChange}
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Check-out Date</label>
                        <input
                          type="date"
                          name="checkOut"
                          value={formData.checkOut}
                          onChange={handleInputChange}
                          required
                          min={formData.checkIn || new Date().toISOString().split('T')[0]}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setActiveOption(null)}
                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                      >
                        Proceed to Payment
                      </button>
                    </div>
                  </form>
                ) : activeOption === 'whatsapp' ? (
                  <div className="text-center py-8">
                    <BsWhatsapp className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Book via WhatsApp</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Our team is ready to assist you with your booking for {property.title}.
                    </p>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => setActiveOption(null)}
                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                      >
                        Back
                      </button>
                      <button
                        onClick={openWhatsApp}
                        className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                      >
                        Chat on WhatsApp
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Home className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Book via Airbnb</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Continue your booking on the Airbnb platform.
                    </p>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => setActiveOption(null)}
                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                      >
                        Back
                      </button>
                      <button
                        onClick={openAirbnb}
                        className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Continue to Airbnb
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="bg-white py-12 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
            <div className="h-20 w-auto md:h-24 lg:h-48 shrink-0">
              <Link href="/">
                <img
                  src="/logo.png"
                  alt="Gifted Homes and Apartments"
                  className="h-full w-auto object-contain"
                />
              </Link>
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
              <a 
                href="https://wa.me/+2347036560630?text=Good%20day,%20I%20would%20like%20to%20book%20a%20stay%20with%20Gifted%20Homes%20and%20Apartments%20please."
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-600 hover:text-primary dark:text-gray-400"
              >
                <BsWhatsapp className="h-6 w-6" />
              </a>
              <a 
                href="mailto:anitaazuike@gmail.com" 
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