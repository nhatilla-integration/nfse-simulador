import { pgPool } from '../config/postgres';
import { ConflictError } from '../errors/AppError';

// Este arquivo concentra todas as queries relacionadas a "clientes".
// Separar assim (camada de acesso a dados) facilita testar e trocar
// o banco no futuro sem mexer no controller.

export interface Cliente {
  id?: number;
  nome: string;
  cpf_cnpj: string;
  email?: string;
  cidade?: string;
}

export async function criarCliente(cliente: Cliente) {
  const query = `
    INSERT INTO clientes (nome, cpf_cnpj, email, cidade)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [cliente.nome, cliente.cpf_cnpj, cliente.email, cliente.cidade];

  try {
    const result = await pgPool.query(query, values);
    return result.rows[0];
  } catch (erro) {
    // Codigo 23505 = unique_violation no Postgres.
    if ((erro as { code?: string }).code === '23505') {
      throw new ConflictError('CPF/CNPJ ja cadastrado');
    }
    throw erro;
  }
}

export async function listarClientes() {
  const result = await pgPool.query('SELECT * FROM clientes ORDER BY criado_em DESC;');
  return result.rows;
}

export async function buscarClientePorId(id: number) {
  const result = await pgPool.query('SELECT * FROM clientes WHERE id = $1;', [id]);
  return result.rows[0];
}
