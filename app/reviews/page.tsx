"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Star, StarHalf,  ChevronDown, Check } from 'lucide-react'
import { Instagram } from 'lucide-react'
import { BsWhatsapp } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'
import { AiFillTikTok } from "react-icons/ai"
import Image from 'next/image'

interface Property {
  _id?: string;
  id?: number;
  title: string;
  thumbnail: string;
  location: string;
}

interface ReviewFormData {
  propertyId: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  bookingReference: string;
}

export default function ReviewsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [formData, setFormData] = useState<ReviewFormData>({
    propertyId: '',
    name: '',
    email: '',
    rating: 5,
    comment: '',
    bookingReference: '',
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties');
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data.properties)) {
            setProperties(data.properties);
          } else {
            // Fallback to static data if API doesn't return expected format
            const { properties: staticProperties } = await import('@/lib/propertyData');
            setProperties(staticProperties);
          }
        } else {
          // Fallback to static data if API call fails
          const { properties: staticProperties } = await import('@/lib/propertyData');
          setProperties(staticProperties);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        // Fallback to static data on error
        const { properties: staticProperties } = await import('@/lib/propertyData');
        setProperties(staticProperties);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value, 10) : value
    }));
  };

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    setFormData(prev => ({
      ...prev,
      propertyId: property._id?.toString() || property.id?.toString() || ''
    }));
    setIsPropertyDropdownOpen(false);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="h-5 w-5 fill-yellow-400 text-yellow-400" />);
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="h-5 w-5 text-gray-300" />);
    }

    return stars;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.propertyId) {
      setError('Please select a property');
      return;
    }
    
    setError(null);
    setSuccessMessage(null);
    setFormSubmitting(true);
    
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }
      
      setSuccessMessage(data.message || 'Thank you for your review!');
      setFormData({
        propertyId: '',
        name: '',
        email: '',
        rating: 5,
        comment: '',
        bookingReference: '',
      });
      setSelectedProperty(null);
      
      // Scroll to top to see success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error submitting review:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit your review. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

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
      <div className="relative bg-primary text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Share Your Experience</h1>
            <p className="text-lg md:text-xl opacity-90">
              We appreciate your feedback! Let us know about your stay at one of our properties.
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

      {/* Review Form Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-green-100 border border-green-200 text-green-700 rounded-lg flex items-start"
            >
              <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">{successMessage}</p>
                <p className="mt-2 text-sm">Thank you for taking the time to share your experience!</p>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Submit Your Review</h2>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Property Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Select Property *
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsPropertyDropdownOpen(!isPropertyDropdownOpen)}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <span className="truncate">
                        {selectedProperty ? selectedProperty.title : 'Choose a property...'}
                      </span>
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </button>
                    
                    {isPropertyDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg rounded-md overflow-auto max-h-60">
                        <ul className="py-1">
                          {properties.map((property) => (
                            <li
                              key={property._id || property.id}
                              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                              onClick={() => handlePropertySelect(property)}
                            >
                              <div className="flex items-center px-4 py-2">
                                <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0 mr-3">
                                  <Image
                                    src={property.thumbnail}
                                    alt={property.title}
                                    width={40}
                                    height={40}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {property.title}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {property.location}
                                  </p>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                
                {/* Booking Reference */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Booking Reference (optional)
                  </label>
                  <input
                    type="text"
                    name="bookingReference"
                    value={formData.bookingReference}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    placeholder="e.g. GHA_123456789"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    If you&apos;ve stayed with us, adding your booking reference will verify your stay
                    and publish your review immediately.
                  </p>
                </div>
                
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Rating *
                  </label>
                  <div className="flex items-center space-x-1">
                    <input
                      type="range"
                      name="rating"
                      min="1"
                      max="5"
                      step="1"
                      value={formData.rating}
                      onChange={handleInputChange}
                      className="w-48 accent-primary"
                    />
                    <div className="ml-4 flex items-center">
                      <div className="flex mr-2">{renderStars(formData.rating)}</div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {formData.rating}/5
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Review Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Review *
                  </label>
                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    placeholder="Share your experience with this property..."
                  ></textarea>
                </div>
                
                {/* Submit Button */}
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={formSubmitting}
                    type="submit"
                    className={`px-6 py-3 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors flex items-center ${
                      formSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {formSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      'Submit Review'
                    )}
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
          
          {/* Additional Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Review Guidelines</h2>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="inline-block h-2 w-2 bg-primary rounded-full mt-2 mr-2"></span>
                <span>Please be honest and specific about your experience.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-2 w-2 bg-primary rounded-full mt-2 mr-2"></span>
                <span>Your review will help other guests make informed decisions.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-2 w-2 bg-primary rounded-full mt-2 mr-2"></span>
                <span>Reviews with booking references are verified and published immediately.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-2 w-2 bg-primary rounded-full mt-2 mr-2"></span>
                <span>Other reviews will be published after moderation.</span>
              </li>
            </ul>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300">
                If you have any questions about the review process, please contact us via:
              </p>
              <div className="flex items-center space-x-4 mt-3">
                <Link
                  href="mailto:Horizon2haus@gmail.com"
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary"
                >
                  <MdEmail className="h-5 w-5 mr-1" />
                  <span>Email</span>
                </Link>
                <Link
                  href="https://wa.link/inwgi0?text=Good%20day,%20I%20would%20like%20to%20ask%20about%20my%20review%20for%20Gifted%20Homes%20and%20Apartments%20please."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary"
                >
                  <BsWhatsapp className="h-5 w-5 mr-1" />
                  <span>WhatsApp</span>
                </Link>
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