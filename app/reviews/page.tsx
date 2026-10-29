"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { BsWhatsapp } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'
import SiteHeader from '@/components/site/SiteHeader'
import SiteFooter from '@/components/site/SiteFooter'
import PageHero from '@/components/site/PageHero'
import { Reveal } from '@/components/site/Reveal'
import { StarInput } from '@/components/site/StarRating'
import { useProperties, ListedProperty } from '@/hooks/useProperties'
import { site, whatsappLink } from '@/lib/site'
import { cn } from '@/lib/utils'
import { sized } from '@/lib/images'

interface ReviewFormData {
  propertyId: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  bookingReference: string;
}

const idOf = (property: ListedProperty) => property._id?.toString() || property.id?.toString() || ''

const guidelines = [
  'Please be honest and specific about your experience.',
  'Your review will help other guests make informed decisions.',
  'Reviews with booking references are verified and published immediately.',
  'Other reviews will be published after moderation.',
]

export default function ReviewsPage() {
  const { properties, loading } = useProperties();
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

  // Pre-select the property when arriving from a property page (?propertyId=...)
  useEffect(() => {
    if (loading) return
    const wanted = new URLSearchParams(window.location.search).get('propertyId')
    if (wanted && properties.some((p) => idOf(p) === wanted)) {
      setFormData((prev) => ({ ...prev, propertyId: wanted }))
    }
  }, [loading, properties])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

      // Scroll to the form top to see the success message
      document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
      console.error('Error submitting review:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit your review. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SiteHeader overlay />

      <main>
        <PageHero
          image="/property2/7.webp"
          eyebrow="Reviews"
          title="Share your experience"
          subtitle="We appreciate your feedback! Let us know about your stay at one of our properties."
          className="!h-[58vh]"
        />

        <section className="container mx-auto grid gap-12 px-4 py-20 md:py-28 lg:grid-cols-12 lg:gap-16">
          <div id="review-form" className="scroll-mt-28 lg:col-span-8">
            <AnimatePresence>
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  role="status"
                  className="mb-8 flex items-start gap-3 rounded-2xl border border-[#1F8F55]/25 bg-[#1F8F55]/10 p-5 text-[#17663D] dark:text-[#7FD3A5]"
                >
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{successMessage}</p>
                    <p className="mt-1 text-sm opacity-80">Thank you for taking the time to share your experience!</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                role="alert"
                className="mb-8 rounded-2xl border border-red-500/25 bg-red-500/10 p-5 text-red-700 dark:text-red-300"
              >
                {error}
              </motion.div>
            )}

            <Reveal>
              <h2 className="display text-4xl">Submit Your Review</h2>
            </Reveal>

            <form onSubmit={handleSubmit} className="mt-10 space-y-10">
              {/* Property Selection */}
              <fieldset>
                <legend className="field-label">1 · Where did you stay? *</legend>
                {loading ? (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {[0, 1].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-fg/5" />)}
                  </div>
                ) : (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {properties.map((property) => {
                      const id = idOf(property)
                      const selected = formData.propertyId === id
                      return (
                        <label
                          key={id}
                          className={cn(
                            'flex cursor-pointer items-center gap-4 rounded-2xl border bg-paper p-3 transition-all duration-300',
                            selected ? 'border-clay ring-2 ring-clay/20' : 'border-line hover:border-fg/30'
                          )}
                        >
                          <input
                            type="radio"
                            name="propertyId"
                            value={id}
                            checked={selected}
                            onChange={() => {
                              setError(null)
                              setFormData((prev) => ({ ...prev, propertyId: id }))
                            }}
                            className="sr-only"
                          />
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={sized(property.thumbnail, 480)} alt="" className="h-16 w-20 shrink-0 rounded-xl object-cover" />
                          <span className="min-w-0 flex-1">
                            <span className="block font-marcellus text-lg leading-snug">{property.title}</span>
                            <span className="block truncate text-xs text-muted">{property.location}</span>
                          </span>
                          <span
                            className={cn(
                              'mr-2 grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-colors',
                              selected ? 'border-clay bg-clay text-on-clay' : 'border-line'
                            )}
                          >
                            {selected && <Check className="h-3.5 w-3.5" />}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                )}
              </fieldset>

              {/* Rating */}
              <div>
                <span className="field-label">2 · How was it? *</span>
                <div className="mt-3">
                  <StarInput value={formData.rating} onChange={(rating) => setFormData((prev) => ({ ...prev, rating }))} />
                </div>
              </div>

              {/* Review Comment */}
              <div>
                <label htmlFor="rv-comment" className="field-label">3 · Tell us more *</label>
                <textarea
                  id="rv-comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="field mt-1.5"
                  placeholder="Share your experience with this property..."
                ></textarea>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="rv-name" className="field-label">Your Name *</label>
                  <input id="rv-name" type="text" name="name" value={formData.name} onChange={handleInputChange} required autoComplete="name" className="field" />
                </div>
                <div>
                  <label htmlFor="rv-email" className="field-label">Email Address *</label>
                  <input id="rv-email" type="email" name="email" value={formData.email} onChange={handleInputChange} required autoComplete="email" className="field" />
                </div>
              </div>

              {/* Booking Reference */}
              <div>
                <label htmlFor="rv-ref" className="field-label">Booking Reference (optional)</label>
                <input
                  id="rv-ref"
                  type="text"
                  name="bookingReference"
                  value={formData.bookingReference}
                  onChange={handleInputChange}
                  className="field"
                  placeholder="e.g. GHA_123456789"
                />
                <p className="mt-1.5 text-xs text-muted">
                  If you&apos;ve stayed with us, adding your booking reference will verify your stay
                  and publish your review immediately.
                </p>
              </div>

              <div className="flex justify-end border-t border-line pt-8">
                <button disabled={formSubmitting} type="submit" className="btn-clay px-8 py-4">
                  {formSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Additional Information */}
          <aside className="lg:col-span-4">
            <div className="card p-7 lg:sticky lg:top-28">
              <h2 className="display text-2xl">Review Guidelines</h2>
              <ol className="mt-6 space-y-4">
                {guidelines.map((item, i) => (
                  <li key={item} className="flex gap-4 text-sm leading-relaxed text-muted">
                    <span className="font-marcellus text-lg leading-none text-clay">0{i + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>

              <div className="mt-8 border-t border-line pt-6">
                <p className="text-sm text-muted">
                  If you have any questions about the review process, please contact us via:
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`mailto:${site.email}`} className="btn-ghost !px-4 !py-2">
                    <MdEmail className="h-4 w-4" /> Email
                  </Link>
                  <Link
                    href={whatsappLink('Good day, I would like to ask about my review for Gifted Homes and Apartments please.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost !px-4 !py-2"
                  >
                    <BsWhatsapp className="h-4 w-4" /> WhatsApp
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
