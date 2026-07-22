import express from 'express';
import cors from 'cors';
import clienteRoutes from './routes/cliente.routes';
import emissaoRoutes from './routes/emissao.routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/clientes', clienteRoutes);
app.use('/emissoes', emissaoRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'API do simulador de NFS-e no ar' });
});

app.use(errorHandler);

export default app;
