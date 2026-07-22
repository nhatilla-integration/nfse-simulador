import { Request, Response } from 'express';
import { EmissaoService } from '../services/EmissaoService';
import { asyncHandler } from '../middlewares/asyncHandler';

export const postEmissao = asyncHandler(async (req: Request, res: Response) => {
  const { clienteId, valor } = req.body;
  const emissao = await EmissaoService.emitir({ clienteId, valor });
  return res.status(201).json(emissao);
});

export const getEmissoesPorCliente = asyncHandler(async (req: Request, res: Response) => {
  const clienteId = Number(req.params.clienteId);
  const emissoes = await EmissaoService.listarPorCliente(clienteId);
  return res.status(200).json(emissoes);
});
