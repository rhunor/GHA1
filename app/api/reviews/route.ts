//app/api/reviews/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Review from "@/models/Review";
import Booking from "@/models/Booking";
import Property from "@/models/Property";

// Define query type
interface ReviewQuery {
  propertyId?: string;
  status?: string;
}

// Get reviews (filtered by property or status)
// In app/api/reviews/route.ts 
// The issue might be that the admin panel should see ALL reviews, not just approved ones

// Modify the GET function in api/reviews/route.ts to show all reviews to admin
export async function GET(request: NextRequest) {
    try {
      await connectToDB();
  
      const { searchParams } = new URL(request.url);
      const propertyId = searchParams.get("propertyId");
      const status = searchParams.get("status");
      const limit = parseInt(searchParams.get("limit") || "10");
      const isAdmin = searchParams.get("isAdmin") === "true";
  
      const query: ReviewQuery = {};
  
      if (propertyId) {
        query.propertyId = propertyId;
      }
  
      if (status) {
        query.status = status;
      } else if (!isAdmin) {
        // Only filter for approved reviews if not an admin request
        query.status = "approved"; 
      }
      // If isAdmin=true, we don't add a status filter, showing all reviews
  
      const reviews = await Review.find(query)
        .sort({ createdAt: -1 })
        .limit(limit);
  
      let avgRating = null;
      if (propertyId) {
        const result = await Review.aggregate([
          { $match: { propertyId, status: "approved" } },
          { $group: { _id: null, avgRating: { $avg: "$rating" } } },
        ]);
  
        if (result.length > 0) {
          avgRating = parseFloat(result[0].avgRating.toFixed(1));
        }
      }
  
      return NextResponse.json({
        reviews,
        avgRating,
        total: reviews.length,
      });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }
  }

// Create a new review (unchanged since no errors reported here)
export async function POST(request: NextRequest) {
  try {
    await connectToDB();

    const data = await request.json();

    if (!data.propertyId || !data.name || !data.email || !data.rating || !data.comment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const rating = Number(data.rating);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const property = await Property.findById(data.propertyId);
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    let isVerifiedStay = false;

    if (data.bookingReference) {
      const booking = await Booking.findOne({
        reference: data.bookingReference,
        email: data.email,
        propertyId: data.propertyId,
        paymentStatus: "completed",
      });

      if (booking) {
        isVerifiedStay = true;
      }
    }

    const review = await Review.create({
      propertyId: data.propertyId,
      name: data.name,
      email: data.email,
      rating,
      comment: data.comment,
      bookingReference: data.bookingReference,
      status: isVerifiedStay ? "approved" : "pending",
      isVerifiedStay,
    });

    return NextResponse.json({
      success: true,
      review,
      message: isVerifiedStay
        ? "Thank you for your review! It has been published."
        : "Thank you for your review! It will be published after moderation.",
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}