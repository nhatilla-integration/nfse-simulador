import { Router } from 'express';
import { postCliente, getClientes, getClientePorId } from '../controllers/cliente.controller';

const router = Router();

router.post('/', postCliente);
router.get('/', getClientes);
router.get('/:id', getClientePorId);

export default router;
