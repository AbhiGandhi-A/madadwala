import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import bcryptjs from 'bcryptjs';
import { ObjectId } from 'mongodb';

/**
 * Create demo/test accounts
 * GET /api/setup/demo-accounts
 */
export async function GET() {
  try {
    const db = await connectDB();
    const usersCollection = db.collection('users');

    // Check if demo accounts already exist
    const existingCustomer = await usersCollection.findOne({
      email: 'customer@demo.com',
    });

    const existingProvider = await usersCollection.findOne({
      email: 'provider@demo.com',
    });

    if (existingCustomer && existingProvider) {
      return NextResponse.json({
        success: true,
        message: 'Demo accounts already exist',
        accounts: {
          customer: {
            email: 'customer@demo.com',
            password: 'Demo@12345',
            role: 'customer',
          },
          provider: {
            email: 'provider@demo.com',
            password: 'Demo@12345',
            role: 'provider',
          },
        },
      });
    }

    const hashedPassword = await bcryptjs.hash('Demo@12345', 10);

    // Create customer account
    const customerResult = await usersCollection.insertOne({
      _id: new ObjectId(),
      email: 'customer@demo.com',
      password: hashedPassword,
      displayName: 'Demo Customer',
      role: 'customer',
      phone: '+1234567890',
      address: '123 Main St, Demo City',
      status: 'active',
      verified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create provider account
    const providerResult = await usersCollection.insertOne({
      _id: new ObjectId(),
      email: 'provider@demo.com',
      password: hashedPassword,
      displayName: 'Demo Service Provider',
      role: 'provider',
      phone: '+0987654321',
      address: '456 Service St, Demo City',
      status: 'active',
      verified: true,
      rating: 4.8,
      reviewCount: 120,
      serviceCategories: ['electrician', 'plumber'],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: 'Demo accounts created successfully',
      accounts: {
        customer: {
          id: customerResult.insertedId.toString(),
          email: 'customer@demo.com',
          password: 'Demo@12345',
          role: 'customer',
          note: 'Use these credentials to login without OTP',
        },
        provider: {
          id: providerResult.insertedId.toString(),
          email: 'provider@demo.com',
          password: 'Demo@12345',
          role: 'provider',
          note: 'Use these credentials to login without OTP',
        },
      },
    });
  } catch (error) {
    console.error('Error creating demo accounts:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create demo accounts',
      },
      { status: 500 }
    );
  }
}
