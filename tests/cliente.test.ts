import request from 'supertest';
import app from '../src/app';
import * as clienteModel from '../src/models/cliente.model';
import { ConflictError } from '../src/errors/AppError';

jest.mock('../src/models/cliente.model');

const mockedCriarCliente = clienteModel.criarCliente as jest.Mock;
const mockedListarClientes = clienteModel.listarClientes as jest.Mock;
const mockedBuscarClientePorId = clienteModel.buscarClientePorId as jest.Mock;

describe('POST /clientes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('cria um cliente quando os dados sao validos', async () => {
    mockedCriarCliente.mockResolvedValue({
      id: 1,
      nome: 'Empresa Teste LTDA',
      cpf_cnpj: '12345678000199',
    });

    const resposta = await request(app)
      .post('/clientes')
      .send({ nome: 'Empresa Teste LTDA', cpf_cnpj: '12345678000199' });

    expect(resposta.status).toBe(201);
    expect(resposta.body.nome).toBe('Empresa Teste LTDA');
    expect(mockedCriarCliente).toHaveBeenCalledTimes(1);
  });

  it('retorna 400 quando os dados de entrada sao invalidos', async () => {
    const resposta = await request(app).post('/clientes').send({ nome: '' });

    expect(resposta.status).toBe(400);
    expect(resposta.body.erro).toBe('Dados invalidos');
    expect(mockedCriarCliente).not.toHaveBeenCalled();
  });

  it('retorna 409 quando o cpf_cnpj ja esta cadastrado', async () => {
    mockedCriarCliente.mockRejectedValue(new ConflictError('CPF/CNPJ ja cadastrado'));

    const resposta = await request(app)
      .post('/clientes')
      .send({ nome: 'Empresa Teste LTDA', cpf_cnpj: '12345678000199' });

    expect(resposta.status).toBe(409);
    expect(resposta.body.erro).toBe('CPF/CNPJ ja cadastrado');
  });
});

describe('GET /clientes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('retorna a lista de clientes cadastrados', async () => {
    const clientesFalsos = [
      { id: 1, nome: 'Empresa Teste LTDA', cpf_cnpj: '12345678000199' },
      { id: 2, nome: 'Outra Empresa', cpf_cnpj: '98765432000188' },
    ];
    mockedListarClientes.mockResolvedValue(clientesFalsos);

    const resposta = await request(app).get('/clientes');

    expect(resposta.status).toBe(200);
    expect(resposta.body).toEqual(clientesFalsos);
  });
});

describe('GET /clientes/:id', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('retorna o cliente quando ele existe', async () => {
    mockedBuscarClientePorId.mockResolvedValue({ id: 1, nome: 'Empresa Teste LTDA' });

    const resposta = await request(app).get('/clientes/1');

    expect(resposta.status).toBe(200);
    expect(resposta.body.nome).toBe('Empresa Teste LTDA');
    expect(mockedBuscarClientePorId).toHaveBeenCalledWith(1);
  });

  it('retorna 404 quando o cliente nao existe', async () => {
    mockedBuscarClientePorId.mockResolvedValue(undefined);

    const resposta = await request(app).get('/clientes/999');

    expect(resposta.status).toBe(404);
    expect(resposta.body.erro).toBe('Cliente nao encontrado');
  });
});
