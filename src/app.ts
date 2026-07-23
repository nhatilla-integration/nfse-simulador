import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import clienteRoutes from './routes/cliente.routes';
import emissaoRoutes from './routes/emissao.routes';
import { errorHandler } from './middlewares/errorHandler';
import { swaggerSpec } from './config/swaggerSpec';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/ping', (req, res) => {
  res.json({ ping: 'pong' });
});

app.use('/clientes', clienteRoutes);
app.use('/emissoes', emissaoRoutes);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.json({ status: 'API do simulador de NFS-e no ar' });
});

app.use(errorHandler);

export default app;
