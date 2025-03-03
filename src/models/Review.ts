//src/models/Review.ts
import mongoose, { Schema, models } from 'mongoose';

export interface IReview {
  propertyId: mongoose.Types.ObjectId | string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  bookingReference?: string;  // Make sure not to add index:true here
  status: 'pending' | 'approved' | 'rejected';
  isVerifiedStay: boolean;
}

const reviewSchema = new Schema<IReview>(
  {
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    bookingReference: {
      type: String,
      required: false,
      // DO NOT add index:true here
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    isVerifiedStay: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Define indexes in one place
reviewSchema.index({ propertyId: 1 });
reviewSchema.index({ status: 1 });
reviewSchema.index({ email: 1 });
// Only add this if you need it, and only in one place
// reviewSchema.index({ bookingReference: 1 });

// Check if the model already exists to prevent recompilation error
const Review = models.Review || mongoose.model<IReview>('Review', reviewSchema);

export default Review;