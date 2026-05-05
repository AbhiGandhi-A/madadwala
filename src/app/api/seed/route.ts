import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { SEED_SERVICES } from '@/lib/seed-services';

/**
 * Seed initial services data
 * Call: GET /api/seed to populate services
 */
export async function GET() {
  try {
    // Check if services already exist
    const servicesRef = collection(db, 'services');
    const snapshot = await getDocs(servicesRef);

    if (!snapshot.empty) {
      return NextResponse.json({
        success: true,
        message: 'Services already seeded',
        count: snapshot.size,
      });
    }

    // Add services to Firestore
    const addedServices = [];
    for (const service of SEED_SERVICES) {
      const docRef = await addDoc(servicesRef, {
        ...service,
        createdAt: Timestamp.now(),
      });
      addedServices.push({ id: docRef.id, ...service });
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
