"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Clock, Mail } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { BsWhatsapp } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'
import { AiFillTikTok } from "react-icons/ai"
import { Instagram } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header/Logo */}
      <div className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <div className="h-16 w-auto md:h-20 shrink-0">
              <Image
                width={160}
                height={80}
                src="/logo.png"
                alt="Gifted Homes and Apartments"
                className="h-full w-auto object-contain"
              />
            </div>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-primary text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg md:text-xl opacity-90">
              We&apos;re here to assist you with any questions or inquiries about our properties.
            </p>
          </motion.div>
        </div>
        {/* Wave design at bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" className="w-full h-auto">
            <path 
              fill="#f9fafb" 
              fillOpacity="1" 
              d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,74.7C1120,75,1280,53,1360,42.7L1440,32L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z"
              className="dark:fill-gray-900"
            ></path>
          </svg>
        </div>
      </div>

      {/* Contact Information */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Info Section */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-primary/10 rounded-full p-3 mr-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Office Address</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      4 Olatunbosun Street<br />
                      Shonibare Estate, Maryland<br />
                      Lagos, Nigeria
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-primary/10 rounded-full p-3 mr-4">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Phone Numbers</h3>
                    <div className="space-y-2 mt-1">
                      <p className="text-gray-600 dark:text-gray-300">
                        <span className="font-medium block">Telephone:</span>
                        <a href="tel:+2349045165367" className="hover:text-primary">+234 904 516 5367</a>
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        <span className="font-medium block">Booking and Reservations:</span>
                        <a href="tel:+2348087740394" className="hover:text-primary">+234 808 774 0394</a>
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        <span className="font-medium block">Concierge:</span>
                        <a href="tel:+2347036560630" className="hover:text-primary">+234 703 656 0630</a>
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        <span className="font-medium block">Admin:</span>
                        <a href="tel:+2347036560630" className="hover:text-primary">+234 703 656 0630</a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-primary/10 rounded-full p-3 mr-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Office Hours</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      Monday - Friday: 9AM - 6PM<br />
                      Saturday: 10AM - 4PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-primary/10 rounded-full p-3 mr-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      <a href="mailto:Horizon2haus@gmail.com" className="hover:text-primary">
                        Horizon2haus@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a 
                    href="https://www.instagram.com/giftedapartments?igsh=MXFtc29ldjFjaGdiOA=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full hover:bg-primary hover:text-white transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://www.tiktok.com/@gifted_apartments?_t=ZM-8uGMEX3jFZd&_r=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full hover:bg-primary hover:text-white transition-colors"
                  >
                    <AiFillTikTok className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://wa.link/inwgi0?text=Good%20day,%20I%20would%20like%20to%20book%20a%20stay%20with%20Gifted%20Homes%20and%20Apartments%20please."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full hover:bg-primary hover:text-white transition-colors"
                  >
                    <BsWhatsapp className="h-5 w-5" />
                  </a>
                  <a 
                    href="mailto:Horizon2haus@gmail.com"
                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full hover:bg-primary hover:text-white transition-colors"
                  >
                    <MdEmail className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Map Section */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 h-full">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Find Us</h2>

                <div className="aspect-video w-full h-auto overflow-hidden rounded-lg">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.5162883494946!2d3.3641112!3d6.5767226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b92639e175397%3A0xdee42878e0883be8!2s4%20Olatunbosun%20St%2C%20Shomolu%20102216%2C%20Lagos!5e0!3m2!1sen!2sng!4v1709914532969!5m2!1sen!2sng" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, minHeight: "350px" }} 
                    allowFullScreen={false} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Directions</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Our office is conveniently located in Shonibare Estate, Maryland. 
                    It&apos;s easily accessible via the Third Mainland Bridge and Ikorodu Road.
                  </p>
                  <a 
                    href="https://maps.app.goo.gl/i5jUyDDH2vwQyN3q6" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-block mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </motion.div>
          </div>



          {/* FAQ Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">What is your check-in and check-out time?</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Standard check-in time is 3:00 PM and check-out time is 11:00 AM. Early check-in or late check-out may be available upon request, subject to availability.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Do you offer airport transfers?</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Yes, we can arrange airport transfers for our guests. Please contact our concierge at least 24 hours before your arrival to make arrangements.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Is there a security deposit required?</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Yes, we require a refundable security deposit which varies depending on the property. The deposit is returned within 7 days after check-out, provided there are no damages.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Do you offer long-term stays?</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Yes, we offer discounted rates for long-term stays. Please contact our booking team for special rates on stays longer than 30 days.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-12 dark:bg-gray-900 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
            <div className="h-16 w-auto md:h-20 shrink-0">
              <Link href="/">
                <Image
                  width={160}
                  height={80}
                  src="/logo.png"
                  alt="Gifted Homes and Apartments"
                  className="h-full w-auto object-contain"
                />
              </Link>
            </div>
            
            <div className="flex space-x-6">
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