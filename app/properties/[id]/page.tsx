// app/properties/[id]/page.tsx
"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Bed, Bath, Home, ArrowLeft, X, CreditCard, Calendar, Maximize, MapPin, Check, Clock, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { BsWhatsapp } from 'react-icons/bs'
import { generateReference, extractPrice, calculateTotalAmount } from '@/lib/paystackService'
import { PaystackConfig } from '@/types/paystack';
import PropertyReviews from '@/components/PropertyReviews';
import SiteHeader from '@/components/site/SiteHeader'
import SiteFooter from '@/components/site/SiteFooter'
import { Reveal, Eyebrow } from '@/components/site/Reveal'
import { cn } from '@/lib/utils'
import { sized, srcSetFor } from '@/lib/images'

interface PropertyData {
  _id?: string;
  id?: number;
  title: string;
  description: string;
  thumbnail: string;
  price: string;
  location: string;
  images: string[];
  features: string[];
  airbnbLink?: string
  specifications: {
    bedrooms: number;
    bathrooms: number;
    size: string;
    type: string;
  };
  isBookable?: boolean;
}

interface BookingFormData {
  name: string
  email: string
  phone: string
  checkIn: string
  checkOut: string
  guests: number
}

interface PaystackResponse {
  reference: string;
}

// Add Paystack type definition to Window
declare global {
  interface Window {
    PaystackPop: {
      setup: (config: PaystackConfig) => { openIframe: () => void };
    };
  }
}

export default function PropertyDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [property, setProperty] = useState<PropertyData | null>(null)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [activeOption, setActiveOption] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [paymentSuccess, setPaymentSuccess] = useState<{ reference: string } | null>(null)
  const [unavailableDates, setUnavailableDates] = useState<string[]>([])
  const [dateError, setDateError] = useState<string | null>(null)
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  })

  // Fetch property data
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${params.id}?public=1`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.property) {
            setProperty(data.property);
            console.log("Property data:", data.property); 
            setFetchLoading(false);
            return;
          }
        }
        
        console.log('API not returning property, trying static data...');
        const { properties: staticProperties } = await import('@/lib/propertyData') as { properties: PropertyData[] }; // Explicitly type the import
        
        const propertyId = Number.isNaN(Number(params.id)) ? params.id : Number(params.id);
        const staticProperty = staticProperties.find(p => 
          p.id === propertyId || p._id === params.id
        );
        
        if (staticProperty) {
          setProperty(staticProperty);
          setFetchLoading(false);
        } else {
          throw new Error('Property not found');
        }
      } catch (error) {
        console.error('Error fetching property:', error);
        router.push('/properties');
      }
    };
    
    fetchProperty();
  }, [params.id, router]);

  // Fetch property availability
  useEffect(() => {
    if (!property || !property._id) return;

    const fetchAvailability = async () => {
      try {
        const response = await fetch(`/api/properties/${property._id}/availability`);
        
        if (response.ok) {
          const data = await response.json();
          setUnavailableDates(data.unavailableDates || []);
        }
      } catch (error) {
        console.error('Error fetching property availability:', error);
      }
    };
    
    fetchAvailability();
  }, [property]);

  // Image slideshow auto-play
  useEffect(() => {
    if (!property || !isAutoPlaying) return

    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      )
    }, 5000)

    return () => clearInterval(timer)
  }, [property, isAutoPlaying])

  // Load Paystack script
  useEffect(() => {
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

  // Check if a date is unavailable
  const isDateUnavailable = useCallback((date: string) => {
    return unavailableDates.includes(date);
  }, [unavailableDates]);
    // Check if a date range has any unavailable dates
  // const checkDateRangeAvailability = (startDate: string, endDate: string): boolean => {
  //   const start = new Date(startDate);
  //   const end = new Date(endDate);
    
    // Return true if any date in range is unavailable
  //   const current = new Date(start);
  //   while (current < end) {
  //     const dateStr = current.toISOString().split('T')[0];
  //     if (isDateUnavailable(dateStr)) {
  //       return true;
  //     }
  //     current.setDate(current.getDate() + 1);
  //   }
    
  //   return false;
  // };

  // Validate date selection when dates change
  useEffect(() => {
    if (!formData.checkIn || !formData.checkOut) {
      setDateError(null);
      return;
    }
  
    const checkin = new Date(formData.checkIn);
    const checkout = new Date(formData.checkOut);
  
    if (checkout <= checkin) {
      setDateError("Check-out date must be after check-in date");
      return;
    }
  
    // Move the function inside the useEffect
    const checkDateRangeAvailability = (startDate: string, endDate: string): boolean => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Return true if any date in range is unavailable
      const current = new Date(start);
      while (current < end) {
        const dateStr = current.toISOString().split('T')[0];
        if (isDateUnavailable(dateStr)) {
          return true;
        }
        current.setDate(current.getDate() + 1);
      }
      
      return false;
    };
  
    const unavailable = checkDateRangeAvailability(formData.checkIn, formData.checkOut);
    if (unavailable) {
      setDateError("Some dates in this range are unavailable. Please select different dates.");
    } else {
      setDateError(null);
    }
  }, [formData.checkIn, formData.checkOut, isDateUnavailable]);

  

  // Keep the active thumbnail centred in its strip (without scrolling the page)
  const thumbsRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const strip = thumbsRef.current
    const thumb = strip?.children[currentImageIndex] as HTMLElement | undefined
    if (!strip || !thumb) return
    strip.scrollTo({ left: thumb.offsetLeft - strip.clientWidth / 2 + thumb.clientWidth / 2, behavior: 'smooth' })
  }, [currentImageIndex])

  // Arrow keys move through the gallery; Escape closes the booking modal
  useEffect(() => {
    if (!property) return
    const count = property.images.length
    const onKey = (e: KeyboardEvent) => {
      if (isBookingModalOpen) {
        if (e.key === 'Escape') {
          setIsBookingModalOpen(false)
          setActiveOption(null)
          setPaymentSuccess(null)
        }
        return
      }
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (e.key === 'ArrowRight') {
        setIsAutoPlaying(false)
        setCurrentImageIndex((prev) => (prev + 1) % count)
      } else if (e.key === 'ArrowLeft') {
        setIsAutoPlaying(false)
        setCurrentImageIndex((prev) => (prev - 1 + count) % count)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [property, isBookingModalOpen])

  useEffect(() => {
    document.body.style.overflow = isBookingModalOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isBookingModalOpen])

  if (fetchLoading) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="container mx-auto px-4 pt-28">
          <div className="aspect-[16/9] w-full animate-pulse rounded-3xl bg-fg/5" />
          <div className="mt-10 h-12 w-2/3 animate-pulse rounded-full bg-fg/5" />
          <div className="mt-4 h-5 w-1/3 animate-pulse rounded-full bg-fg/5" />
        </div>
      </div>
    );
  }

  if (!property) {
    return null;
  }

  const nextImage = () => {
    setIsAutoPlaying(false)
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setIsAutoPlaying(false)
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

  // Format date strings to avoid conflicts with the date input's min attribute
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Get tomorrow's date for minimum check-in
  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return formatDateForInput(tomorrow);
  };

  // Check the availability of a property for a date range
  const checkAvailability = async (propertyId: string, checkIn: string, checkOut: string) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId,
          checkIn,
          checkOut
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to check availability');
      }
      
      const data = await response.json();
      return data.available;
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
    }
  };

  const verifyTransaction = async (reference: string) => {
    try {
      console.log(`Verifying transaction with reference: ${reference}`);
      const response = await fetch(`/api/paystack/verify?reference=${reference}`);
      
      if (!response.ok) {
        console.error(`Verification failed with status: ${response.status}`);
        const text = await response.text();
        console.error(`Response body: ${text}`);
        return false;
      }
      
      const data = await response.json();
      console.log('Verification response:', data);
      
      if (data.status && data.data && data.data.status === 'success') {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error verifying transaction:', error);
      return false;
    }
  };

  // Separate function to handle the payment callback
  const handlePaymentCallback = async (response: PaystackResponse) => {
    try {
      console.log('Payment complete! Reference: ' + response.reference);
      const isVerified = await verifyTransaction(response.reference);
      
      if (isVerified) {
        setPaymentSuccess({ reference: response.reference });
        
        try {
          await fetch('/api/bookings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              propertyId: property._id || property.id,
              reference: response.reference,
              ...formData,
              paymentStatus: 'completed',
            }),
          });
        } catch (error) {
          console.error('Error saving booking:', error);
        }
        
        setFormData({
          name: '',
          email: '',
          phone: '',
          checkIn: '',
          checkOut: '',
          guests: 1
        });
      } else {
        alert('Payment verification failed. Please contact support with reference: ' + response.reference);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error in payment callback:', error);
      setIsLoading(false);
      alert('Payment processing error. Please contact support with reference: ' + response.reference);
    }
  };

  const handlePaystackCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate dates again
    if (dateError) {
      alert('Please select available dates');
      return;
    }
    
    // Double-check availability with the server
    const isAvailable = await checkAvailability(
      property._id || property.id?.toString() || '',
      formData.checkIn,
      formData.checkOut
    );
    
    if (!isAvailable) {
      setDateError('Selected dates are no longer available. Please choose different dates.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const reference = generateReference();
      const price = extractPrice(property.price);
      const totalAmount = calculateTotalAmount(price, formData.checkIn, formData.checkOut);
      
      // Make sure the Paystack script is loaded properly
      if (typeof window === 'undefined' || !window.PaystackPop) {
        throw new Error('Paystack not loaded correctly');
      }
      
      const paystackConfig: PaystackConfig = {
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
        email: formData.email,
        amount: totalAmount * 100,
        currency: 'NGN',
        ref: reference,
        metadata: {
          custom_fields: [
            { display_name: "Guest Name", variable_name: "guest_name", value: formData.name },
            { display_name: "Check In", variable_name: "check_in", value: formData.checkIn },
            { display_name: "Check Out", variable_name: "check_out", value: formData.checkOut },
            { display_name: "Number of Guests", variable_name: "guests", value: formData.guests.toString() },
            { display_name: "Phone Number", variable_name: "phone", value: formData.phone },
            { display_name: "Property", variable_name: "property", value: property.title }
          ]
        },
        onClose: function() {
          setIsLoading(false);
          console.log('Payment window closed');
        },
        callback: function(response: PaystackResponse) {
          handlePaymentCallback(response);
        }
      };
      
      // Directly use the Paystack.setup method
      const handler = window.PaystackPop.setup(paystackConfig);
      handler.openIframe();
    } catch (error) {
      console.error('Error initiating payment:', error);
      setIsLoading(false);
      alert('An error occurred while initiating payment. Please try again.');
    }
  };

  const openWhatsApp = () => {
    const message = `Good day, I would like to book ${property.title} (${property.price}). Please provide more information.`;
    window.open(`https://wa.link/inwgi0?text=${encodeURIComponent(message)}`, '_blank');
  }

  const openAirbnb = () => {
    console.log("Property object:", property);
    console.log("Airbnb link:", property.airbnbLink);
    
    const airbnbUrl = property.airbnbLink || "https://www.airbnb.com";
    console.log("URL to open:", airbnbUrl);
    
    window.open(airbnbUrl, '_blank');
  }
  
  const bookable = property.isBookable !== false
  const nightly = extractPrice(property.price)
  const nights = formData.checkIn && formData.checkOut && !dateError
    ? Math.max(1, Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / 86400000))
    : 0
  const total = nights ? calculateTotalAmount(nightly, formData.checkIn, formData.checkOut) : 0

  const closeModal = () => {
    setIsBookingModalOpen(false)
    setActiveOption(null)
    setPaymentSuccess(null)
  }

  const specs = [
    { icon: Bed, value: property.specifications.bedrooms, label: 'Bedrooms' },
    { icon: Bath, value: property.specifications.bathrooms, label: 'Bathrooms' },
    { icon: Maximize, value: property.specifications.size, label: 'Floor area' },
    { icon: Home, value: property.specifications.type, label: 'Type' },
  ]

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="pt-24 md:pt-28">
        <div className="container mx-auto px-4">
          <Link
            href="/properties"
            className="group mb-6 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            All properties
          </Link>

          {/* Gallery */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-ink md:aspect-[16/8]">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.img
                key={currentImageIndex}
                src={sized(property.images[currentImageIndex], 1920)}
                srcSet={srcSetFor(property.images[currentImageIndex])}
                sizes="100vw"
                alt={`${property.title} - Image ${currentImageIndex + 1}`}
                className="absolute inset-0 h-full w-full cursor-grab object-cover active:cursor-grabbing"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) nextImage()
                  else if (info.offset.x > 60) prevImage()
                }}
              />
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            <button
              onClick={prevImage}
              aria-label="Previous photo"
              className="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextImage}
              aria-label="Next photo"
              className="absolute right-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-4 right-4 rounded-full bg-black/40 px-3 py-1 text-sm tabular-nums text-white backdrop-blur-md">
              {String(currentImageIndex + 1).padStart(2, '0')} / {String(property.images.length).padStart(2, '0')}
            </div>
          </div>

          <div ref={thumbsRef} className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
            {property.images.map((src, i) => (
              <button
                key={src}
                onClick={() => {
                  setIsAutoPlaying(false)
                  setCurrentImageIndex(i)
                }}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === currentImageIndex}
                className={cn(
                  'relative h-16 w-24 shrink-0 overflow-hidden rounded-xl transition-all duration-300 md:h-20 md:w-28',
                  i === currentImageIndex ? 'opacity-100 ring-2 ring-clay ring-offset-2 ring-offset-canvas' : 'opacity-55 hover:opacity-100'
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={sized(src, 480)} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          {/* Details + booking card */}
          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Eyebrow>
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{property.location}</span>
              </Eyebrow>
              <h1 className="display mt-5 text-3xl sm:text-4xl md:text-5xl">{property.title}</h1>

              <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
                {specs.map(({ icon: Icon, value, label }) => (
                  <div key={label} className="flex flex-col bg-paper p-5">
                    <dt className="order-2 mt-1 text-xs uppercase tracking-[0.14em] text-muted">{label}</dt>
                    <dd className="flex items-center gap-2 font-marcellus text-2xl capitalize">
                      <Icon className="h-4 w-4 text-clay" /> {value}
                    </dd>
                  </div>
                ))}
              </dl>

              <Reveal className="mt-14">
                <h2 className="display text-3xl">About this home</h2>
                <p className="mt-5 whitespace-pre-line text-lg leading-relaxed text-muted">
                  {property.description}
                </p>
              </Reveal>

              <Reveal className="mt-14">
                <h2 className="display text-3xl">What this place offers</h2>
                <ul className="mt-6 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                  {property.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 border-b border-line py-4">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-clay/10 text-clay">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span className="first-letter:uppercase">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <aside className="hidden lg:col-span-5 lg:block">
              <div className="card sticky top-28 p-8 shadow-[0_30px_80px_-40px_rgb(var(--c-fg)/0.35)]">
                <p className="text-sm text-muted">From</p>
                <p className="display mt-1 text-4xl">{property.price}</p>
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="btn-clay mt-8 w-full py-4 text-base"
                  disabled={!bookable}
                >
                  {bookable ? <><Calendar className="h-5 w-5" /> Book Now</> : 'Currently Unavailable'}
                </button>
                <button onClick={openWhatsApp} className="btn-ghost mt-3 w-full py-4">
                  <BsWhatsapp className="h-4 w-4 text-[#1F8F55]" /> Ask on WhatsApp
                </button>
                <ul className="mt-8 space-y-3 border-t border-line pt-6 text-sm text-muted">
                  <li className="flex items-center gap-3"><Clock className="h-4 w-4 text-clay" /> Check-in 3:00 PM · Check-out 11:00 AM</li>
                  <li className="flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-clay" /> Secure payment with Paystack</li>
                  <li className="flex items-center gap-3"><Home className="h-4 w-4 text-clay" /> Also bookable on Airbnb</li>
                </ul>
              </div>
            </aside>
          </div>

          {/* Reviews section */}
          <div className="mt-20 pb-24">
            <PropertyReviews propertyId={property._id || property.id?.toString() || ''} />
          </div>
        </div>
      </main>

      {/* Mobile booking bar */}
      {!isBookingModalOpen && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas/90 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-marcellus text-xl leading-tight">{property.price}</p>
              <p className="max-w-[45vw] truncate text-xs text-muted">{property.title}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={openWhatsApp} aria-label="Ask on WhatsApp" className="grid h-12 w-12 place-items-center rounded-full border border-line">
                <BsWhatsapp className="h-5 w-5 text-[#1F8F55]" />
              </button>
              <button onClick={() => setIsBookingModalOpen(true)} disabled={!bookable} className="btn-clay px-6">
                {bookable ? 'Book Now' : 'Unavailable'}
              </button>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isBookingModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/60 backdrop-blur-sm sm:items-center sm:p-4"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="booking-title"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-paper shadow-2xl sm:rounded-3xl"
            >
              <div className="p-6 md:p-8">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow line-clamp-1">{property.title}</p>
                    <h2 id="booking-title" className="display mt-2 text-3xl">Book Your Stay</h2>
                  </div>
                  <button
                    onClick={closeModal}
                    aria-label="Close"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors hover:text-fg"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {paymentSuccess ? (
                  <div className="py-8 text-center">
                    <div className="relative mx-auto mb-6 grid h-20 w-20 place-items-center">
                      <span className="absolute inset-0 animate-ring-out rounded-full border-2 border-[#1F8F55]" />
                      <span className="grid h-16 w-16 place-items-center rounded-full bg-[#1F8F55]/10">
                        <Check className="h-8 w-8 text-[#1F8F55]" />
                      </span>
                    </div>
                    <h3 className="display mb-2 text-3xl">Booking Successful!</h3>
                    <p className="mb-2 text-muted">
                      Thank you for booking with Gifted Homes and Apartments.
                    </p>
                    <p className="mb-8 text-muted">
                      Your reference number: <span className="font-semibold text-fg">{paymentSuccess.reference}</span>
                    </p>
                    <button onClick={closeModal} className="btn-clay">
                      Done
                    </button>
                  </div>
                ) : !activeOption ? (
                  <div>
                    <p className="mb-6 text-muted">
                      Choose your preferred booking method · <span className="font-medium text-fg">{property.price}</span>
                    </p>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                      {[
                        { key: 'whatsapp', icon: BsWhatsapp, color: 'text-[#1F8F55]', title: 'WhatsApp', sub: 'Chat with us directly' },
                        { key: 'paystack', icon: CreditCard, color: 'text-clay', title: 'Pay with Paystack', sub: 'Secure online payment' },
                        { key: 'airbnb', icon: Home, color: 'text-[#E0565B]', title: 'Airbnb', sub: 'Book through Airbnb' },
                      ].map((option) => (
                        <button
                          key={option.key}
                          onClick={() => setActiveOption(option.key)}
                          className="group flex items-center gap-4 rounded-2xl border border-line p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-fg/30 md:flex-col md:items-start md:p-6"
                        >
                          <option.icon className={cn('h-8 w-8', option.color)} />
                          <span>
                            <span className="block font-medium">{option.title}</span>
                            <span className="mt-0.5 block text-sm text-muted">{option.sub}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : activeOption === 'paystack' ? (
                  <form onSubmit={handlePaystackCheckout} className="space-y-6">
                    <p className="text-muted">
                      Please provide your details to complete your booking.
                    </p>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label htmlFor="bk-name" className="field-label">Full Name</label>
                        <input id="bk-name" type="text" name="name" value={formData.name} onChange={handleInputChange} required autoComplete="name" className="field" />
                      </div>
                      <div>
                        <label htmlFor="bk-email" className="field-label">Email</label>
                        <input id="bk-email" type="email" name="email" value={formData.email} onChange={handleInputChange} required autoComplete="email" className="field" />
                      </div>
                      <div>
                        <label htmlFor="bk-phone" className="field-label">Phone Number</label>
                        <input id="bk-phone" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required autoComplete="tel" className="field" />
                      </div>
                      <div>
                        <label htmlFor="bk-guests" className="field-label">Number of Guests</label>
                        <select id="bk-guests" name="guests" value={formData.guests} onChange={handleInputChange} className="field">
                          {[1, 2, 3, 4, 5, 6].map(num => (
                            <option key={num} value={num}>{num} {num === 1 ? 'guest' : 'guests'}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="bk-in" className="field-label">Check-in Date</label>
                        <input
                          id="bk-in"
                          type="date"
                          name="checkIn"
                          value={formData.checkIn}
                          onChange={handleInputChange}
                          required
                          min={getTomorrow()}
                          className={cn('field', dateError && '!border-red-500 focus:!ring-red-500/20')}
                        />
                        <p className="mt-1 text-xs text-muted">Only available dates can be selected</p>
                      </div>
                      <div>
                        <label htmlFor="bk-out" className="field-label">Check-out Date</label>
                        <input
                          id="bk-out"
                          type="date"
                          name="checkOut"
                          value={formData.checkOut}
                          onChange={handleInputChange}
                          required
                          min={formData.checkIn || getTomorrow()}
                          className={cn('field', dateError && '!border-red-500 focus:!ring-red-500/20')}
                          disabled={!formData.checkIn}
                        />
                      </div>

                      {dateError && (
                        <div role="alert" className="text-sm text-red-600 dark:text-red-400 md:col-span-2">
                          {dateError}
                        </div>
                      )}
                    </div>

                    {nights > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between rounded-2xl bg-linen px-5 py-4"
                      >
                        <span className="text-sm text-muted">
                          ₦{nightly.toLocaleString('en-NG')} × {nights} {nights === 1 ? 'night' : 'nights'}
                        </span>
                        <span className="font-marcellus text-2xl">₦{total.toLocaleString('en-NG')}</span>
                      </motion.div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                      <button type="button" onClick={() => setActiveOption(null)} className="btn-ghost">
                        Back
                      </button>
                      <button type="submit" disabled={isLoading || !!dateError} className="btn-clay">
                        {isLoading ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Processing...
                          </>
                        ) : (
                          'Proceed to Payment'
                        )}
                      </button>
                    </div>
                  </form>
                ) : activeOption === 'whatsapp' ? (
                  <div className="py-8 text-center">
                    <BsWhatsapp className="mx-auto mb-5 h-14 w-14 text-[#1F8F55]" />
                    <h3 className="display mb-2 text-3xl">Book via WhatsApp</h3>
                    <p className="mb-8 text-muted">
                      Our team is ready to assist you with your booking for {property.title}.
                    </p>
                    <div className="flex justify-center gap-3">
                      <button onClick={() => setActiveOption(null)} className="btn-ghost">
                        Back
                      </button>
                      <button onClick={openWhatsApp} className="btn bg-[#1F8F55] text-white hover:brightness-110">
                        Chat on WhatsApp
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Home className="mx-auto mb-5 h-14 w-14 text-[#E0565B]" />
                    <h3 className="display mb-2 text-3xl">Book via Airbnb</h3>
                    <p className="mb-8 text-muted">
                      Continue your booking on the Airbnb platform.
                    </p>
                    <div className="flex justify-center gap-3">
                      <button onClick={() => setActiveOption(null)} className="btn-ghost">
                        Back
                      </button>
                      <button onClick={openAirbnb} className="btn bg-[#E0565B] text-white hover:brightness-110">
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

      <SiteFooter />
      {/* Room for the mobile booking bar so it never covers the footer */}
      <div className="h-24 bg-night lg:hidden" />
    </div>
  );
}
