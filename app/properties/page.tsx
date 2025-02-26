"use client"
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Bed, Bath } from 'lucide-react'
import { Facebook, Twitter, Instagram, Linkedin} from 'lucide-react'
import { BsWhatsapp } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'
import Image from 'next/image'

interface Property {
  _id?: string;
  id?: number;
  title: string;
  price: string;
  location: string;
  thumbnail: string;
  description: string;
  specifications: {
    bedrooms: number;
    bathrooms: number;
    size: string;
  };
}

const PropertyCard = ({ property }: { property: Property }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800"
  >
    <div className="relative h-64 overflow-hidden">
      <Image
      width={200}
      height={200}
        src={property.thumbnail}
        alt={property.title}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
        <span className="text-white font-semibold">{property.price}</span>
        <span className="text-white text-sm">{property.location}</span>
      </div>
    </div>
    
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
        {property.title}
      </h3>
      
      <div className="flex items-center gap-4 mb-4 text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-1">
          <Bed className="h-4 w-4" />
          <span>{property.specifications.bedrooms}</span>
        </div>
        <div className="flex items-center gap-1">
          <Bath className="h-4 w-4" />
          <span>{property.specifications.bathrooms}</span>
        </div>
        <span>{property.specifications.size}</span>
      </div>

      <p className="text-gray-600 mb-6 dark:text-gray-300 line-clamp-2">
        {property.description}
      </p>

      <Link 
        href={`/properties/${property._id || property.id}`}
        className="block w-full"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          View Property
        </motion.button>
      </Link>
    </div>
  </motion.div>
)

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        console.log('Fetching properties...');
        const response = await fetch('/api/properties');
        console.log('API Response status:', response.status);
        
        // Check if response is OK
        if (response.ok) {
          const data = await response.json();
          console.log('API Response data:', data);
          
          // Check if data has properties array
          if (data && Array.isArray(data.properties) && data.properties.length > 0) {
            setProperties(data.properties);
            return; // Exit early if successful
          }
        }
        
        // If we get here, either the API failed or returned empty data
        // Let's use the static data as fallback
        console.log('API not returning expected data, falling back to static properties...');
        const { properties: staticProperties } = await import('@/lib/propertyData');
        setProperties(staticProperties);
        
      } catch (error) {
        console.error('Error fetching properties:', error);
        
        // Load static data as fallback
        console.log('Error occurred, fetching from static data...');
        const { properties: staticProperties } = await import('@/lib/propertyData');
        setProperties(staticProperties);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      {/* Header Section with responsive padding */}
      <div className="relative bg-primary text-white pt-0 md:pt-0 lg:pt-0 pb-16">
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
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our Properties
            </h1>
            <p className="text-lg opacity-90">
              Discover your perfect home from our exclusive collection
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900"></div>
      </div>

      {/* Properties Grid */}
      <div className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (!properties || properties.length === 0) ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              No properties available at the moment
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please check back later for new listings
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property._id || property.id} property={property} />
            ))}
          </div>
        )}
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