import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
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
              description:
                'Varia conforme o status: protocolo (autorizada) ou codigoErro/motivo (rejeitada/denegada)',
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
  },
  // Cobre tanto o codigo-fonte (ts-node-dev em dev) quanto o build (node em producao/Docker).
  // O glob interno do swagger-jsdoc so reconhece barra normal, mesmo no Windows -
  // por isso a normalizacao abaixo (path.join gera barra invertida no Windows).
  apis: [
    path.join(__dirname, '../routes/*.ts').split(path.sep).join('/'),
    path.join(__dirname, '../routes/*.js').split(path.sep).join('/'),
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
