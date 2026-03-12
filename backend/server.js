/**
 * Ponto de entrada da aplicação
 *
 * Carrega variáveis de ambiente (.env)
 * Valida configuração em produção
 * Inicializa a conexão com o banco
 * Sobe o servidor HTTP
 */

import 'dotenv/config';
import './src/config/database.js';
import app from './src/app.js';

const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Validação em produção
if (isProd) {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'chave_dev_nao_usar_em_producao') {
    console.warn('⚠️ ATENÇÃO: Defina JWT_SECRET forte em produção!');
  }
  if (!process.env.DATABASE_URL && !process.env.DB_HOST) {
    console.warn('⚠️ ATENÇÃO: Configure DATABASE_URL ou variáveis DB_*');
  }
}

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});
