//src/models/User.ts
import mongoose, { Schema, models } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
  email: string;
  password: string;
  name: string;
  role: string;
  isAdmin: boolean;
}

const userSchema = new Schema<IUser>(
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
    // Use type assertion instead of 'any' type
    next(error as Error);
  }
});

// Method to check password validity
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Check if the model already exists to prevent recompilation error
const User = models.User || mongoose.model<IUser>('User', userSchema);

export default User;