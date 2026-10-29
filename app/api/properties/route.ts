//app/api/properties/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';

// Public pages ask for ?public=1 so the CDN can cache the listing; admin requests stay uncached
const PUBLIC_CACHE = 'public, s-maxage=60, stale-while-revalidate=600';

// GET all properties
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const properties = await Property.find({}).sort({ createdAt: -1 }).lean();
    
    const isPublic = request.nextUrl.searchParams.get('public') === '1';
    return NextResponse.json(
      { properties },
      isPublic ? { headers: { 'Cache-Control': PUBLIC_CACHE } } : undefined
    );
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