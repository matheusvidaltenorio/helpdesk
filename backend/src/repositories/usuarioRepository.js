/**
 * UsuarioRepository - Acesso ao banco (tabela usuarios)
 * 
 * Responsabilidade: executar SQL. Nenhuma regra de negócio aqui.
 */

import pool from '../config/database.js';

export async function findAll() {
  const { rows } = await pool.query(
    'SELECT id, nome, email, role, created_at, updated_at FROM usuarios ORDER BY id'
  );
  return rows;
}

export async function findById(id) {
  const { rows } = await pool.query(
    'SELECT id, nome, email, role, created_at, updated_at FROM usuarios WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

export async function findByEmail(email) {
  const { rows } = await pool.query(
    'SELECT id, nome, email, senha_hash, role FROM usuarios WHERE email = $1',
    [email]
  );
  return rows[0] || null;
}

export async function insert(usuario) {
  const { rows } = await pool.query(
    `INSERT INTO usuarios (nome, email, senha_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, nome, email, role, created_at, updated_at`,
    [usuario.nome, usuario.email, usuario.senha_hash, usuario.role || 'usuario']
  );
  return rows[0];
}

export async function update(id, dados) {
  const { rows } = await pool.query(
    `UPDATE usuarios SET nome = $1, email = $2, updated_at = NOW()
     WHERE id = $3
     RETURNING id, nome, email, role, created_at, updated_at`,
    [dados.nome, dados.email, id]
  );
  return rows[0] || null;
}

export async function updateWithPassword(id, dados) {
  const { rows } = await pool.query(
    `UPDATE usuarios SET nome = $1, email = $2, senha_hash = $3, updated_at = NOW()
     WHERE id = $4
     RETURNING id, nome, email, role, created_at, updated_at`,
    [dados.nome, dados.email, dados.senha_hash, id]
  );
  return rows[0] || null;
}

export async function remove(id) {
  const { rowCount } = await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
  return rowCount > 0;
}
