export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Simulador de Emissao de NFS-e',
    version: '1.0.0',
    description: 'API que simula o ciclo de emissao de uma Nota Fiscal de Servico Eletronica (NFS-e).',
  },
  servers: [{ url: 'http://localhost:3000' }],
  paths: {
    '/clientes': {
      post: {
        summary: 'Cria um novo cliente',
        tags: ['Clientes'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nome', 'cpf_cnpj'],
                properties: {
                  nome: { type: 'string', example: 'Empresa Teste LTDA' },
                  cpf_cnpj: { type: 'string', example: '12345678000199' },
                  email: { type: 'string', example: 'contato@teste.com' },
                  cidade: { type: 'string', example: 'Campinas' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Cliente criado com sucesso' },
          '400': { description: 'Dados invalidos' },
        },
      },
      get: {
        summary: 'Lista todos os clientes',
        tags: ['Clientes'],
        responses: {
          '200': { description: 'Lista de clientes' },
        },
      },
    },
    '/clientes/{id}': {
      get: {
        summary: 'Busca um cliente pelo id',
        tags: ['Clientes'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': { description: 'Cliente encontrado' },
          '404': { description: 'Cliente nao encontrado' },
        },
      },
    },
    '/emissoes': {
      post: {
        summary: 'Simula a emissao de uma nota fiscal',
        tags: ['Emissoes'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['clienteId', 'valor'],
                properties: {
                  clienteId: { type: 'integer', example: 1 },
                  valor: { type: 'number', example: 1500.0 },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Emissao processada (status sorteado)' },
          '400': { description: 'Dados invalidos' },
          '404': { description: 'Cliente nao cadastrado' },
        },
      },
    },
    '/emissoes/{clienteId}': {
      get: {
        summary: 'Lista o historico de emissoes de um cliente',
        tags: ['Emissoes'],
        parameters: [
          { name: 'clienteId', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': { description: 'Historico de emissoes' },
        },
      },
    },
  },
};
