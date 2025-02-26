// app/api/properties/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import mongoose from 'mongoose';
import { properties as staticProperties } from '@/lib/propertyData';

// Helper function to check if a string is a valid ObjectId
const isValidObjectId = (id: string) => {
 return mongoose.Types.ObjectId.isValid(id);
};

// GET a single property by ID
export async function GET(
 request: NextRequest,
 { params }: { params: { id: string } }
) {
 const { id } = params;

 try {
   // Check if it's a numeric ID (from static data)
   if (!isNaN(Number(id))) {
     // This is probably a static property ID
     const numericId = Number(id);
     const staticProperty = staticProperties.find(p => p.id === numericId);
     
     if (staticProperty) {
       return NextResponse.json({ property: staticProperty });
     }
   }
   
   // If it's not a numeric ID or static property not found, try MongoDB
   // Only validate MongoDB ObjectId format for non-numeric IDs
   if (isNaN(Number(id)) && !isValidObjectId(id)) {
     return NextResponse.json(
       { error: 'Invalid property ID format' },
       { status: 400 }
     );
   }
   
   await dbConnect();
   
   try {
     const property = await Property.findById(id);
     
     if (property) {
       return NextResponse.json({ property });
     }
   } catch (err) {
     console.error("MongoDB query error:", err);
     // Continue to fallback for any MongoDB errors
   }
   
   // If we reach here, property wasn't found in MongoDB 
   // Try one more time with static properties as fallback
   if (!isNaN(Number(id))) {
     const numericId = Number(id);
     const staticProperty = staticProperties.find(p => p.id === numericId);
     
     if (staticProperty) {
       return NextResponse.json({ property: staticProperty });
     }
   }
   
   // If we reach here, property wasn't found anywhere
   return NextResponse.json(
     { error: 'Property not found' },
     { status: 404 }
   );
 } catch (error) {
   console.error('Error fetching property:', error);
   return NextResponse.json(
     { error: 'Failed to fetch property' },
     { status: 500 }
   );
 }
}

// PUT - update a property
export async function PUT(
 request: NextRequest,
 { params }: { params: { id: string } }
) {
 const { id } = params;

 try {
   // Check authentication (optional, already checked in AdminLayout)
   const session = await getServerSession();
   if (!session) {
     return NextResponse.json(
       { error: 'Unauthorized' },
       { status: 401 }
     );
   }
   
   if (!isValidObjectId(id)) {
     return NextResponse.json(
       { error: 'Invalid property ID' },
       { status: 400 }
     );
   }
   
   await dbConnect();
   
   const data = await request.json();
   
   // Basic validation
   if (!data.title || !data.description || !data.price || !data.location) {
     return NextResponse.json(
       { error: 'Missing required fields' },
       { status: 400 }
     );
   }
   
   // Update property
   const property = await Property.findByIdAndUpdate(
     id,
     data,
     { new: true, runValidators: true }
   );
   
   if (!property) {
     return NextResponse.json(
       { error: 'Property not found' },
       { status: 404 }
     );
   }
   
   return NextResponse.json({ success: true, property });
 } catch (error) {
   console.error('Error updating property:', error);
   const errorMessage = error instanceof Error ? error.message : 'Failed to update property';
   return NextResponse.json(
     { error: errorMessage },
     { status: 500 }
   );
 }
}

// DELETE a property
export async function DELETE(
 request: NextRequest,
 { params }: { params: { id: string } }
) {
 const { id } = params;

 try {
   // Check authentication (optional, already checked in AdminLayout)
   const session = await getServerSession();
   if (!session) {
     return NextResponse.json(
       { error: 'Unauthorized' },
       { status: 401 }
     );
   }
   
   if (!isValidObjectId(id)) {
     return NextResponse.json(
       { error: 'Invalid property ID' },
       { status: 400 }
     );
   }
   
   await dbConnect();
   
   const property = await Property.findByIdAndDelete(id);
   
   if (!property) {
     return NextResponse.json(
       { error: 'Property not found' },
       { status: 404 }
     );
   }
   
   return NextResponse.json(
     { success: true, message: 'Property deleted successfully' }
   );
 } catch (error) {
   console.error('Error deleting property:', error);
   return NextResponse.json(
     { error: 'Failed to delete property' },
     { status: 500 }
   );
 }
}