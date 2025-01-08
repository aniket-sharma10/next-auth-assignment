/* eslint-disable no-var */
import mongoose from 'mongoose';

// eslint-disable-next-line no-var
declare global {
  var mongoose: { conn: mongoose.Mongoose | null; promise: Promise<mongoose.Mongoose> | null };
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Check if `global.mongoose` exists, and if not, define it
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

const cached = global.mongoose;

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
