import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import  connectToDB  from '@/lib/mongodb';
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

// Updates property availability for a booking
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
    // Get the signature from the headers
    const signature = request.headers.get('x-paystack-signature');
    
    // If no signature, reject the request
    if (!signature) {
      return NextResponse.json({ error: 'No signature provided' }, { status: 401 });
    }
    
    // Get the payload as text
    const payload = await request.text();
    
    // Verify the signature
    const secret = process.env.PAYSTACK_SECRET_KEY || '';
    const hash = crypto.createHmac('sha512', secret).update(payload).digest('hex');
    
    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    // Parse the payload
    const event = JSON.parse(payload);
    
    // Handle the event
    if (event.event === 'charge.success') {
      const reference = event.data.reference;
      
      await connectToDB();
      
      // Find the booking with this reference
      const booking = await Booking.findOne({ reference });
      
      if (!booking) {
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
      }
      
      // Update the booking status to completed
      booking.paymentStatus = 'completed';
      await booking.save();
      
      // Update property availability
      await updatePropertyAvailability(booking.propertyId, booking.checkIn, booking.checkOut);
      
      // Send notifications
      try {
        await sendBookingNotifications(booking);
      } catch (notificationError) {
        console.error('Error sending booking notifications:', notificationError);
      }
      
      return NextResponse.json({ success: true });
    }
    
    // For other events, just acknowledge receipt
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Error processing webhook' }, { status: 500 });
  }
}