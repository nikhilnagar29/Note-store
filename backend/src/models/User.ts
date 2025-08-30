import { Document, Schema, model, models } from 'mongoose';

// Define interface for User document
export interface IUser extends Document {
  email: string;
  password?: string; // Optional: only for non-Google users (if using password)
  googleId?: string; // For Google OAuth users
  otp?: string; // To store hashed OTP temporarily
  otpExpires?: Date; // OTP expiry time
  isVerified: boolean; // Email verification status
  name?: string; // Optional: can be derived from Google profile
  notes: Schema.Types.ObjectId[]; // Array of references to Note documents
  createdAt: Date;
  updatedAt: Date;
}

// Define User Schema
const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false, // Never return password by default
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allows nulls but ensures uniqueness if present
  },
  otp: {
    type: String,
    select: false,
  },
  otpExpires: {
    type: Date,
    select: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
  },
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Note',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware: Update `updatedAt` on save
UserSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Prevent duplicate emails or googleId
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ googleId: 1 }, { unique: true, sparse: true });

const User = models.User || model<IUser>('User', UserSchema);

export default User;