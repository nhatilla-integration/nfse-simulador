import { Request, Response } from 'express';
import { criarCliente, listarClientes, buscarClientePorId } from '../models/cliente.model';
import { asyncHandler } from '../middlewares/asyncHandler';
import { NotFoundError } from '../errors/AppError';

export const postCliente = asyncHandler(async (req: Request, res: Response) => {
  const { nome, cpf_cnpj, email, cidade } = req.body;
  const novoCliente = await criarCliente({ nome, cpf_cnpj, email, cidade });
  return res.status(201).json(novoCliente);
});

export const getClientes = asyncHandler(async (req: Request, res: Response) => {
  const clientes = await listarClientes();
  return res.status(200).json(clientes);
});

export const getClientePorId = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const cliente = await buscarClientePorId(id);

  if (!cliente) {
    throw new NotFoundError('Cliente nao encontrado');
  }

  return res.status(200).json(cliente);
});
