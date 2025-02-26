// Save this file as directSeed.js in your project root
// Run with: node directSeed.js

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// MongoDB connection
const MONGODB_URI = "mongodb+srv://mongo1:N1r8qXbeEeViw93J@cluster0.0os4u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Global cache setup
const cached = { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) {
    console.log('Using existing MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('Connecting to MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
    console.log('MongoDB connected successfully');
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB connection error:', e);
    throw e;
  }

  return cached.conn;
}

// Define Property Schema
const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    features: {
      type: [String],
      required: true,
    },
    specifications: {
      bedrooms: {
        type: Number,
        required: true,
      },
      bathrooms: {
        type: Number,
        required: true,
      },
      size: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

// Define User Schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'admin',
    },
    isAdmin: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Add compare password method
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Define models
const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);

// Sample property data
const properties = [
  {
    id: 1,
    title: "2-bedroom Maisonette Lekki 1 (Ezrahaus)",
    description: `Immerse yourself in a world of refined elegance, where contemporary design meets effortless luxury. This meticulously crafted 2-bedroom maisonette offers a serene escape, combining sophisticated interiors with an ambiance of warmth and comfort. From the thoughtfully designed living spaces to the impeccable attention to detail, every element is curated to provide an unparalleled experience. Whether for business or leisure, this exceptional residence redefines upscale living with timeless style and modern convenience.

Reserve your stay and indulge in the finest luxury.`,
    thumbnail: "/property1/1.jpg",
    price: "₦200,000/night",
    location: "Lekki Phase 1, Lagos",
    images: [
      "/property1/1.jpg",
      "/property1/2.jpg",
      "/property1/3.jpg",
      "/property1/5.jpg",
      "/property1/6.jpg",
      "/property1/7.jpg",
      "/property1/8.jpg",
      "/property1/9.jpg",
      "/property1/10.jpg"
    ],
    features: [
      "Modern kitchen with high-end appliances",
      "Swimming pool",
      "Fast WiFi",
      "Surround sound system",
      "Smart home technology throughout",
      "Secure parking for multiple vehicles",
      "24/7 security",
      "Backup power supply",
      "essentials(toiletries)",
      "24/7 concierge service",
      "Clean and treated water"
    ],
    specifications: {
      bedrooms: 2,
      bathrooms: 3,
      size: "250 sq.m",
      type: "apartment"
    }
  },
  {
    id: 2,
    title: "3-bedroom terrace in Ikate, Lekki  (Meadowhaus)",
    description: `Discover contemporary living in this beautifully designed 3-bedroom apartment in the heart of Ikate Lekki. This sophisticated residence offers stunning city views and features premium finishes throughout. The open-concept layout creates a seamless flow between living spaces, perfect for both entertaining and comfortable daily living.`,
    thumbnail: "/property2/7.jpg",
    price: "₦160,000/night",
    location: "Ikate Lekki, Lagos",
    images: [
      "/property2/1.jpg",
      "/property2/2.jpg",
      "/property2/3.jpg",
      "/property2/4.jpg",
      "/property2/5.jpg",
      "/property2/6.jpg",
      "/property2/7.jpg",
      "/property2/8.jpg",
      "/property2/9.jpg",
      "/property2/10.jpg",
      "/property2/11.jpg",
      "/property2/12.jpg",
      "/property2/13.jpg"
    ],
    features: [
      "Floor-to-ceiling windows",
      "High-end kitchen appliances",
      "Surround sound system",
      "essentials(toiletries)",
      "24/7 concierge service",
      "Clean and treated water",
      "Secure parking space",
      "Fast WiFi"
    ],
    specifications: {
      bedrooms: 3,
      bathrooms: 3.5,
      size: "280 sq.m",
      type: "Apartment"
    }
  }
];

// Seeding function
async function seedDatabase() {
  try {
    await dbConnect();
    
    // Check if properties collection is empty
    const propertyCount = await Property.countDocuments();
    
    if (propertyCount === 0) {
      console.log('Seeding properties...');
      
      // Convert static properties to MongoDB schema format
      const propertiesToInsert = properties.map(property => {
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
  } finally {
    // Wait a moment for operations to complete before disconnecting
    setTimeout(() => {
      mongoose.disconnect()
        .then(() => console.log('MongoDB disconnected'))
        .catch(err => console.error('Error disconnecting from MongoDB:', err))
        .finally(() => process.exit(0));
    }, 1000);
  }
}

// Run the seed function
console.log('Starting database seeding...');
seedDatabase()
  .then(() => {
    console.log('Seeding completed successfully.');
    // The finally block handles disconnection and exit
  })
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  });