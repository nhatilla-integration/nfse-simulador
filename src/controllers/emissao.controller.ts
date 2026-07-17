import { Request, Response } from 'express';
import { buscarClientePorId } from '../models/cliente.model';
import { Emissao } from '../models/emissao.model';

// Simula o retorno da SEFAZ/Prefeitura. Numa integracao real, aqui entraria
// a chamada ao webservice oficial. Por enquanto, sorteamos um resultado
// pra simular o comportamento real do processo (a maioria autoriza,
// mas erros acontecem).
function simularRetornoFiscal() {
  const sorteio = Math.random();

  if (sorteio < 0.75) {
    return { status: 'autorizada', detalhes: { protocolo: `PROT-${Date.now()}` } };
  }
  if (sorteio < 0.9) {
    return {
      status: 'rejeitada',
      detalhes: { codigoErro: 'E-204', motivo: 'CPF/CNPJ do destinatario invalido' },
    };
  }
  return {
    status: 'denegada',
    detalhes: { codigoErro: 'E-999', motivo: 'Emitente com pendencia cadastral' },
  };
}

export async function postEmissao(req: Request, res: Response) {
  try {
    const { clienteId, valor } = req.body;

    if (!clienteId || !valor) {
      return res.status(400).json({ erro: 'clienteId e valor sao obrigatorios' });
    }

    // Antes de emitir, confirma que o cliente existe no Postgres.
    const cliente = await buscarClientePorId(Number(clienteId));
    if (!cliente) {
      return res.status(404).json({ erro: 'Cliente nao cadastrado' });
    }

    const resultado = simularRetornoFiscal();

    const emissao = await Emissao.create({
      clienteId,
      valor,
      status: resultado.status,
      detalhes: resultado.detalhes,
    });

    return res.status(201).json(emissao);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro ao processar emissao' });
  }
}

export async function getEmissoesPorCliente(req: Request, res: Response) {
  try {
    const clienteId = Number(req.params.clienteId);
    const emissoes = await Emissao.find({ clienteId }).sort({ createdAt: -1 });
    return res.status(200).json(emissoes);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro ao buscar emissoes' });
  }
}
