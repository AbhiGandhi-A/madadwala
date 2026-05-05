import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    const db = await connectDB();
    const token = req.cookies.get('auth_token')?.value;
    const providerId = req.nextUrl.searchParams.get('providerId');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    if (!providerId) {
      return NextResponse.json(
        { error: 'Provider ID required' },
        { status: 400 }
      );
    }

    const chatCollection = db.collection('chatRooms');
    const messagesCollection = db.collection('chatMessages');

    // Find or create chat room
    const existingRoom = await chatCollection.findOne({
      $or: [
        { customerId: decoded.id, providerId },
        { providerId, customerId: decoded.id },
      ],
    });

    let chatRoom = existingRoom;
    if (!chatRoom) {
      const result = await chatCollection.insertOne({
        customerId: decoded.id,
        providerId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      chatRoom = {
        _id: result.insertedId,
        customerId: decoded.id,
        providerId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    // Get messages
    const messages = await messagesCollection
      .find({ chatRoomId: chatRoom._id })
      .sort({ createdAt: 1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: {
        chatRoom: {
          ...chatRoom,
          _id: chatRoom._id.toString(),
        },
        messages: messages.map(m => ({
          ...m,
          _id: m._id.toString(),
          chatRoomId: m.chatRoomId.toString(),
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching chat:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat' },
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
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { chatRoomId, message } = await req.json();

    if (!chatRoomId || !message) {
      return NextResponse.json(
        { error: 'Chat room ID and message required' },
        { status: 400 }
      );
    }

    const messagesCollection = db.collection('chatMessages');
    const result = await messagesCollection.insertOne({
      chatRoomId: new ObjectId(chatRoomId),
      senderId: decoded.id,
      message,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: {
        _id: result.insertedId.toString(),
        chatRoomId,
        senderId: decoded.id,
        message,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
