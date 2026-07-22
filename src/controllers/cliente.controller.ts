import { Request, Response } from 'express';
import { criarCliente, listarClientes, buscarClientePorId } from '../models/cliente.model';

export async function postCliente(req: Request, res: Response) {
  try {
    const { nome, cpf_cnpj, email, cidade } = req.body;
    const novoCliente = await criarCliente({ nome, cpf_cnpj, email, cidade });
    return res.status(201).json(novoCliente);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro ao criar cliente' });
  }
}

export async function getClientes(req: Request, res: Response) {
  try {
    const clientes = await listarClientes();
    return res.status(200).json(clientes);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro ao listar clientes' });
  }
}

export async function getClientePorId(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const cliente = await buscarClientePorId(id);

    if (!cliente) {
      return res.status(404).json({ erro: 'Cliente nao encontrado' });
    }

    return res.status(200).json(cliente);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro ao buscar cliente' });
  }
}
