// hooks/useProperties.ts
"use client"
import { useEffect, useState } from 'react'

export interface ListedProperty {
  _id?: string;
  id?: number;
  title: string;
  price: string;
  location: string;
  thumbnail: string;
  description: string;
  images?: string[];
  specifications: {
    bedrooms: number;
    bathrooms: number;
    size: string;
    type?: string;
  };
}

// Fetches properties from the API and falls back to the bundled static data
export function useProperties() {
  const [properties, setProperties] = useState<ListedProperty[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    let gotLive = false

    const showStatic = async () => {
      const { properties: staticProperties } = await import('@/lib/propertyData')
      if (!cancelled && !gotLive) {
        setProperties(staticProperties)
        setLoading(false)
      }
    }

    // If the database is slow, show the bundled listings rather than a long spinner,
    // and swap in the live ones when they arrive
    const slowTimer = setTimeout(showStatic, 8000)

    const load = async () => {
      try {
        const response = await fetch('/api/properties?public=1')
        if (response.ok) {
          const data = await response.json()
          if (data && Array.isArray(data.properties) && data.properties.length > 0) {
            gotLive = true
            if (!cancelled) {
              setProperties(data.properties)
              setLoading(false)
            }
            return
          }
        }
        await showStatic()
      } catch (error) {
        console.error('Error fetching properties:', error)
        await showStatic()
      } finally {
        clearTimeout(slowTimer)
      }
    }

    load()
    return () => {
      cancelled = true
      clearTimeout(slowTimer)
    }
  }, [])

  return { properties, loading }
}

export const propertyHref = (p: ListedProperty) => `/properties/${p._id || p.id}`

