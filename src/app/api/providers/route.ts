import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const db = await connectDB();
    const usersCollection = db.collection('users');
    
    const serviceId = request.nextUrl.searchParams.get('serviceId');
    
    // Build query
    const query: any = { 
      role: 'provider',
      verified: true,
    };
    
    if (serviceId) {
      query.serviceCategories = serviceId;
    }
    
    const providers = await usersCollection
      .find(query)
      .project({ password: 0 })
      .toArray();
    
    return NextResponse.json({
      success: true,
      data: providers,
    });
  } catch (error) {
    console.error('[API] Get providers error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch providers' },
      { status: 500 }
    );
  }
}
