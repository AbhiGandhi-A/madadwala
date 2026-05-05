import mongoose, { Schema, Document } from 'mongoose';
import type { User as UserType, UserRole, UserStatus } from '@/types';

export interface UserDocument extends Omit<UserType, 'createdAt' | 'updatedAt'>, Document {
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ['customer', 'provider', 'admin'],
      required: true,
      default: 'customer',
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'deleted'],
      default: 'active',
    },
    preferences: {
      notificationsEnabled: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
      marketingEmails: { type: Boolean, default: false },
      searchHistory: [String],
    },
    // Customer-specific fields
    savedProviders: {
      type: [String],
      default: [],
    },
    // Provider-specific fields
    serviceCategories: {
      type: [String],
      default: [],
    },
    experience: {
      type: String,
    },
    bio: {
      type: String,
    },
    location: {
      latitude: Number,
      longitude: Number,
      address: String,
      city: String,
      state: String,
      zipcode: String,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    idProofUrl: {
      type: String,
    },
    wallet: {
      balance: { type: Number, default: 0 },
      currency: { type: String, default: 'INR' },
      accountType: String,
    },
    availability: {
      workingDays: [String],
      startTime: String,
      endTime: String,
    },
    // Admin-specific fields
    permissions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Create index for email lookups
userSchema.index({ email: 1 });
userSchema.index({ uid: 1 });

const User = mongoose.models.User || mongoose.model<UserDocument>('User', userSchema);

export default User;
