// components/Footer.tsx
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import { BsWhatsapp } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'

export default function Footer() {
  return (
    <footer className="bg-white py-12 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
          <div className="h-20 w-auto md:h-24 lg:h-48 shrink-0">
            <img
              src="/logo.png"
              alt="Gifted Homes and Apartments"
              className="h-full w-auto object-contain"
            />
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
              href="https://wa.me/YOUR_WHATSAPP_NUMBER" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-600 hover:text-primary dark:text-gray-400"
            >
              <BsWhatsapp className="h-6 w-6" />
            </a>
            <a 
              href="mailto:your.email@example.com" 
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
  )
}