import mongoose, { Schema, models } from 'mongoose';

export interface IBooking {
  propertyId: mongoose.Types.ObjectId | string;
  reference: string;
  name: string;
  email: string;
  phone: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  isActive: boolean; // To mark cancellations or refunds
}

const bookingSchema = new Schema<IBooking>(
  {
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    reference: {
      type: String,
      required: true,
      unique: true, // Keep this or the schema.index(), but not both
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
      min: 1,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Create indexes for efficient querying, but only define each index once
bookingSchema.index({ propertyId: 1, checkIn: 1, checkOut: 1 });
// bookingSchema.index({ reference: 1 }); // Remove this line if you keep `unique: true`
bookingSchema.index({ paymentStatus: 1 });

// Check if the model already exists to prevent recompilation error
const Booking = models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;