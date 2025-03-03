import { NextRequest, NextResponse } from 'next/server';
import  connectToDB  from '@/lib/mongodb';
import Review from '@/models/Review';

// Get a single review by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();
    
    const review = await Review.findById(params.id);
    
    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ review });
  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json(
      { error: 'Failed to fetch review' },
      { status: 500 }
    );
  }
}

// Update a review (admin use)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();
    
    const data = await request.json();
    
    // Find the review
    const review = await Review.findById(params.id);
    
    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }
    
    // Update allowed fields
    if (data.status) {
      if (['pending', 'approved', 'rejected'].includes(data.status)) {
        review.status = data.status;
      } else {
        return NextResponse.json(
          { error: 'Invalid status value' },
          { status: 400 }
        );
      }
    }
    
    // Save the updated review
    await review.save();
    
    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  }
}

// Delete a review (admin use)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();
    
    const review = await Review.findByIdAndDelete(params.id);
    
    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}