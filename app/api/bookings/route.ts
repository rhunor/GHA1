// app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Define a proper type for bookings
interface Booking {
  id: string;
  propertyId: string;
  reference: string;
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  paymentStatus: string;
  createdAt: string;
}

// In a real application, you would connect to a database here
// This is a placeholder for demonstration purposes
const bookings: Booking[] = [];

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Basic validation
    if (!data.propertyId || !data.reference || !data.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // In a real application, you would save to your database
    // For example, with Prisma:
    // const booking = await prisma.booking.create({
    //   data: {
    //     propertyId: data.propertyId,
    //     reference: data.reference,
    //     name: data.name,
    //     email: data.email,
    //     phone: data.phone,
    //     checkIn: new Date(data.checkIn),
    //     checkOut: new Date(data.checkOut),
    //     guests: data.guests,
    //     paymentStatus: data.paymentStatus
    //   }
    // });
    
    // For demonstration, we'll just add to our in-memory array
    const booking: Booking = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString()
    };
    
    bookings.push(booking);
    
    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error('Error saving booking:', error);
    return NextResponse.json(
      { error: 'Failed to save booking' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // In a real application, you would fetch from your database
  // For demonstration, we return the in-memory array
  return NextResponse.json({ bookings });
}