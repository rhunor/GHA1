import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';

// GET all properties
export async function GET() {
  try {
    await dbConnect();
    
    const properties = await Property.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ properties });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

// POST - create a new property
export async function POST(request: NextRequest) {
  try {
    // Check authentication (optional, already checked in AdminLayout)
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
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
    
    // Create new property
    const property = await Property.create(data);
    
    return NextResponse.json(
      { success: true, property },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating property:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create property';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}