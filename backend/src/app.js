/**
 * Configuração do Express
 *
 * app.js define middlewares e rotas.
 * Não sobe o servidor - isso é feito em server.js.
 */

import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/index.js';
import logger from './utils/logger.js';

const app = express();
const isProd = process.env.NODE_ENV === 'production';

// CORS: em produção, restringe às origens permitidas
const corsOptions = isProd && process.env.CORS_ORIGIN
  ? { origin: process.env.CORS_ORIGIN.split(',') }
  : {};
app.use(cors(corsOptions));

// Rotas
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Help Desk API está funcionando' });
});

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à API do Help Desk',
    endpoints: {
      health: 'GET /api/health',
      auth: 'POST /api/auth/login (retorna token)',
      usuarios: 'GET, POST /api/usuarios | GET, PUT, DELETE /api/usuarios/:id',
      chamados: 'GET, POST, PUT, DELETE /api/chamados (requer token)',
    },
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Tratamento global de erros
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';

  logger.error(`[${req?.method} ${req?.originalUrl}] ${status} - ${message}`);

  // Em produção, não expõe detalhes internos
  const msgResposta = isProd && status === 500 ? 'Erro interno do servidor' : message;
  res.status(status).json({ error: msgResposta });
});

export default app;
