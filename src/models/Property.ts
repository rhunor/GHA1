//src/models/Property.ts
import mongoose, { Schema, models } from 'mongoose';

export interface Availability {
  date: Date;
  isAvailable: boolean;
}

export interface IProperty {
  title: string;
  description: string;
  thumbnail: string;
  price: string;
  location: string;
  images: string[];
  features: string[];
  airbnbLink?: string;
  specifications: {
    bedrooms: number;
    bathrooms: number;
    size: string;
    type: string;
  };
  availability?: Availability[]; // New field to track booked dates
  isBookable?: boolean; // Can be used to temporarily disable bookings
}

const availabilitySchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
});

const propertySchema = new Schema<IProperty>(
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
    airbnbLink: {
      type: String,
      required: false,
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
    availability: {
      type: [availabilitySchema],
      default: [],
    },
    isBookable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Check if the model already exists to prevent recompilation error
const Property = models.Property || mongoose.model<IProperty>('Property', propertySchema);

export default Property;