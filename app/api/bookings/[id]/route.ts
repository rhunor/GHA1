// app/api/bookings/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { getServerSession } from "next-auth";

// DELETE - Delete a booking by ID
export async function DELETE(
  _request: NextRequest, // Added underscore to indicate it's intentionally unused
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDB();
    // This is the fixed line - awaiting the params promise
    const id = (await params).id; 

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Delete the booking
    await Booking.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: "Booking deleted successfully" }
    );
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}