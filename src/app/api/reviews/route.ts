import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    const db = await connectDB();
    const providerId = req.nextUrl.searchParams.get('providerId');

    if (!providerId) {
      return NextResponse.json(
        { error: 'Provider ID required' },
        { status: 400 }
      );
    }

    const reviewsCollection = db.collection('reviews');
    const reviews = await reviewsCollection
      .find({ providerId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: reviews.map(r => ({
        ...r,
        _id: r._id.toString(),
        bookingId: r.bookingId.toString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = await connectDB();
    const token = req.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'customer') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const { bookingId, providerId, rating, title, comment } = await req.json();

    if (!bookingId || !providerId || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const reviewsCollection = db.collection('reviews');
    const result = await reviewsCollection.insertOne({
      bookingId: new ObjectId(bookingId),
      customerId: decoded.id,
      providerId,
      rating,
      title: title || '',
      comment: comment || '',
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: {
        _id: result.insertedId.toString(),
        bookingId,
        providerId,
        rating,
        title,
        comment,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
