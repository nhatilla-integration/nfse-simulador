import { buscarClientePorId } from '../models/cliente.model';
import { Emissao } from '../models/emissao.model';
import { NotFoundError } from '../errors/AppError';

interface RetornoFiscal {
  status: 'autorizada' | 'rejeitada' | 'denegada';
  detalhes: Record<string, unknown>;
}

// Simula o retorno da SEFAZ/Prefeitura. Numa integracao real, aqui entraria
// a chamada ao webservice oficial. Por enquanto, sorteamos um resultado
// pra simular o comportamento real do processo (a maioria autoriza,
// mas erros acontecem).
function simularRetornoFiscal(): RetornoFiscal {
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

interface EmitirNotaInput {
  clienteId: number;
  valor: number;
}

export const EmissaoService = {
  async emitir({ clienteId, valor }: EmitirNotaInput) {
    // clienteId e valor ja chegam validados aqui: o middleware de
    // validacao (Zod), aplicado na rota, garante tipo e presenca
    // antes da requisicao chegar ao Controller.

    // Antes de emitir, confirma que o cliente existe no Postgres.
    const cliente = await buscarClientePorId(clienteId);
    if (!cliente) {
      throw new NotFoundError('Cliente nao cadastrado');
    }

    const resultado = simularRetornoFiscal();

    return Emissao.create({
      clienteId,
      valor,
      status: resultado.status,
      detalhes: resultado.detalhes,
    });
  },

  async listarPorCliente(clienteId: number) {
    return Emissao.find({ clienteId }).sort({ createdAt: -1 });
  },
};
