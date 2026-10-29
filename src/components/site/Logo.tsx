import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  /** Render the navy mark in white, for dark photos and dark sections */
  light?: boolean
  className?: string
}

export default function Logo({ light, className }: LogoProps) {
  return (
    <Link href="/" aria-label="Gifted Homes and Apartments, home" className="inline-flex shrink-0">
      <Image
        src="/logo-mark.png"
        alt="Gifted Homes and Apartments"
        width={720}
        height={480}
        priority
        className={cn(
          'h-12 w-auto transition-[filter] duration-500 md:h-14',
          light ? 'brightness-0 invert' : 'dark:brightness-0 dark:invert',
          className
        )}
      />
    </Link>
  )
}
