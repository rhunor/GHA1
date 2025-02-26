import dbConnect from './mongodb';
import Property from '@/models/Property';
import User from '@/models/User';
import { properties as staticProperties } from './propertyData';

// This script is for development use to seed the database with initial data

export async function seedDatabase() {
  try {
    await dbConnect();
    
    // Check if properties collection is empty
    const propertyCount = await Property.countDocuments();
    
    if (propertyCount === 0) {
      console.log('Seeding properties...');
      
      // Convert static properties to MongoDB schema format
      const propertiesToInsert = staticProperties.map(property => {
        // Use object rest to exclude the id property
        const { id, ...propertyData } = property;
        return propertyData;
      });
      
      await Property.insertMany(propertiesToInsert);
      console.log(`${propertiesToInsert.length} properties added.`);
    } else {
      console.log('Properties collection already seeded.');
    }
    
    // Check if admin user exists
    const adminExists = await User.findOne({ isAdmin: true });
    
    if (!adminExists) {
      console.log('Creating initial admin user...');
      
      await User.create({
        email: 'admin@giftedhomes.com',
        password: 'Admin123!', // This will be hashed by the pre-save hook
        name: 'Admin User',
        role: 'admin',
        isAdmin: true,
      });
      
      console.log('Admin user created.');
      console.log('Email: admin@giftedhomes.com');
      console.log('Password: Admin123!');
      console.log('Please change this password after first login.');
    } else {
      console.log('Admin user already exists.');
    }
    
    console.log('Database seeding completed.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}