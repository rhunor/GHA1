import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import { properties as staticProperties } from '@/lib/propertyData';

// This service will handle fetching properties from MongoDB or fallback to static data

export async function getProperties() {
  try {
    await dbConnect();
    
    // Check if there are any properties in the database
    const count = await Property.countDocuments();
    
    // If no properties in the database, return static data
    if (count === 0) {
      return staticProperties;
    }
    
    // Otherwise, fetch from MongoDB
    const properties = await Property.find({}).sort({ createdAt: -1 });
    
    // Convert MongoDB documents to plain objects
    return JSON.parse(JSON.stringify(properties));
  } catch (error) {
    console.error('Error fetching properties:', error);
    // Fallback to static data if there's an error
    return staticProperties;
  }
}

export async function getPropertyById(id: string | number) {
  try {
    await dbConnect();

    // Try to find by MongoDB ObjectId
    const property = await Property.findById(id);
    
    if (property) {
      return JSON.parse(JSON.stringify(property));
    }
    
    // If not found in MongoDB, check static data (for numerical IDs)
    if (typeof id === 'number' || !isNaN(Number(id))) {
      const numericId = Number(id);
      return staticProperties.find(p => p.id === numericId);
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching property by ID:', error);
    
    // Fallback to static data for numeric IDs
    if (typeof id === 'number' || !isNaN(Number(id))) {
      const numericId = Number(id);
      return staticProperties.find(p => p.id === numericId);
    }
    
    return null;
  }
}