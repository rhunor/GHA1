import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// This route is for initial setup only and should be disabled in production
// It creates the first admin user if none exists

export async function POST(request: NextRequest) {
  try {
    // Only allow this in development mode
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'This endpoint is disabled in production' },
        { status: 403 }
      );
    }

    await dbConnect();
    
    // Check if admin user already exists
    const adminExists = await User.findOne({ isAdmin: true });
    
    if (adminExists) {
      return NextResponse.json(
        { message: 'Admin user already exists' },
        { status: 400 }
      );
    }
    
    const data = await request.json();
    
    // Basic validation
    if (!data.email || !data.password || !data.name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create admin user
    const adminUser = await User.create({
      email: data.email,
      password: data.password, // Will be hashed by the pre-save hook
      name: data.name,
      role: 'admin',
      isAdmin: true,
    });
    
    // Remove sensitive data
    const user = {
      id: adminUser._id,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role,
    };
    
    return NextResponse.json(
      { success: true, message: 'Admin user created successfully', user },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating admin user:', error);
    
    // Handle duplicate email error using type narrowing
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to create admin user';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}