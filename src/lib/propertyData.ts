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
      thumbnail: "/property1/1.jpg",
      price: "₦200,000/night",
      location: "Lekki Phase 1, Lagos",
      images: [
        "/property1/1.jpg",
        "/property1/2.jpg",
        "/property1/3.jpg",
        "/property1/5.jpg",
        "/property1/6.jpg",
        "/property1/7.jpg",
        "/property1/8.jpg",
        "/property1/9.jpg",
        "/property1/10.jpg"
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
      thumbnail: "/property2/7.jpg",
      price: "₦160,000/night",
      location: "Ikate Lekki, Lagos",
      images: [
        "/property2/1.jpg",
        "/property2/2.jpg",
        "/property2/3.jpg",
        "/property2/4.jpg",
        "/property2/5.jpg",
        "/property2/6.jpg",
        "/property2/7.jpg",
        "/property2/8.jpg",
        "/property2/9.jpg",
        "/property2/10.jpg",
        "/property2/11.jpg",
        "/property2/12.jpg",
        "/property2/13.jpg"
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