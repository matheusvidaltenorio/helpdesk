/**
 * ComentarioController - Camada HTTP para comentários
 */

import * as comentarioService from '../services/comentarioService.js';

export async function criar(req, res, next) {
  try {
    const chamadoId = parseInt(req.params.id, 10);
    if (isNaN(chamadoId)) {
      return res.status(400).json({ error: 'ID do chamado inválido' });
    }
    const { texto } = req.body;
    const comentario = await comentarioService.criar(chamadoId, req.user.id, texto);
    res.status(201).json(comentario);
  } catch (err) {
    next(err);
  }
}
