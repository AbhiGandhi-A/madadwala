import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully',
      },
      { status: 200 }
    );

    // Clear the auth token cookie
    response.cookies.delete('auth-token');

    return response;
  } catch (error) {
    console.error('[API] Logout error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to logout',
      },
      { status: 500 }
    );
  }
}
