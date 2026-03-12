/**
 * ChamadoRepository - Acesso ao banco (tabela chamados)
 */

import pool from '../config/database.js';

export async function findAll(filtros = {}) {
  let query = `
    SELECT c.id, c.usuario_id, c.titulo, c.descricao, c.status, c.prioridade,
           c.created_at, c.updated_at, u.nome as usuario_nome, u.email as usuario_email
    FROM chamados c
    JOIN usuarios u ON u.id = c.usuario_id
    WHERE 1=1
  `;
  const params = [];
  let i = 1;

  if (filtros.status) {
    query += ` AND c.status = $${i}`;
    params.push(filtros.status);
    i++;
  }
  if (filtros.prioridade) {
    query += ` AND c.prioridade = $${i}`;
    params.push(filtros.prioridade);
    i++;
  }
  if (filtros.usuario_id) {
    query += ` AND c.usuario_id = $${i}`;
    params.push(filtros.usuario_id);
    i++;
  }

  query += ' ORDER BY c.created_at DESC';

  const { rows } = await pool.query(query, params);
  return rows;
}

export async function findById(id) {
  const { rows } = await pool.query(
    `SELECT c.id, c.usuario_id, c.titulo, c.descricao, c.status, c.prioridade,
            c.created_at, c.updated_at, u.nome as usuario_nome, u.email as usuario_email
     FROM chamados c
     JOIN usuarios u ON u.id = c.usuario_id
     WHERE c.id = $1`,
    [id]
  );
  return rows[0] || null;
}

export async function insert(chamado) {
  const { rows } = await pool.query(
    `INSERT INTO chamados (usuario_id, titulo, descricao, status, prioridade)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, usuario_id, titulo, descricao, status, prioridade, created_at, updated_at`,
    [
      chamado.usuario_id,
      chamado.titulo,
      chamado.descricao,
      chamado.status || 'aberto',
      chamado.prioridade || 'media',
    ]
  );
  return rows[0];
}

export async function update(id, dados) {
  const { rows } = await pool.query(
    `UPDATE chamados SET titulo = $1, descricao = $2, status = $3, prioridade = $4, updated_at = NOW()
     WHERE id = $5
     RETURNING id, usuario_id, titulo, descricao, status, prioridade, created_at, updated_at`,
    [
      dados.titulo,
      dados.descricao,
      dados.status,
      dados.prioridade,
      id,
    ]
  );
  return rows[0] || null;
}

export async function remove(id) {
  const { rowCount } = await pool.query('DELETE FROM chamados WHERE id = $1', [id]);
  return rowCount > 0;
}
