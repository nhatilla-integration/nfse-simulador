import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function connectMongo() {
  const uri = process.env.MONGO_URI as string;
  await mongoose.connect(uri);
  console.log('[MongoDB] Conectado.');
}
