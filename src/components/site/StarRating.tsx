"use client"
import { useState } from 'react'
import { Star, StarHalf } from 'lucide-react'
import { cn } from '@/lib/utils'

const labels = ['Poor', 'Fair', 'Good', 'Very good', 'Excellent']

export function StarDisplay({ rating, className }: { rating: number; className?: string }) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  return (
    <span className={cn('flex items-center gap-0.5', className)} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) =>
        i < full ? (
          <Star key={i} className="h-4 w-4 fill-brass text-brass" />
        ) : i === full && half ? (
          <StarHalf key={i} className="h-4 w-4 fill-brass text-brass" />
        ) : (
          <Star key={i} className="h-4 w-4 text-line" />
        )
      )}
    </span>
  )
}

/** Tap-to-rate stars that behave like a radio group for keyboards and screen readers */
export function StarInput({ value, onChange, name = 'rating' }: { value: number; onChange: (v: number) => void; name?: string }) {
  const [hover, setHover] = useState<number | null>(null)
  const shown = hover ?? value

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div role="radiogroup" aria-label="Your rating" className="flex gap-1" onMouseLeave={() => setHover(null)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="cursor-pointer" onMouseEnter={() => setHover(n)}>
            <input
              type="radio"
              name={name}
              value={n}
              checked={value === n}
              onChange={() => onChange(n)}
              className="peer sr-only"
              aria-label={`${n} star${n > 1 ? 's' : ''}, ${labels[n - 1]}`}
            />
            <Star
              className={cn(
                'h-8 w-8 rounded-sm transition-all duration-200 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-clay',
                n <= shown ? 'scale-105 fill-brass text-brass' : 'text-line hover:text-brass/60'
              )}
            />
          </label>
        ))}
      </div>
      <span className="min-w-[5.5rem] text-sm font-medium text-muted">
        {shown}/5 · {labels[shown - 1]}
      </span>
    </div>
  )
}
