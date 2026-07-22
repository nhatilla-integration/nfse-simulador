import { Router } from 'express';
import { postCliente, getClientes, getClientePorId } from '../controllers/cliente.controller';
import { validate } from '../middlewares/validate';
import { criarClienteSchema } from '../schemas/cliente.schema';

const router = Router();

router.post('/', validate(criarClienteSchema), postCliente);
router.get('/', getClientes);
router.get('/:id', getClientePorId);

export default router;
