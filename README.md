# Simulador de Emissão de NFS-e

API que simula o ciclo de emissão de uma Nota Fiscal de Serviço Eletrônica (NFS-e), construída para explorar, na prática, o tipo de problema de integração fiscal enfrentado por empresas do setor.

## Motivação

Diferente da NF-e (padronizada nacionalmente via SEFAZ), a NFS-e é regulada por cada município, o que gera fragmentação de layouts e formatos de retorno. Este projeto simula esse comportamento: cada tentativa de emissão pode retornar em um formato diferente, dependendo do status (autorizada, rejeitada, denegada, cancelada).

## Stack e arquitetura

- **Node.js + TypeScript** — API REST com Express
- **PostgreSQL** — armazena dados estruturados e fixos (cadastro de clientes/emitentes)
- **MongoDB** — armazena o histórico de emissões, já que cada status retorna campos diferentes (uma autorização tem `protocolo`; uma rejeição tem `codigoErro` e `motivo`). Modelar isso em tabelas relacionais geraria colunas majoritariamente vazias — um modelo de documento se encaixa melhor.

```
src/
  config/       conexões com Postgres e MongoDB
  models/       acesso a dados (queries e schemas)
  controllers/  regras de negócio de cada rota
  routes/       definição dos endpoints
  server.ts     ponto de entrada da aplicação
```

## Como rodar localmente

**Pré-requisitos:** Node.js 18+, PostgreSQL, e uma instância MongoDB (local ou Atlas).

```bash
npm install
cp .env.example .env   # preencha com suas credenciais
npm run dev
```

O servidor sobe em `http://localhost:3000` e cria automaticamente a tabela `clientes` no PostgreSQL na primeira execução.

## Endpoints

**Clientes**
```
POST   /clientes        cria um cliente
GET    /clientes        lista todos os clientes
GET    /clientes/:id    busca cliente por id
```

**Emissões**
```
POST   /emissoes             simula a emissão de uma nota (status sorteado)
GET    /emissoes/:clienteId  histórico de emissões de um cliente
```

Exemplo de criação de cliente:
```json
POST /clientes
{
  "nome": "Empresa Teste LTDA",
  "cpf_cnpj": "12345678000199",
  "email": "contato@teste.com",
  "cidade": "Campinas"
}
```

Exemplo de emissão:
```json
POST /emissoes
{
  "clienteId": 1,
  "valor": 1500.00
}
```

## Próximos passos

- Validação de formato de CPF/CNPJ
- Interface desktop em Delphi para cadastro de clientes, conectada ao mesmo banco PostgreSQL
- Diagrama de arquitetura no README