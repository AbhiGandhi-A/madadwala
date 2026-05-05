import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectDB();
    const servicesCollection = db.collection('services');
    
    // Try to find by MongoDB _id or by custom id field
    let service = null;
    
    try {
      service = await servicesCollection.findOne({
        _id: new ObjectId(params.id),
      });
    } catch {
      // If not a valid ObjectId, try finding by id field
      service = await servicesCollection.findOne({
        id: params.id,
      });
    }
    
    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error('[API] Get service error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch service' },
      { status: 500 }
    );
  }
}
