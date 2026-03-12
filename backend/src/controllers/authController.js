/**
 * AuthController - Endpoints de autenticação
 */

import * as authService from '../services/authService.js';

export async function login(req, res, next) {
  try {
    const { email, senha } = req.body;
    const resultado = await authService.login(email, senha);
    res.json(resultado);
  } catch (err) {
    next(err);
  }
}
