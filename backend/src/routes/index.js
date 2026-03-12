/**
 * Agrupa e monta todas as rotas da API
 */

import express from 'express';
import usuarioRoutes from './usuarioRoutes.js';
import chamadoRoutes from './chamadoRoutes.js';
import authRoutes from './authRoutes.js';
import { authRequired } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/chamados', authRequired, chamadoRoutes);

export default router;
