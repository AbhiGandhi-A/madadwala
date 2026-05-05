import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { SEED_SERVICES } from '@/lib/seed-services';

/**
 * Seed initial services data
 * Call: GET /api/seed to populate services
 */
export async function GET() {
  try {
    const db = await connectDB();
    
    // Get services collection
    const servicesCollection = db.collection('services');
    
    // Check if services already exist
    const existingCount = await servicesCollection.countDocuments();
    
    if (existingCount > 0) {
      return NextResponse.json({
        success: true,
        message: 'Services already seeded',
        count: existingCount,
      });
    }

    // Add services to MongoDB
    const addedServices = [];
    for (const service of SEED_SERVICES) {
      const result = await servicesCollection.insertOne({
        ...service,
        createdAt: new Date(),
      });
      addedServices.push({ 
        _id: result.insertedId, 
        ...service 
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Services seeded successfully',
      count: addedServices.length,
      services: addedServices,
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
