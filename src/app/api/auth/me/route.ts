import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/lib/mongodb-service';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify JWT token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await getUserById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: user.id,
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            role: user.role,
            profileImage: user.profileImage,
            status: user.status,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API] Get current user error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user data',
      },
      { status: 500 }
    );
  }
}
