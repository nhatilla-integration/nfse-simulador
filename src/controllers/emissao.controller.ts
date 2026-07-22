import { Request, Response } from 'express';
import {
  EmissaoService,
  ClienteNaoEncontradoError,
  DadosInvalidosError,
} from '../services/EmissaoService';

export async function postEmissao(req: Request, res: Response) {
  try {
    const { clienteId, valor } = req.body;
    const emissao = await EmissaoService.emitir({ clienteId, valor });
    return res.status(201).json(emissao);
  } catch (erro) {
    if (erro instanceof DadosInvalidosError) {
      return res.status(400).json({ erro: erro.message });
    }
    if (erro instanceof ClienteNaoEncontradoError) {
      return res.status(404).json({ erro: erro.message });
    }
    console.error(erro);
    return res.status(500).json({ erro: 'Erro ao processar emissao' });
  }
}

export async function getEmissoesPorCliente(req: Request, res: Response) {
  try {
    const clienteId = Number(req.params.clienteId);
    const emissoes = await EmissaoService.listarPorCliente(clienteId);
    return res.status(200).json(emissoes);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro ao buscar emissoes' });
  }
}
