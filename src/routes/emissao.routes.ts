import { Router } from 'express';
import { postEmissao, getEmissoesPorCliente } from '../controllers/emissao.controller';
import { validate } from '../middlewares/validate';
import { criarEmissaoSchema } from '../schemas/emissao.schema';

const router = Router();

/**
 * @swagger
 * /emissoes:
 *   post:
 *     summary: Simula a emissao de uma nota fiscal
 *     tags: [Emissoes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [clienteId, valor]
 *             properties:
 *               clienteId:
 *                 type: integer
 *                 example: 1
 *               valor:
 *                 type: number
 *                 example: 1500.0
 *     responses:
 *       201:
 *         description: Emissao processada (status sorteado - autorizada, rejeitada ou denegada)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Emissao'
 *       400:
 *         description: Dados invalidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       404:
 *         description: Cliente nao cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.post('/', validate(criarEmissaoSchema), postEmissao);

/**
 * @swagger
 * /emissoes/{clienteId}:
 *   get:
 *     summary: Lista o historico de emissoes de um cliente
 *     tags: [Emissoes]
 *     parameters:
 *       - name: clienteId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Historico de emissoes (lista vazia se o cliente nao tiver emissoes)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Emissao'
 */
router.get('/:clienteId', getEmissoesPorCliente);

export default router;
