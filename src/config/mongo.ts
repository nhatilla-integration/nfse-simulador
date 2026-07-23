import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logger } from './logger';

dotenv.config();

export async function connectMongo() {
  const uri = process.env.MONGO_URI as string;
  await mongoose.connect(uri);
  logger.info('[MongoDB] Conectado.');
}
