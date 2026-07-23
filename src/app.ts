import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import clienteRoutes from './routes/cliente.routes';
import emissaoRoutes from './routes/emissao.routes';
import { errorHandler } from './middlewares/errorHandler';
import { swaggerSpec } from './config/swaggerSpec';
import { logger } from './config/logger';
import { pgPool } from './config/postgres';

const app = express();
app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger }));

app.get('/ping', (req, res) => {
  res.json({ ping: 'pong' });
});

app.get('/health', async (req, res) => {
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
});

app.use('/clientes', clienteRoutes);
app.use('/emissoes', emissaoRoutes);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.json({ status: 'API do simulador de NFS-e no ar' });
});

app.use(errorHandler);

export default app;
