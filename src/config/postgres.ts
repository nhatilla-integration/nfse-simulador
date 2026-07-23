import { Pool } from 'pg';
import dotenv from 'dotenv';
import { logger } from './logger';

dotenv.config();

// Pool = conjunto de conexoes reutilizaveis com o banco.
// Melhor que abrir/fechar conexao a cada requisicao.
export const pgPool = new Pool({
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

// Cria a tabela de clientes se ela ainda nao existir.
// Isso roda uma vez quando o servidor sobe.
export async function initPostgres() {
  const query = `
    CREATE TABLE IF NOT EXISTS clientes (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(150) NOT NULL,
      cpf_cnpj VARCHAR(20) NOT NULL UNIQUE,
      email VARCHAR(150),
      cidade VARCHAR(100),
      criado_em TIMESTAMP DEFAULT NOW()
    );
  `;
  await pgPool.query(query);
  logger.info('[Postgres] Tabela "clientes" pronta.');
}
