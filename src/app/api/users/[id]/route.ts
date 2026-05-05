import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectDB();
    const usersCollection = db.collection('users');
    
    const body = await request.json();
    const uid = params.id;
    
    // Update user
    const result = await usersCollection.updateOne(
      { uid },
      { $set: { ...body, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Fetch updated user
    const updatedUser = await usersCollection.findOne({ uid });
    
    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error('[API] Update user error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
