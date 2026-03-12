/**
 * Configuração da conexão com PostgreSQL
 * 
 * Usa a lib 'pg' (node-postgres).
 * Pool = conjunto de conexões reutilizáveis (melhor performance que criar uma por requisição).
 */

import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'helpdesk',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Testa a conexão ao importar o módulo
pool.query('SELECT 1')
  .then(() => console.log('✓ Banco de dados conectado'))
  .catch((err) => console.error('✗ Erro ao conectar no banco:', err.message));

export default pool;
