import { connectDB } from './mongodb';
import User, { UserDocument } from './models/User';
import OTP, { OTPDocument } from './models/OTP';
import type { User as UserType, UserRole } from '@/types';
import crypto from 'crypto';

/**
 * USER OPERATIONS
 */

export async function getUserById(uid: string): Promise<(UserType & { id: string }) | null> {
  try {
    await connectDB();
    const user = await User.findOne({ uid }).lean();
    if (user) {
      const { _id, ...userData } = user as any;
      return { id: _id.toString(), ...userData };
    }
    return null;
  } catch (error) {
    console.error('[MongoDB] Error fetching user by ID:', error);
    throw error;
  }
}

export async function getUserByEmail(email: string): Promise<(UserType & { id: string }) | null> {
  try {
    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() }).lean();
    if (user) {
      const { _id, ...userData } = user as any;
      return { id: _id.toString(), ...userData };
    }
    return null;
  } catch (error) {
    console.error('[MongoDB] Error fetching user by email:', error);
    throw error;
  }
}

export async function createUser(
  uid: string,
  userData: Partial<UserType> & { email: string }
): Promise<UserType & { id: string }> {
  try {
    await connectDB();

    const existingUser = await User.findOne({
      $or: [{ uid }, { email: userData.email.toLowerCase() }],
    });

    if (existingUser) {
      throw new Error('User with this email or UID already exists');
    }

    const newUser = new User({
      uid,
      email: userData.email.toLowerCase(),
      displayName: userData.displayName || userData.email.split('@')[0],
      role: userData.role || 'customer',
      status: 'active',
      ...userData,
    });

    await newUser.save();
    const savedUser = newUser.toObject();
    const { _id, ...userWithoutId } = savedUser;
    return { id: _id.toString(), ...userWithoutId };
  } catch (error) {
    console.error('[MongoDB] Error creating user:', error);
    throw error;
  }
}

export async function updateUser(
  uid: string,
  updateData: Partial<UserType>
): Promise<UserType & { id: string }> {
  try {
    await connectDB();

    const user = await User.findOneAndUpdate(
      { uid },
      { ...updateData, updatedAt: new Date() },
      { new: true, lean: true }
    );

    if (!user) {
      throw new Error('User not found');
    }

    const { _id, ...userData } = user as any;
    return { id: _id.toString(), ...userData };
  } catch (error) {
    console.error('[MongoDB] Error updating user:', error);
    throw error;
  }
}

export async function deleteUser(uid: string): Promise<void> {
  try {
    await connectDB();
    const result = await User.deleteOne({ uid });
    if (result.deletedCount === 0) {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('[MongoDB] Error deleting user:', error);
    throw error;
  }
}

/**
 * OTP OPERATIONS
 */

export async function generateAndSaveOTP(email: string, otpLength: number = 6): Promise<string> {
  try {
    await connectDB();

    // Generate random OTP
    const otp = crypto.randomInt(0, Math.pow(10, otpLength)).toString().padStart(otpLength, '0');

    // Set expiry to 30 minutes from now
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email: email.toLowerCase() });

    // Create new OTP
    const otpDoc = new OTP({
      email: email.toLowerCase(),
      otp,
      expiresAt,
    });

    await otpDoc.save();
    console.log(`[MongoDB] OTP generated for ${email}`);

    return otp;
  } catch (error) {
    console.error('[MongoDB] Error generating OTP:', error);
    throw error;
  }
}

export async function verifyOTP(email: string, otp: string): Promise<boolean> {
  try {
    await connectDB();

    const otpDoc = await OTP.findOne({
      email: email.toLowerCase(),
      otp,
      expiresAt: { $gt: new Date() },
    });

    if (!otpDoc) {
      return false;
    }

    // Check attempts
    if (otpDoc.attempts >= otpDoc.maxAttempts) {
      await OTP.deleteOne({ _id: otpDoc._id });
      throw new Error('Too many incorrect attempts');
    }

    // Delete OTP after verification
    await OTP.deleteOne({ _id: otpDoc._id });
    return true;
  } catch (error) {
    console.error('[MongoDB] Error verifying OTP:', error);
    throw error;
  }
}

export async function incrementOTPAttempts(email: string): Promise<void> {
  try {
    await connectDB();

    await OTP.updateOne(
      { email: email.toLowerCase() },
      { $inc: { attempts: 1 } }
    );
  } catch (error) {
    console.error('[MongoDB] Error incrementing OTP attempts:', error);
    throw error;
  }
}

/**
 * BULK OPERATIONS
 */

export async function getAllUsers(role?: UserRole): Promise<(UserType & { id: string })[]> {
  try {
    await connectDB();

    const query = role ? { role } : {};
    const users = await User.find(query).lean();

    return users.map((user: any) => {
      const { _id, ...userData } = user;
      return { id: _id.toString(), ...userData };
    });
  } catch (error) {
    console.error('[MongoDB] Error fetching all users:', error);
    throw error;
  }
}

export async function getUsersByIds(uids: string[]): Promise<(UserType & { id: string })[]> {
  try {
    await connectDB();

    const users = await User.find({ uid: { $in: uids } }).lean();

    return users.map((user: any) => {
      const { _id, ...userData } = user;
      return { id: _id.toString(), ...userData };
    });
  } catch (error) {
    console.error('[MongoDB] Error fetching users by IDs:', error);
    throw error;
  }
}

/**
 * SEARCH OPERATIONS
 */

export async function searchProviders(searchTerm: string): Promise<(UserType & { id: string })[]> {
  try {
    await connectDB();

    const users = await User.find({
      role: 'provider',
      $or: [
        { displayName: { $regex: searchTerm, $options: 'i' } },
        { bio: { $regex: searchTerm, $options: 'i' } },
        { serviceCategories: { $in: [new RegExp(searchTerm, 'i')] } },
      ],
    }).lean();

    return users.map((user: any) => {
      const { _id, ...userData } = user;
      return { id: _id.toString(), ...userData };
    });
  } catch (error) {
    console.error('[MongoDB] Error searching providers:', error);
    throw error;
  }
}
