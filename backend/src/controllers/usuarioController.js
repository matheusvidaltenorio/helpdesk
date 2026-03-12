/**
 * UsuarioController - Camada HTTP
 * 
 * Responsabilidade: receber req/res, extrair dados, chamar Service, enviar resposta.
 * Não contém regras de negócio.
 */

import * as usuarioService from '../services/usuarioService.js';

export async function listar(req, res, next) {
  try {
    const usuarios = await usuarioService.listar();
    res.json(usuarios);
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
    const usuario = await usuarioService.buscarPorId(id);
    res.json(usuario);
  } catch (err) {
    next(err);
  }
}

export async function criar(req, res, next) {
  try {
    const { nome, email, senha, role } = req.body;
    const usuario = await usuarioService.criar({ nome, email, senha, role });
    res.status(201).json(usuario);
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
    const { nome, email, senha } = req.body;
    const usuario = await usuarioService.atualizar(id, { nome, email, senha });
    res.json(usuario);
  } catch (err) {
    next(err);
  }
}

export async function alterarRole(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    const { role } = req.body;
    const usuario = await usuarioService.alterarRole(
      req.user.id,
      req.user.role,
      id,
      role
    );
    res.json(usuario);
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
    await usuarioService.deletar(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
