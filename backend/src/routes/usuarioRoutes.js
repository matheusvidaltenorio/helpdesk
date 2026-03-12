/**
 * Rotas de usuários
 */

import express from 'express';
import * as usuarioController from '../controllers/usuarioController.js';

const router = express.Router();

router.get('/', usuarioController.listar);
router.get('/:id', usuarioController.buscarPorId);
router.post('/', usuarioController.criar);
router.put('/:id', usuarioController.atualizar);
router.delete('/:id', usuarioController.deletar);

export default router;
