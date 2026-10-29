// lib/site.ts
// Contact details and links shared by every public page

export const site = {
  name: 'Gifted Homes and Apartments',
  address: 'G1/G2, Shonny Highway, Shonibare Estate, Maryland, Lagos',
  officeAddress: ['4 Olatunbosun Street', 'Shonibare Estate, Maryland', 'Lagos, Nigeria'],
  email: 'Horizon2haus@gmail.com',
  phone: { display: '+234 904 516 5367', href: 'tel:+2349045165367' },
  phones: [
    { label: 'Telephone', display: '+234 904 516 5367', href: 'tel:+2349045165367' },
    { label: 'Bookings & reservations', display: '+234 808 774 0394', href: 'tel:+2348087740394' },
    { label: 'Concierge', display: '+234 703 656 0630', href: 'tel:+2347036560630' },
    { label: 'Admin', display: '+234 703 656 0630', href: 'tel:+2347036560630' },
  ],
  instagram: 'https://www.instagram.com/giftedapartments?igsh=MXFtc29ldjFjaGdiOA==',
  tiktok: 'https://www.tiktok.com/@gifted_apartments?_t=ZM-8uGMEX3jFZd&_r=1',
  mapsDirections: 'https://maps.app.goo.gl/i5jUyDDH2vwQyN3q6',
}

export const whatsappLink = (
  message = 'Good day, I would like to book a stay with Gifted Homes and Apartments please.'
) => `https://wa.link/inwgi0?text=${encodeURIComponent(message)}`

export const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/properties', label: 'Properties' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/contactus', label: 'Contact' },
]

// Office hours in Lagos time (WAT). Sunday is closed.
export const officeHours: Record<number, [number, number] | null> = {
  0: null,
  1: [9, 18],
  2: [9, 18],
  3: [9, 18],
  4: [9, 18],
  5: [9, 18],
  6: [10, 16],
}
