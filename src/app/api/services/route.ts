import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await connectDB();
    const servicesCollection = db.collection('services');
    
    const services = await servicesCollection.find({}).toArray();
    
    return NextResponse.json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error('[API] Get services error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}
