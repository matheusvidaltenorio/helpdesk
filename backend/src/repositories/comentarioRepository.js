/**
 * ComentarioRepository - Acesso ao banco (tabela comentarios)
 */

import pool from '../config/database.js';

export async function findByChamadoId(chamadoId) {
  const { rows } = await pool.query(
    `SELECT c.id, c.chamado_id, c.usuario_id, c.texto, c.created_at, u.nome as usuario_nome
     FROM comentarios c
     JOIN usuarios u ON u.id = c.usuario_id
     WHERE c.chamado_id = $1
     ORDER BY c.created_at ASC`,
    [chamadoId]
  );
  return rows;
}

export async function insert(comentario) {
  const { rows } = await pool.query(
    `INSERT INTO comentarios (chamado_id, usuario_id, texto)
     VALUES ($1, $2, $3)
     RETURNING id, chamado_id, usuario_id, texto, created_at`,
    [comentario.chamado_id, comentario.usuario_id, comentario.texto]
  );
  return rows[0];
}

export async function findByIdWithUsuario(id) {
  const { rows } = await pool.query(
    `SELECT c.id, c.chamado_id, c.usuario_id, c.texto, c.created_at, u.nome as usuario_nome
     FROM comentarios c
     JOIN usuarios u ON u.id = c.usuario_id
     WHERE c.id = $1`,
    [id]
  );
  return rows[0] || null;
}
