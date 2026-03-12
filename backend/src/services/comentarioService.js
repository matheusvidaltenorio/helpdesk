/**
 * ComentarioService - Regras de negócio para comentários
 */

import * as comentarioRepo from '../repositories/comentarioRepository.js';
import * as chamadoRepo from '../repositories/chamadoRepository.js';

export async function criar(chamadoId, userId, texto) {
  if (!texto?.trim()) {
    const erro = new Error('Texto do comentário é obrigatório');
    erro.statusCode = 400;
    throw erro;
  }

  const chamado = await chamadoRepo.findById(chamadoId);
  if (!chamado) {
    const erro = new Error('Chamado não encontrado');
    erro.statusCode = 404;
    throw erro;
  }

  const comentario = await comentarioRepo.insert({
    chamado_id: chamadoId,
    usuario_id: userId,
    texto: texto.trim(),
  });

  // Retorna com usuario_nome para exibição
  return comentarioRepo.findByIdWithUsuario(comentario.id);
}
