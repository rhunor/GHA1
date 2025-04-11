// lib/propertyData.ts

export interface Property {
    id: number
    title: string
    description: string
    thumbnail: string
    price: string
    location: string
    images: string[]
    features: string[]
    airbnbLink?: string 
    specifications: {
      bedrooms: number
      bathrooms: number
      size: string
      type: string
    }
  }
  
  export const properties: Property[] = [
    {
      id: 1,
      title: "2-bedroom Maisonette Lekki 1 (Ezrahaus)",
      description: `Immerse yourself in a world of refined elegance, where contemporary design meets effortless luxury. This meticulously crafted 2-bedroom maisonette offers a serene escape, combining sophisticated interiors with an ambiance of warmth and comfort. From the thoughtfully designed living spaces to the impeccable attention to detail, every element is curated to provide an unparalleled experience. Whether for business or leisure, this exceptional residence redefines upscale living with timeless style and modern convenience.

Reserve your stay and indulge in the finest luxury.`,
      thumbnail: "/property1/1.webp",
      price: "₦200,000/night",
      location: "Lekki Phase 1, Lagos",
      images: [
        "/property1/1.webp",
        "/property1/2.webp",
        "/property1/3.webp",
        "/property1/5.webp",
        "/property1/6.webp",
        "/property1/7.webp",
        "/property1/8.webp",
        "/property1/9.webp",
        "/property1/10.webp"
      ],
      features: [
        "Modern kitchen with high-end appliances",
        "Swimming pool",
        "Fast WiFi",
        "Surround sound system",
        "Smart home technology throughout",
        "Secure parking for multiple vehicles",
        "24/7 security",
        "Backup power supply",
        "essentials(toiletries)",
        "24/7 concierge service",
        "Clean and treated water"
      ],
      airbnbLink: "https://www.airbnb.com/rooms/1312815567252380971?viralityEntryPoint=1&s=76",
      specifications: {
        bedrooms: 2,
        bathrooms: 3,
        size: "250 sq.m",
        type: "apartment"
      }
    },
    {
      id: 2,
      title: "3-bedroom terrace in Ikate, Lekki  (Meadowhaus)",
      description: `Discover contemporary living in this beautifully designed 3-bedroom apartment in the heart of Ikate Lekki. This sophisticated residence offers stunning city views and features premium finishes throughout. The open-concept layout creates a seamless flow between living spaces, perfect for both entertaining and comfortable daily living.`,
      thumbnail: "/property2/7.webp",
      price: "₦160,000/night",
      location: "Ikate Lekki, Lagos",
      images: [
        "/property2/1.webp",
        "/property2/2.webp",
        "/property2/3.webp",
        "/property2/4.webp",
        "/property2/5.webp",
        "/property2/6.webp",
        "/property2/7.webp",
        "/property2/8.webp",
        "/property2/9.webp",
        "/property2/10.webp",
        "/property2/11.webp",
        "/property2/12.webp",
        "/property2/13.webp"
      ],
      features: [
        "Floor-to-ceiling windows",
        "High-end kitchen appliances",
        "Surround sound system",
        "essentials(toiletries)",
        "24/7 concierge service",
        "Clean and treated water",
        "Secure parking space",
        "Fast WiFi"
      ],
      airbnbLink: "https://www.airbnb.com/rooms/1274410638357679006?viralityEntryPoint=1&s=76",
      specifications: {
        bedrooms: 3,
        bathrooms: 3.5,
        size: "280 sq.m",
        type: "Apartment"
      }
    }
  ]