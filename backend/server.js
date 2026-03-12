/**
 * Ponto de entrada da aplicação
 * 
 * Carrega variáveis de ambiente (.env)
 * Inicializa a conexão com o banco
 * Importa o app (Express)
 * Sobe o servidor HTTP
 */

import 'dotenv/config';
import './src/config/database.js'; // Inicializa conexão
import app from './src/app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});
