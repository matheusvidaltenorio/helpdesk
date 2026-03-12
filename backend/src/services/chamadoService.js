/**
 * ChamadoService - Regras de negócio para chamados
 */

import * as chamadoRepo from '../repositories/chamadoRepository.js';
import * as comentarioRepo from '../repositories/comentarioRepository.js';

const STATUS_VALIDOS = ['aberto', 'em_andamento', 'resolvido'];
const PRIORIDADES_VALIDAS = ['baixa', 'media', 'alta'];

export async function listar(filtros = {}) {
  return chamadoRepo.findAll(filtros);
}

export async function buscarPorId(id) {
  const chamado = await chamadoRepo.findById(id);
  if (!chamado) {
    const erro = new Error('Chamado não encontrado');
    erro.statusCode = 404;
    throw erro;
  }
  const comentarios = await comentarioRepo.findByChamadoId(id);
  return { ...chamado, comentarios };
}

export async function criar(usuarioId, dados) {
  if (!dados.titulo?.trim()) {
    const erro = new Error('Título é obrigatório');
    erro.statusCode = 400;
    throw erro;
  }
  if (!dados.descricao?.trim()) {
    const erro = new Error('Descrição é obrigatória');
    erro.statusCode = 400;
    throw erro;
  }

  return chamadoRepo.insert({
    usuario_id: usuarioId,
    titulo: dados.titulo.trim(),
    descricao: dados.descricao.trim(),
    status: 'aberto',
    prioridade: dados.prioridade && PRIORIDADES_VALIDAS.includes(dados.prioridade)
      ? dados.prioridade
      : 'media',
  });
}

export async function atualizar(id, usuarioId, role, dados) {
  const existente = await chamadoRepo.findById(id);
  if (!existente) {
    const erro = new Error('Chamado não encontrado');
    erro.statusCode = 404;
    throw erro;
  }

  const podeEditar = existente.usuario_id === usuarioId || role === 'admin' || role === 'atendente';
  if (!podeEditar) {
    const erro = new Error('Você não tem permissão para editar este chamado');
    erro.statusCode = 403;
    throw erro;
  }

  const titulo = dados.titulo?.trim() ?? existente.titulo;
  const descricao = dados.descricao?.trim() ?? existente.descricao;
  const status = dados.status && STATUS_VALIDOS.includes(dados.status)
    ? dados.status
    : existente.status;
  const prioridade = dados.prioridade && PRIORIDADES_VALIDAS.includes(dados.prioridade)
    ? dados.prioridade
    : existente.prioridade;

  return chamadoRepo.update(id, { titulo, descricao, status, prioridade });
}

export async function deletar(id, usuarioId, role) {
  const existente = await chamadoRepo.findById(id);
  if (!existente) {
    const erro = new Error('Chamado não encontrado');
    erro.statusCode = 404;
    throw erro;
  }

  const podeDeletar = existente.usuario_id === usuarioId || role === 'admin';
  if (!podeDeletar) {
    const erro = new Error('Você não tem permissão para deletar este chamado');
    erro.statusCode = 403;
    throw erro;
  }

  await chamadoRepo.remove(id);
}
