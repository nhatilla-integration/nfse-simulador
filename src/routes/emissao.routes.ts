import { Router } from 'express';
import { postEmissao, getEmissoesPorCliente } from '../controllers/emissao.controller';

const router = Router();

router.post('/', postEmissao);
router.get('/:clienteId', getEmissoesPorCliente);

export default router;
