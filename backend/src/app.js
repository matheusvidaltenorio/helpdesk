/**
 * Configuração do Express
 *
 * app.js define middlewares e rotas.
 * Não sobe o servidor - isso é feito em server.js.
 */

import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/index.js';

const app = express();

app.use(express.json());
app.use(cors());

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
  console.error(err);
  const status = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';
  res.status(status).json({ error: message });
});

export default app;
