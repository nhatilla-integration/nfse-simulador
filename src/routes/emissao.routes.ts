import { Router } from 'express';
import { postEmissao, getEmissoesPorCliente } from '../controllers/emissao.controller';
import { validate } from '../middlewares/validate';
import { criarEmissaoSchema } from '../schemas/emissao.schema';

const router = Router();

router.post('/', validate(criarEmissaoSchema), postEmissao);
router.get('/:clienteId', getEmissoesPorCliente);

export default router;
