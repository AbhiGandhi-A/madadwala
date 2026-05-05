import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { createToken } from '@/lib/auth';
import bcryptjs from 'bcryptjs';

/**
 * Password-based login (for demo accounts)
 * POST /api/auth/login
 */
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const db = await connectDB();
    const usersCollection = db.collection('users');

    // Find user
    const user = await usersCollection.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = await createToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          _id: user._id.toString(),
          uid: user._id.toString(),
          email: user.email,
          displayName: user.displayName,
          role: user.role,
          phone: user.phone,
          address: user.address,
          status: user.status,
          verified: user.verified,
          rating: user.rating,
          reviewCount: user.reviewCount,
          serviceCategories: user.serviceCategories,
        },
      },
    });

    // Set HTTP-only cookie
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('[API] Login error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to login. Please try again.',
      },
      { status: 500 }
    );
  }
}
