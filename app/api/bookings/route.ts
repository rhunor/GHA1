import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Property from '@/models/Property';
import { sendBookingNotifications } from '@/lib/notifications';

// Helper to generate dates between start and end
function getDatesInRange(startDate: Date, endDate: Date) {
  const dates = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
}

// Check if a property is available for the given date range
async function isPropertyAvailable(propertyId: string, checkIn: Date, checkOut: Date) {
  // Get the property to check its availability
  const property = await Property.findById(propertyId);
  if (!property || !property.isBookable) {
    return false;
  }
  
  // Check for existing bookings that overlap with the requested dates
  const existingBooking = await Booking.findOne({
    propertyId,
    isActive: true,
    paymentStatus: 'completed',
    $or: [
      // New booking starts during an existing booking
      { 
        checkIn: { $lte: checkOut },
        checkOut: { $gte: checkIn }
      }
    ]
  });
  
  // If there's an overlapping booking, the property is not available
  if (existingBooking) {
    return false;
  }
  
  // Check the property's availability array for specific dates marked as unavailable
  if (property.availability && property.availability.length > 0) {
    const datesInRange = getDatesInRange(checkIn, checkOut);
    
    for (const date of datesInRange) {
      const dateStr = date.toISOString().split('T')[0];
      
      // Find if this date is marked as unavailable
      interface Availability {
        date: Date;
        isAvailable: boolean;
      }

      interface Query {
        propertyId?: string;
        paymentStatus?: string;
      }
      interface BookingData {
        propertyId: string;
        reference: string;
        name: string;
        email: string;
        phone: string;
        checkIn: Date;
        checkOut: Date;
        guests: number;
        paymentStatus: string;
        isActive: boolean;
      }

      interface PropertyData {
        _id: string;
        isBookable: boolean;
        availability: Availability[];
      }

      const dateAvailability: Availability | undefined = property.availability.find(
        (a: Availability) => new Date(a.date).toISOString().split('T')[0] === dateStr
      );
      
      if (dateAvailability && !dateAvailability.isAvailable) {
        return false;
      }
    }
  }
  
  return true;
}

// Mark dates as unavailable after a successful booking
async function updatePropertyAvailability(propertyId: string, checkIn: Date, checkOut: Date) {
  try {
    const property = await Property.findById(propertyId);
    if (!property) {
      throw new Error('Property not found');
    }
    
    const datesInRange = getDatesInRange(checkIn, checkOut);
    const updatedAvailability = [...(property.availability || [])];
    
    // For each date in the booking range
    for (const date of datesInRange) {
      const dateStr = date.toISOString().split('T')[0];
      
      // Check if this date already exists in the availability array
      const existingIndex = updatedAvailability.findIndex(
        a => new Date(a.date).toISOString().split('T')[0] === dateStr
      );
      
      if (existingIndex >= 0) {
        // Update existing date
        updatedAvailability[existingIndex].isAvailable = false;
      } else {
        // Add new date
        updatedAvailability.push({
          date,
          isAvailable: false
        });
      }
    }
    
    // Update the property with the new availability
    await Property.findByIdAndUpdate(propertyId, {
      availability: updatedAvailability
    });
    
    return true;
  } catch (error) {
    console.error('Error updating property availability:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDB();
    
    const data = await request.json();
    
    // Basic validation
    if (!data.propertyId || !data.reference || !data.email || !data.checkIn || !data.checkOut) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Convert string dates to Date objects
    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);
    
    // Validate dates
    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime()) || checkIn >= checkOut) {
      return NextResponse.json(
        { error: 'Invalid date range' },
        { status: 400 }
      );
    }
    
    // Check availability for completed bookings only
    if (data.paymentStatus === 'completed') {
      const isAvailable = await isPropertyAvailable(data.propertyId, checkIn, checkOut);
      
      if (!isAvailable) {
        return NextResponse.json(
          { error: 'The property is not available for the selected dates' },
          { status: 409 }
        );
      }
    }
    
    // Create booking
    const booking = await Booking.create({
      propertyId: data.propertyId,
      reference: data.reference,
      name: data.name,
      email: data.email,
      phone: data.phone,
      checkIn,
      checkOut,
      guests: data.guests,
      paymentStatus: data.paymentStatus,
      isActive: true
    });
    
    // For completed bookings, update property availability
    if (data.paymentStatus === 'completed') {
      await updatePropertyAvailability(data.propertyId, checkIn, checkOut);
      
      // Send notifications about the new booking
      try {
        await sendBookingNotifications(booking);
      } catch (notificationError) {
        console.error('Error sending booking notifications:', notificationError);
      }
    }
    
    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error('Error saving booking:', error);
    return NextResponse.json(
      { error: 'Failed to save booking' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDB();
    
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    const status = searchParams.get('status');
    
    const query: any = {};
    
    if (propertyId) {
      query.propertyId = propertyId;
    }
    
    if (status) {
      query.paymentStatus = status;
    }
    
    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// Endpoint to check availability for dates
export async function PUT(request: NextRequest) {
  try {
    await connectToDB();
    
    const data = await request.json();
    
    // Basic validation
    if (!data.propertyId || !data.checkIn || !data.checkOut) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Convert string dates to Date objects
    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);
    
    // Validate dates
    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime()) || checkIn >= checkOut) {
      return NextResponse.json(
        { error: 'Invalid date range' },
        { status: 400 }
      );
    }
    
    const isAvailable = await isPropertyAvailable(data.propertyId, checkIn, checkOut);
    
    return NextResponse.json({ 
      available: isAvailable,
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString()
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}