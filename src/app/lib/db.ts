/* eslint-disable no-var */
import mongoose from 'mongoose';

// eslint-disable-next-line no-var
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  isConnecting: boolean;
};

// Declare the global type
declare global {
  var mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Check if `global.mongoose` exists, and if not, define it
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null, isConnecting: false};
}

const cached = global.mongoose;

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (cached.isConnecting) {
    return cached.promise;
  }

  try {
    cached.isConnecting = true;
    
    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      };

      cached.promise = mongoose.connect(MONGODB_URI!, opts);
    }
    
    cached.conn = await cached.promise;
    return cached.conn;
  } finally {
    cached.isConnecting = false;
  }
}

export default connectDB;
