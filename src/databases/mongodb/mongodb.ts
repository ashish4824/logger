import { connect } from 'mongoose';
export default async function mongooseConnect(): Promise<void> {
  const mongoDBURI = process.env.MONGODB_URI ?? '';
  console.log('Attempting to connect to MongoDB at:', mongoDBURI);
  try {
    await connect(mongoDBURI);
    console.log('Successfully connected to MongoDB packages database');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}
