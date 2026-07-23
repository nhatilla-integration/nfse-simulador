import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { pgPool } from '../config/postgres';

export function getPing(req: Request, res: Response) {
  res.json({ ping: 'pong' });
}

export async function getHealth(req: Request, res: Response) {
  const health = {
    status: 'UP',
    postgres: 'disconnected',
    mongodb: 'disconnected',
  };

  try {
    await pgPool.query('SELECT 1');
    health.postgres = 'connected';
  } catch {
    health.status = 'DOWN';
  }

  if (mongoose.connection.readyState === 1) {
    health.mongodb = 'connected';
  } else {
    health.status = 'DOWN';
  }

  res.status(health.status === 'UP' ? 200 : 503).json(health);
}
