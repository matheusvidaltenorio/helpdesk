/**
 * AuthService - Lógica de autenticação
 *
 * Responsável por validar credenciais e gerar JWT.
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as usuarioRepo from '../repositories/usuarioRepository.js';

const JWT_SECRET = process.env.JWT_SECRET || 'chave_dev_nao_usar_em_producao';
const JWT_EXPIRES_IN = '7d';

export async function login(email, senha) {
  if (!email?.trim() || !senha) {
    const erro = new Error('Email e senha são obrigatórios');
    erro.statusCode = 400;
    throw erro;
  }

  const usuario = await usuarioRepo.findByEmail(email.trim().toLowerCase());
  if (!usuario) {
    const erro = new Error('Email ou senha incorretos');
    erro.statusCode = 401;
    throw erro;
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
  if (!senhaValida) {
    const erro = new Error('Email ou senha incorretos');
    erro.statusCode = 401;
    throw erro;
  }

  const payload = {
    id: usuario.id,
    email: usuario.email,
    role: usuario.role,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  return {
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role,
    },
  };
}
