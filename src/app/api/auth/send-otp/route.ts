import { NextRequest, NextResponse } from 'next/server';
import { generateAndSaveOTP, getUserByEmail } from '@/lib/mongodb-service';
import { sendOTPEmail } from '@/lib/email-service';
import type { UserRole } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { email, role } = await req.json();

    // Validate input
    if (!email || !role) {
      return NextResponse.json(
        { success: false, error: 'Email and role are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['customer', 'provider', 'admin'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = await generateAndSaveOTP(email);

    // Send OTP email
    await sendOTPEmail(email, otp);

    return NextResponse.json(
      {
        success: true,
        message: 'OTP sent successfully',
        data: {
          email,
          expiryTime: 30, // 30 minutes
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API] Send OTP error:', error);

    if (error instanceof Error) {
      if (error.message.includes('SMTP') || error.message.includes('Gmail')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Email service is not configured. Please try again later.',
          },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send OTP. Please try again.',
      },
      { status: 500 }
    );
  }
}
