export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Simulador de Emissao de NFS-e',
    version: '1.0.0',
    description: 'API que simula o ciclo de emissao de uma Nota Fiscal de Servico Eletronica (NFS-e).',
  },
  servers: [{ url: 'http://localhost:3000' }],
  tags: [
    { name: 'Health', description: 'Verificacao de disponibilidade da API' },
    { name: 'Clientes', description: 'Cadastro de clientes (PostgreSQL)' },
    { name: 'Emissoes', description: 'Emissao e historico de NFS-e (MongoDB)' },
  ],
  paths: {
    '/ping': {
      get: {
        summary: 'Verifica se a API esta no ar',
        tags: ['Health'],
        responses: {
          '200': {
            description: 'API respondendo normalmente',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { ping: { type: 'string', example: 'pong' } } },
              },
            },
          },
        },
      },
    },
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
          '201': {
            description: 'Cliente criado com sucesso',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Cliente' } } },
          },
          '400': {
            description: 'Dados invalidos',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' } } },
          },
          '409': {
            description: 'CPF/CNPJ ja cadastrado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' } } },
          },
        },
      },
      get: {
        summary: 'Lista todos os clientes',
        tags: ['Clientes'],
        responses: {
          '200': {
            description: 'Lista de clientes',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Cliente' } },
              },
            },
          },
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
          '200': {
            description: 'Cliente encontrado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Cliente' } } },
          },
          '404': {
            description: 'Cliente nao encontrado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' } } },
          },
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
          '201': {
            description: 'Emissao processada (status sorteado: autorizada, rejeitada ou denegada)',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Emissao' } } },
          },
          '400': {
            description: 'Dados invalidos',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' } } },
          },
          '404': {
            description: 'Cliente nao cadastrado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' } } },
          },
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
          '200': {
            description: 'Historico de emissoes (lista vazia se o cliente nao tiver emissoes)',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Emissao' } },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Cliente: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          nome: { type: 'string', example: 'Maria Silva' },
          cpf_cnpj: { type: 'string', example: '12345678900' },
          email: { type: 'string', example: 'maria@example.com' },
          cidade: { type: 'string', example: 'Campinas' },
          criado_em: { type: 'string', format: 'date-time' },
        },
      },
      Emissao: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '6a6235341af1c9b2d1957c5e' },
          clienteId: { type: 'integer', example: 1 },
          valor: { type: 'number', example: 150.5 },
          status: { type: 'string', enum: ['autorizada', 'rejeitada', 'denegada'] },
          detalhes: {
            type: 'object',
            description: 'Varia conforme o status: protocolo (autorizada) ou codigoErro/motivo (rejeitada/denegada)',
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Erro: {
        type: 'object',
        properties: {
          erro: { type: 'string', example: 'Cliente nao encontrado' },
        },
      },
    },
  },
};
