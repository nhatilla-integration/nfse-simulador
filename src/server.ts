import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initPostgres } from './config/postgres';
import { connectMongo } from './config/mongo';
import clienteRoutes from './routes/cliente.routes';
import emissaoRoutes from './routes/emissao.routes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/clientes', clienteRoutes);
app.use('/emissoes', emissaoRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'API do simulador de NFS-e no ar' });
});

const PORT = process.env.PORT || 3000;

async function iniciar() {
  try {
    await initPostgres();
    await connectMongo();

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (erro) {
    console.error('Erro ao iniciar o servidor:', erro);
    process.exit(1);
  }
}

iniciar();
