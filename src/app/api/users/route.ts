import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import type { User } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const db = await connectDB();
    const usersCollection = db.collection('users');
    
    const role = request.nextUrl.searchParams.get('role');
    const query = role ? { role } : {};
    
    const users = await usersCollection
      .find(query)
      .project({ password: 0 })
      .toArray();
    
    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('[API] Get users error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
