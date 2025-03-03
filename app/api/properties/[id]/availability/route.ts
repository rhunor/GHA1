//app/api/properties/[id]/availability/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import Property from '@/models/Property';
import Booking from '@/models/Booking';

// Interfaces for type safety
interface Availability {
    date: string;
    isAvailable: boolean;
}

interface BookingType {
    checkIn: string;
    checkOut: string;
}

interface PropertyType {
    _id: string;
    isBookable?: boolean;
    availability?: Availability[];
}

// Get all availability dates for a property
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    
    // Access the ID directly from context
    const propertyId = (await params).id;
    
    // Get the property
    const property = await Property.findById(propertyId);
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }
    
    // Get all active bookings for this property
    const bookings = await Booking.find({
      propertyId,
      isActive: true,
      paymentStatus: 'completed'
    }).select('checkIn checkOut') as BookingType[];
    
    // Format the output
    const bookedDates: string[] = [];
    
    // Add dates from the property availability array
    const propertyUnavailableDates: string[] = property.availability
        ? property.availability
                .filter((a: Availability) => !a.isAvailable)
                .map((a: Availability) => new Date(a.date).toISOString().split('T')[0])
        : [];
    
    // Add dates from existing bookings
    for (const booking of bookings) {
      const start = new Date(booking.checkIn);
      const end = new Date(booking.checkOut);
      
      // For each day in the booking, add to the array
      const current = new Date(start);
      while (current < end) {
        bookedDates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
      }
    }
    
    // Combine all unavailable dates and remove duplicates
    const allUnavailableDates = [...new Set([...bookedDates, ...propertyUnavailableDates])];
    
    return NextResponse.json({
      propertyId,
      isBookable: property.isBookable ?? true,
      unavailableDates: allUnavailableDates
    });
  } catch (error) {
    console.error('Error getting property availability:', error);
    return NextResponse.json(
      { error: 'Failed to get property availability' },
      { status: 500 }
    );
  }
}

// Update property availability
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectToDB();
    
    // Access the ID directly from context
    const propertyId = context.params.id;
    const data = await request.json();
    
    // Make sure property exists
    const property = await Property.findById(propertyId) as PropertyType;
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }
    
    // Update property bookable status if provided
    if (data.isBookable !== undefined) {
      property.isBookable = Boolean(data.isBookable);
    }
    
    // Update availability dates if provided
    if (data.dates && Array.isArray(data.dates)) {
      // Get the current availability array
      let currentAvailability: Availability[] = property.availability || [];
      
      // Process each date
      for (const dateInfo of data.dates) {
        if (!dateInfo.date) continue;
        
        const date = new Date(dateInfo.date);
        
        // Skip invalid dates
        if (isNaN(date.getTime())) continue;
        
        const dateStr = date.toISOString().split('T')[0];
        const isAvailable = Boolean(dateInfo.isAvailable);
        
        // Find if this date already exists in the availability array
        const existingIndex = currentAvailability.findIndex(
          (a: Availability) => new Date(a.date).toISOString().split('T')[0] === dateStr
        );
        
        if (existingIndex >= 0) {
          // Update existing date
          currentAvailability[existingIndex].isAvailable = isAvailable;
        } else {
          // Add new date
          currentAvailability.push({
            date: date.toISOString(),
            isAvailable
          });
        }
      }
      
      property.availability = currentAvailability;
    }
    
    // Save the updated property
    await (property as any).save();
    
    return NextResponse.json({
      success: true,
      propertyId,
      isBookable: property.isBookable
    });
  } catch (error) {
    console.error('Error updating property availability:', error);
    return NextResponse.json(
      { error: 'Failed to update property availability' },
      { status: 500 }
    );
  }
}