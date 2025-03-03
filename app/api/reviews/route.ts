import { NextRequest, NextResponse } from 'next/server';
import  connectToDB  from '@/lib/mongodb';
import Review from '@/models/Review';
import Booking from '@/models/Booking';
import Property from '@/models/Property';

// Get reviews (filtered by property or status)
export async function GET(request: NextRequest) {
  try {
    await connectToDB();
    
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const query: any = {};
    
    // Filter by property if provided
    if (propertyId) {
      query.propertyId = propertyId;
    }
    
    // Filter by status if provided, default to approved for public routes
    if (status) {
      query.status = status;
    } else {
      query.status = 'approved'; // Only return approved reviews by default
    }
    
    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);
    
    // Calculate average rating per property
    let avgRating = null;
    if (propertyId) {
      const result = await Review.aggregate([
        { $match: { propertyId, status: 'approved' } },
        { $group: { _id: null, avgRating: { $avg: '$rating' } } }
      ]);
      
      if (result.length > 0) {
        avgRating = parseFloat(result[0].avgRating.toFixed(1));
      }
    }
    
    return NextResponse.json({ 
      reviews,
      avgRating,
      total: reviews.length 
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// Create a new review
export async function POST(request: NextRequest) {
  try {
    await connectToDB();
    
    const data = await request.json();
    
    // Basic validation
    if (!data.propertyId || !data.name || !data.email || !data.rating || !data.comment) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate rating
    const rating = Number(data.rating);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }
    
    // Check if property exists
    const property = await Property.findById(data.propertyId);
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }
    
    // If booking reference is provided, verify it
    let isVerifiedStay = false;
    
    if (data.bookingReference) {
      const booking = await Booking.findOne({
        reference: data.bookingReference,
        email: data.email,
        propertyId: data.propertyId,
        paymentStatus: 'completed'
      });
      
      if (booking) {
        isVerifiedStay = true;
      }
    }
    
    // Create the review
    const review = await Review.create({
      propertyId: data.propertyId,
      name: data.name,
      email: data.email,
      rating,
      comment: data.comment,
      bookingReference: data.bookingReference,
      status: isVerifiedStay ? 'approved' : 'pending', // Auto-approve verified stays
      isVerifiedStay
    });
    
    return NextResponse.json({ 
      success: true, 
      review,
      message: isVerifiedStay 
        ? 'Thank you for your review! It has been published.' 
        : 'Thank you for your review! It will be published after moderation.'
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}