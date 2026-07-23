import dotenv from 'dotenv';
import app from './app';
import { initPostgres } from './config/postgres';
import { connectMongo } from './config/mongo';
import { logger } from './config/logger';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function iniciar() {
  try {
    await initPostgres();
    await connectMongo();

    app.listen(PORT, () => {
      logger.info(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (erro) {
    logger.error({ erro }, 'Erro ao iniciar o servidor');
    process.exit(1);
  }
}

iniciar();
