"use client"
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Building } from 'lucide-react'
import MainLayout from '@/components/layout/MainLayout'

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

// HeroContent component
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
  const [currentImage] = useState(images[Math.floor(Math.random() * images.length)])
  const [loading, setLoading] = useState(true)
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
    <MainLayout>
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
     </MainLayout>
  )
}