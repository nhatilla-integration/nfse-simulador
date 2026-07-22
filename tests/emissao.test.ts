import request from 'supertest';
import app from '../src/app';
import * as clienteModel from '../src/models/cliente.model';
import { Emissao } from '../src/models/emissao.model';

jest.mock('../src/models/cliente.model');
jest.mock('../src/models/emissao.model');

const mockedBuscarCliente = clienteModel.buscarClientePorId as jest.Mock;
const mockedEmissaoCreate = Emissao.create as unknown as jest.Mock;
const mockedEmissaoFind = Emissao.find as unknown as jest.Mock;

describe('POST /emissoes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('emite uma nota quando o cliente existe (emissao autorizada)', async () => {
    mockedBuscarCliente.mockResolvedValue({ id: 1, nome: 'Cliente Teste' });
    mockedEmissaoCreate.mockResolvedValue({
      clienteId: 1,
      valor: 100,
      status: 'autorizada',
      detalhes: { protocolo: 'PROT-123' },
    });

    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.1);

    const resposta = await request(app)
      .post('/emissoes')
      .send({ clienteId: 1, valor: 100 });

    expect(resposta.status).toBe(201);
    expect(resposta.body.status).toBe('autorizada');
    expect(mockedEmissaoCreate).toHaveBeenCalledTimes(1);

    randomSpy.mockRestore();
  });

  it('retorna 404 quando o cliente nao esta cadastrado', async () => {
    mockedBuscarCliente.mockResolvedValue(undefined);

    const resposta = await request(app)
      .post('/emissoes')
      .send({ clienteId: 999, valor: 100 });

    expect(resposta.status).toBe(404);
    expect(resposta.body.erro).toBe('Cliente nao cadastrado');
    expect(mockedEmissaoCreate).not.toHaveBeenCalled();
  });

  it('retorna 400 quando os dados de entrada sao invalidos', async () => {
    const resposta = await request(app).post('/emissoes').send({});

    expect(resposta.status).toBe(400);
    expect(resposta.body.erro).toBe('Dados invalidos');
    expect(mockedBuscarCliente).not.toHaveBeenCalled();
  });
});

describe('GET /emissoes/:clienteId', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('retorna o historico de emissoes do cliente', async () => {
    const historicoFalso = [
      { clienteId: 1, valor: 100, status: 'autorizada' },
      { clienteId: 1, valor: 200, status: 'rejeitada' },
    ];
    mockedEmissaoFind.mockReturnValue({
      sort: jest.fn().mockResolvedValue(historicoFalso),
    });

    const resposta = await request(app).get('/emissoes/1');

    expect(resposta.status).toBe(200);
    expect(resposta.body).toEqual(historicoFalso);
    expect(mockedEmissaoFind).toHaveBeenCalledWith({ clienteId: 1 });
  });
});
