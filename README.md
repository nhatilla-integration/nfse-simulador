# Simulador de Emissão de NFS-e

API que simula o ciclo de emissão de uma nota fiscal de serviço eletrônica.
PostgreSQL guarda dados fixos de cadastro (cliente). MongoDB guarda o
histórico de emissões, porque o retorno de cada tentativa (autorizada,
rejeitada, denegada) tem um formato de dados diferente.

---

## Passo a passo para rodar HOJE

### 1. Pré-requisitos
- Node.js instalado (versão 18+) — verifique com `node -v` no terminal
- PostgreSQL instalado e rodando (você já tem isso da Vendas API)
- Uma conta gratuita no MongoDB Atlas (mongodb.com/cloud/atlas) — mais rápido
  que instalar Mongo localmente hoje. Crie um cluster gratuito (M0) e pegue
  a connection string em "Connect" → "Drivers".

### 2. Instalar as dependências
No terminal, dentro da pasta do projeto:
```
npm install
```

### 3. Configurar variáveis de ambiente
Copie o arquivo `.env.example` e renomeie para `.env`. Preencha com:
- Seus dados reais do PostgreSQL local (usuário, senha, nome do banco)
- A connection string do MongoDB Atlas em `MONGO_URI`

**Importante:** crie o banco `nfse_simulador` no seu PostgreSQL antes de rodar
(pode usar o pgAdmin ou `CREATE DATABASE nfse_simulador;` no psql). A tabela
dentro dele é criada automaticamente pelo código quando o servidor sobe.

### 4. Rodar o servidor em modo desenvolvimento
```
npm run dev
```
Se tudo estiver certo, você verá no terminal:
```
[Postgres] Tabela "clientes" pronta.
[MongoDB] Conectado.
Servidor rodando em http://localhost:3000
```

### 5. Testar os endpoints
Use o Postman, Insomnia, ou até o `curl` direto no terminal.

**Criar um cliente (vai pro Postgres):**
```
POST http://localhost:3000/clientes
Body (JSON):
{
  "nome": "Empresa Teste LTDA",
  "cpf_cnpj": "12345678000199",
  "email": "contato@teste.com",
  "cidade": "Campinas"
}
```

**Listar clientes:**
```
GET http://localhost:3000/clientes
```

**Emitir uma nota fictícia (vai pro Mongo, use o id do cliente criado acima):**
```
POST http://localhost:3000/emissoes
Body (JSON):
{
  "clienteId": 1,
  "valor": 1500.00
}
```
Rode esse endpoint várias vezes — como o retorno é sorteado, você vai ver
notas autorizadas, rejeitadas e denegadas, cada uma com detalhes diferentes.

**Ver o histórico de emissões de um cliente:**
```
GET http://localhost:3000/emissoes/1
```

---

## Por que as escolhas técnicas foram essas
(isso é o que você precisa saber de cor pra defender o projeto numa conversa)

- **PostgreSQL para clientes:** dado fixo, estruturado, que precisa de
  integridade (CPF/CNPJ único, por exemplo). Relacional é o modelo certo aqui.
- **MongoDB para emissões:** cada emissão pode ter um formato de retorno
  diferente dependendo do status. Uma rejeição tem `codigoErro` e `motivo`;
  uma autorização tem `protocolo`. Modelar isso em tabelas relacionais geraria
  colunas vazias ou tabelas extras desnecessárias — documento resolve melhor.
- **TypeScript:** tipagem ajuda a pegar erro antes de rodar (ex: esquecer um
  campo obrigatório), o que importa bastante num sistema fiscal onde erro
  de dado tem consequência real.
- **Camadas separadas (routes/controllers/models):** mesmo padrão usado no
  Spring Boot (controller/service/repository) — mantém o código organizado
  e fácil de testar.

---

## Próximos passos (depois de rodar hoje)
1. Subir esse repositório no GitHub com esse README
2. Adicionar validação mais robusta (ex: validar formato de CPF/CNPJ)
3. Construir a tela Delphi de cadastro de cliente, conectada nesse mesmo Postgres
4. Documentar no README o fluxo completo com um diagrama simples
