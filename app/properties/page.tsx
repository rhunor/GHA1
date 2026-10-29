//app/properties/page.tsx
"use client"
import React from 'react'
import Link from 'next/link'
import { Bed, Bath, Maximize, MapPin, ArrowUpRight } from 'lucide-react'
import SiteHeader from '@/components/site/SiteHeader'
import SiteFooter from '@/components/site/SiteFooter'
import WhatsAppButton from '@/components/site/WhatsAppButton'
import PageHero from '@/components/site/PageHero'
import { Reveal } from '@/components/site/Reveal'
import { sized, srcSetFor } from '@/lib/images'
import { useProperties, propertyHref, ListedProperty } from '@/hooks/useProperties'

const PropertyCard = ({ property, index }: { property: ListedProperty; index: number }) => {
  return (
    <Reveal delay={(index % 2) * 0.12} as="article">
      <Link href={propertyHref(property)} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-fg/5 sm:aspect-[5/4]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={sized(property.thumbnail, 1080)}
            srcSet={srcSetFor(property.thumbnail)}
            sizes="(min-width: 768px) 50vw, 100vw"
            alt={property.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-silk group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <span className="absolute left-5 top-5 rounded-full bg-black/35 px-4 py-1.5 text-sm text-white backdrop-blur-md">
            {property.price}
          </span>
          <span className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-cream text-ink opacity-0 transition-all duration-500 ease-silk group-hover:opacity-100 max-md:opacity-100">
            <ArrowUpRight className="h-5 w-5 transition-transform duration-500 group-hover:rotate-45" />
          </span>
          <div className="absolute inset-x-5 bottom-5 text-white">
            <p className="flex items-center gap-1.5 text-sm text-white/80">
              <MapPin className="h-4 w-4" /> {property.location}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="display text-2xl md:text-3xl">{property.title}</h2>
          </div>
          <ul className="flex gap-5 text-sm text-muted">
            <li className="flex items-center gap-1.5"><Bed className="h-4 w-4" /> {property.specifications.bedrooms}</li>
            <li className="flex items-center gap-1.5"><Bath className="h-4 w-4" /> {property.specifications.bathrooms}</li>
            <li className="flex items-center gap-1.5"><Maximize className="h-4 w-4" /> {property.specifications.size}</li>
          </ul>
        </div>
        <p className="mt-4 line-clamp-2 max-w-xl text-muted">{property.description}</p>
      </Link>
    </Reveal>
  )
}

export default function PropertiesPage() {
  const { properties, loading } = useProperties()

  return (
    <div className="min-h-screen">
      <SiteHeader overlay />

      <main>
        <PageHero
          image="/property2/4.webp"
          eyebrow="Gifted Homes"
          title="Our Properties"
          subtitle="Discover your perfect home from our exclusive collection"
        />

        <section className="container mx-auto px-4 py-20 md:py-28">
          <div className="mb-12 flex items-baseline justify-between border-b border-line pb-6">
            <p className="text-muted">
              {loading ? 'Loading residences…' : `${properties.length} ${properties.length === 1 ? 'residence' : 'residences'} available`}
            </p>
            <p className="hidden text-sm text-muted md:block">Prices per night</p>
          </div>

          {loading ? (
            <div className="grid gap-x-10 gap-y-16 md:grid-cols-2">
              {[0, 1].map((i) => (
                <div key={i}>
                  <div className="aspect-[5/4] animate-pulse rounded-3xl bg-fg/5" />
                  <div className="mt-6 h-8 w-1/2 animate-pulse rounded-full bg-fg/5" />
                  <div className="mt-3 h-4 w-3/4 animate-pulse rounded-full bg-fg/5" />
                </div>
              ))}
            </div>
          ) : (!properties || properties.length === 0) ? (
            <div className="py-12 text-center">
              <h2 className="display mb-4 text-3xl">No properties available at the moment</h2>
              <p className="text-muted">Please check back later for new listings</p>
            </div>
          ) : (
            <div className="grid gap-x-10 gap-y-20 md:grid-cols-2">
              {properties.map((property, i) => (
                <div key={property._id || property.id} className={i % 2 === 1 ? 'md:mt-24' : ''}>
                  <PropertyCard property={property} index={i} />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
      <WhatsAppButton />
    </div>
  )
}
