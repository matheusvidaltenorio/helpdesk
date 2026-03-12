/**
 * Rotas de chamados
 */

import express from 'express';
import * as chamadoController from '../controllers/chamadoController.js';
import * as comentarioController from '../controllers/comentarioController.js';

const router = express.Router();

router.get('/', chamadoController.listar);
router.get('/:id', chamadoController.buscarPorId);
router.post('/:id/comentarios', comentarioController.criar);
router.post('/', chamadoController.criar);
router.put('/:id', chamadoController.atualizar);
router.delete('/:id', chamadoController.deletar);

export default router;
