/**
 * UsuarioService - Regras de negócio
 * 
 * Responsabilidade: validar dados, aplicar regras, orquestrar Repository.
 * Nunca acessa req/res diretamente.
 */

import bcrypt from 'bcryptjs';
import * as usuarioRepo from '../repositories/usuarioRepository.js';

const SALT_ROUNDS = 10;

export async function listar() {
  return usuarioRepo.findAll();
}

export async function buscarPorId(id) {
  const usuario = await usuarioRepo.findById(id);
  if (!usuario) {
    const erro = new Error('Usuário não encontrado');
    erro.statusCode = 404;
    throw erro;
  }
  return usuario;
}

export async function criar(dados) {
  if (!dados.nome?.trim()) {
    const erro = new Error('Nome é obrigatório');
    erro.statusCode = 400;
    throw erro;
  }
  if (!dados.email?.trim()) {
    const erro = new Error('Email é obrigatório');
    erro.statusCode = 400;
    throw erro;
  }
  if (!dados.senha || dados.senha.length < 8) {
    const erro = new Error('Senha deve ter no mínimo 8 caracteres');
    erro.statusCode = 400;
    throw erro;
  }

  const existente = await usuarioRepo.findByEmail(dados.email);
  if (existente) {
    const erro = new Error('Email já cadastrado');
    erro.statusCode = 409;
    throw erro;
  }

  const senha_hash = await bcrypt.hash(dados.senha, SALT_ROUNDS);

  return usuarioRepo.insert({
    nome: dados.nome.trim(),
    email: dados.email.trim().toLowerCase(),
    senha_hash,
    role: dados.role || 'usuario',
  });
}

export async function atualizar(id, dados) {
  const existente = await usuarioRepo.findById(id);
  if (!existente) {
    const erro = new Error('Usuário não encontrado');
    erro.statusCode = 404;
    throw erro;
  }

  const nome = dados.nome?.trim() ?? existente.nome;
  const email = (dados.email?.trim() ?? existente.email).toLowerCase();

  if (!nome) {
    const erro = new Error('Nome é obrigatório');
    erro.statusCode = 400;
    throw erro;
  }

  if (email !== existente.email) {
    const outro = await usuarioRepo.findByEmail(email);
    if (outro) {
      const erro = new Error('Email já está em uso');
      erro.statusCode = 409;
      throw erro;
    }
  }

  if (dados.senha && dados.senha.length >= 8) {
    const senha_hash = await bcrypt.hash(dados.senha, SALT_ROUNDS);
    return usuarioRepo.updateWithPassword(id, { nome, email, senha_hash });
  }

  return usuarioRepo.update(id, { nome, email });
}

export async function alterarRole(adminUserId, adminRole, targetUserId, novaRole) {
  if (adminRole !== 'admin') {
    const erro = new Error('Apenas administradores podem alterar funções');
    erro.statusCode = 403;
    throw erro;
  }
  const ROLES_VALIDOS = ['usuario', 'atendente', 'admin'];
  if (!ROLES_VALIDOS.includes(novaRole)) {
    const erro = new Error('Função inválida');
    erro.statusCode = 400;
    throw erro;
  }
  const usuario = await usuarioRepo.findById(targetUserId);
  if (!usuario) {
    const erro = new Error('Usuário não encontrado');
    erro.statusCode = 404;
    throw erro;
  }
  if (targetUserId === adminUserId) {
    const erro = new Error('Você não pode alterar sua própria função');
    erro.statusCode = 400;
    throw erro;
  }
  return usuarioRepo.updateRole(targetUserId, novaRole);
}

export async function deletar(id) {
  const existe = await usuarioRepo.findById(id);
  if (!existe) {
    const erro = new Error('Usuário não encontrado');
    erro.statusCode = 404;
    throw erro;
  }
  const ok = await usuarioRepo.remove(id);
  if (!ok) {
    const erro = new Error('Não foi possível deletar (pode haver chamados vinculados)');
    erro.statusCode = 400;
    throw erro;
  }
}
