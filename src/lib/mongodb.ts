import mongoose, { Connection } from 'mongoose';

let cachedConnection: Connection | null = null;

export async function connectDB(): Promise<Connection> {
  if (cachedConnection) {
    console.log('[MongoDB] Using cached connection');
    return cachedConnection;
  }

  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('[MongoDB] Connecting to database...');

    const connection = await mongoose.connect(mongoUri, {
      bufferCommands: false,
    });

    cachedConnection = connection.connection;
    console.log('[MongoDB] Connected successfully');

    return cachedConnection;
  } catch (error) {
    console.error('[MongoDB] Connection error:', error);
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  if (cachedConnection) {
    await mongoose.disconnect();
    cachedConnection = null;
    console.log('[MongoDB] Disconnected');
  }
}

export default connectDB;
