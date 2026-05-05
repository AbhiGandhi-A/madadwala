import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP, incrementOTPAttempts, getUserByEmail, createUser } from '@/lib/mongodb-service';
import { sendWelcomeEmail } from '@/lib/email-service';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import type { UserRole } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(req: NextRequest) {
  try {
    const { email, otp, role } = await req.json();

    // Validate input
    if (!email || !otp || !role) {
      return NextResponse.json(
        { success: false, error: 'Email, OTP, and role are required' },
        { status: 400 }
      );
    }

    // Verify OTP
    const isValid = await verifyOTP(email, otp);

    if (!isValid) {
      await incrementOTPAttempts(email);
      return NextResponse.json(
        { success: false, error: 'Invalid or expired OTP' },
        { status: 401 }
      );
    }

    // Check if user exists
    let user = await getUserByEmail(email);

    // If user doesn't exist, create them
    if (!user) {
      const uid = crypto.randomUUID();
      user = await createUser(uid, {
        email,
        displayName: email.split('@')[0],
        role: role as UserRole,
      });

      // Send welcome email
      try {
        await sendWelcomeEmail(email, user.displayName);
      } catch (error) {
        console.warn('[API] Could not send welcome email:', error);
        // Continue even if welcome email fails
      }
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user.uid,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Create response with token in cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            role: user.role,
          },
          token,
        },
      },
      { status: 200 }
    );

    // Set JWT token in httpOnly cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('[API] Verify OTP error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to verify OTP. Please try again.',
      },
      { status: 500 }
    );
  }
}
