/**
 * ChamadoController - Camada HTTP para chamados
 */

import * as chamadoService from '../services/chamadoService.js';

export async function listar(req, res, next) {
  try {
    const { status, prioridade, usuario_id } = req.query;
    const filtros = {};
    if (status) filtros.status = status;
    if (prioridade) filtros.prioridade = prioridade;
    if (usuario_id) filtros.usuario_id = parseInt(usuario_id, 10);

    const chamados = await chamadoService.listar(filtros);
    res.json(chamados);
  } catch (err) {
    next(err);
  }
}

export async function buscarPorId(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    const chamado = await chamadoService.buscarPorId(id);
    res.json(chamado);
  } catch (err) {
    next(err);
  }
}

export async function criar(req, res, next) {
  try {
    const { titulo, descricao, prioridade } = req.body;
    const chamado = await chamadoService.criar(req.user.id, {
      titulo,
      descricao,
      prioridade,
    });
    res.status(201).json(chamado);
  } catch (err) {
    next(err);
  }
}

export async function atualizar(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    const { titulo, descricao, status, prioridade } = req.body;
    const chamado = await chamadoService.atualizar(
      id,
      req.user.id,
      req.user.role,
      { titulo, descricao, status, prioridade }
    );
    res.json(chamado);
  } catch (err) {
    next(err);
  }
}

export async function deletar(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    await chamadoService.deletar(id, req.user.id, req.user.role);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
