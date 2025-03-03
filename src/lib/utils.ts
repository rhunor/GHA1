import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names or conditional class names
 * using clsx and tailwind-merge for optimal Tailwind CSS usage
 * 
 * @param inputs - Any number of class name arguments
 * @returns A merged string of class names optimized for Tailwind CSS
 * 
 * @example
 * // Basic usage
 * cn("px-4", "py-2", "bg-blue-500")
 * 
 * // With conditionals
 * cn("px-4", isLarge ? "py-3" : "py-2", { "bg-blue-500": isPrimary })
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a price string for display
 * 
 * @param price - The price as a number or string
 * @param currency - The currency symbol (default: ₦)
 * @returns Formatted price string
 */
export function formatPrice(price: number | string, currency: string = '₦') {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return `${currency}${numPrice.toLocaleString('en-NG')}`
}

/**
 * Generates a UUID
 * 
 * @returns A random UUID string
 */
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * Formats a date to a readable string
 * 
 * @param date - Date to format
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions) {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  
  const dateToFormat = typeof date === 'string' ? new Date(date) : date
  return dateToFormat.toLocaleDateString('en-US', options || defaultOptions)
}

/**
 * Truncates text to a specified length and adds ellipsis
 * 
 * @param text - Text to truncate
 * @param length - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, length: number = 100) {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

/**
 * Calculates the number of nights between two dates
 * 
 * @param checkIn - Check-in date
 * @param checkOut - Check-out date
 * @returns Number of nights
 */
export function calculateNights(checkIn: Date | string, checkOut: Date | string) {
  const startDate = typeof checkIn === 'string' ? new Date(checkIn) : checkIn
  const endDate = typeof checkOut === 'string' ? new Date(checkOut) : checkOut
  
  // Reset time part for accurate calculation
  startDate.setHours(0, 0, 0, 0)
  endDate.setHours(0, 0, 0, 0)
  
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}

/**
 * Gets today's date formatted as YYYY-MM-DD for input fields
 * 
 * @returns Today's date in YYYY-MM-DD format
 */
export function getTodayFormatted() {
  return new Date().toISOString().split('T')[0]
}

/**
 * Gets tomorrow's date formatted as YYYY-MM-DD for input fields
 * 
 * @returns Tomorrow's date in YYYY-MM-DD format
 */
export function getTomorrowFormatted() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
}

/**
 * Creates a range of dates between start and end dates
 * 
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Array of dates in the range
 */
export function getDateRange(startDate: Date, endDate: Date) {
  const dates = []
  const currentDate = new Date(startDate)
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return dates
}

/**
 * Extracts a numeric price from a string (e.g., "₦50,000/night" -> 50000)
 * 
 * @param priceString - The price string
 * @returns Numeric value
 */
export function extractNumericPrice(priceString: string) {
  return parseFloat(priceString.replace(/[^0-9.]/g, ''))
}