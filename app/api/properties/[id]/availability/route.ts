import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Property from "@/models/Property";
import Booking from "@/models/Booking";

// Interfaces for type safety
interface Availability {
  date: string;
  isAvailable: boolean;
}

interface BookingType {
  checkIn: string;
  checkOut: string;
}

// interface PropertyType {
//   _id: string;
//   isBookable?: boolean;
//   availability?: Availability[];
// }

// Get all availability dates for a property
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDB();
    const propertyId = (await params).id;

    const property = await Property.findById(propertyId);
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const bookings = (await Booking.find({
      propertyId,
      isActive: true,
      paymentStatus: "completed",
    }).select("checkIn checkOut")) as BookingType[];

    const bookedDates: string[] = [];
    const propertyUnavailableDates: string[] = property.availability
      ? property.availability
          .filter((a: Availability) => !a.isAvailable)
          .map((a: Availability) => new Date(a.date).toISOString().split("T")[0])
      : [];

    for (const booking of bookings) {
      const start = new Date(booking.checkIn);
      const end = new Date(booking.checkOut);
      const current = new Date(start);
      while (current < end) {
        bookedDates.push(current.toISOString().split("T")[0]);
        current.setDate(current.getDate() + 1);
      }
    }

    const allUnavailableDates = [...new Set([...bookedDates, ...propertyUnavailableDates])];

    return NextResponse.json({
      propertyId,
      isBookable: property.isBookable ?? true,
      unavailableDates: allUnavailableDates,
    });
  } catch (error) {
    console.error("Error getting property availability:", error);
    return NextResponse.json({ error: "Failed to get property availability" }, { status: 500 });
  }
}

// Update property availability
export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    await connectToDB();
    const propertyId = context.params.id;
    const data = await request.json();

    const property = await Property.findById(propertyId);
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    if (data.isBookable !== undefined) {
      property.isBookable = Boolean(data.isBookable);
    }

    if (data.dates && Array.isArray(data.dates)) {
      // Use const instead of let since it's not reassigned
      const currentAvailability: Availability[] = property.availability || [];

      for (const dateInfo of data.dates) {
        if (!dateInfo.date) continue;

        const date = new Date(dateInfo.date);
        if (isNaN(date.getTime())) continue;

        const dateStr = date.toISOString().split("T")[0];
        const isAvailable = Boolean(dateInfo.isAvailable);

        const existingIndex = currentAvailability.findIndex(
          (a: Availability) => new Date(a.date).toISOString().split("T")[0] === dateStr
        );

        if (existingIndex >= 0) {
          currentAvailability[existingIndex].isAvailable = isAvailable;
        } else {
          currentAvailability.push({
            date: date.toISOString(),
            isAvailable,
          });
        }
      }

      property.availability = currentAvailability;
    }

    await property.save(); // Removed unnecessary type assertion since PropertyType matches

    return NextResponse.json({
      success: true,
      propertyId,
      isBookable: property.isBookable,
    });
  } catch (error) {
    console.error("Error updating property availability:", error);
    return NextResponse.json({ error: "Failed to update property availability" }, { status: 500 });
  }
}