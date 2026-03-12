/**
 * Rotas de usuários
 * GET / e PATCH /:id/role exigem admin
 * POST / (cadastro) é público
 */

import express from 'express';
import * as usuarioController from '../controllers/usuarioController.js';
import { authRequired, adminRequired } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', usuarioController.criar);

router.get('/', authRequired, adminRequired, usuarioController.listar);
router.get('/:id', authRequired, adminRequired, usuarioController.buscarPorId);
router.put('/:id', authRequired, usuarioController.atualizar);
router.patch('/:id/role', authRequired, adminRequired, usuarioController.alterarRole);
router.delete('/:id', authRequired, adminRequired, usuarioController.deletar);

export default router;
