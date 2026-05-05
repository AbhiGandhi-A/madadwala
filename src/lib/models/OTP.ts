import mongoose, { Schema, Document } from 'mongoose';

export interface OTPDocument extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  updatedAt: Date;
}

const otpSchema = new Schema<OTPDocument>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0, // MongoDB will delete document when expiresAt passes
    },
    attempts: {
      type: Number,
      default: 0,
    },
    maxAttempts: {
      type: Number,
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for automatic deletion
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTP = mongoose.models.OTP || mongoose.model<OTPDocument>('OTP', otpSchema);

export default OTP;
