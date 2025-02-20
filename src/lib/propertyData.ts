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
      description: `Experience luxury living at its finest in this stunning 5-bedroom villa located in the prestigious Lekki Phase 1. This meticulously designed home features spacious living areas with high ceilings and natural light throughout. The property offers an perfect blend of comfort and sophistication, making it an ideal choice for those seeking a premium lifestyle in Lagos' most sought-after neighborhood.`,
      thumbnail: "/property1/6.jpg",
      price: "$1,200,000",
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
        "Private swimming pool",
        "Landscaped garden",
        "Ocean views from multiple balconies",
        "Smart home technology throughout",
        "Secure parking for multiple vehicles",
        "24/7 security",
        "Backup power supply"
      ],
      specifications: {
        bedrooms: 5,
        bathrooms: 6,
        size: "750 sq.m",
        type: "Villa"
      }
    },
    {
      id: 2,
      title: "3-bedroom terrace in Ikate, Lekki  (Meadowhaus)",
      description: `Discover contemporary living in this beautifully designed 3-bedroom apartment in the heart of Victoria Island. This sophisticated residence offers stunning city views and features premium finishes throughout. The open-concept layout creates a seamless flow between living spaces, perfect for both entertaining and comfortable daily living.`,
      thumbnail: "/property2/7.jpg",
      price: "$800,000",
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
        "Built-in wardrobes",
        "Central air conditioning",
        "24/7 concierge service",
        "Gymnasium access",
        "Secure parking space",
        "Rooftop lounge access"
      ],
      specifications: {
        bedrooms: 3,
        bathrooms: 3.5,
        size: "280 sq.m",
        type: "Apartment"
      }
    }
  ]