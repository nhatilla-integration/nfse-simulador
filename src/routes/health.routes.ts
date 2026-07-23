import { Router } from 'express';
import { getPing, getHealth } from '../controllers/health.controller';

const router = Router();

/**
 * @swagger
 * /ping:
 *   get:
 *     summary: Verifica se a API esta no ar
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API respondendo normalmente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ping:
 *                   type: string
 *                   example: pong
 */
router.get('/ping', getPing);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verifica a saude da API e das conexoes com Postgres/MongoDB
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API e bancos de dados operacionais
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: UP
 *                 postgres:
 *                   type: string
 *                   example: connected
 *                 mongodb:
 *                   type: string
 *                   example: connected
 *       503:
 *         description: Algum banco de dados esta indisponivel
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: DOWN
 *                 postgres:
 *                   type: string
 *                   example: connected
 *                 mongodb:
 *                   type: string
 *                   example: disconnected
 */
router.get('/health', getHealth);

export default router;
