# Etapa 8 — Deploy (Publicação em Produção)

> **Objetivo:** Entender o que é deploy, como preparar o projeto e publicá-lo para acesso na internet.

---

## 1. O que é Deploy?

**Deploy** é colocar sua aplicação em um servidor acessível pela internet. Em desenvolvimento, tudo roda na sua máquina (`localhost`). Em produção, precisa de:

- **Servidor** — máquina ou serviço que executa seu código 24/7
- **Banco de dados** — PostgreSQL acessível pelo backend
- **Domínio** (opcional) — URL amigável (ex: helpdesk.seudominio.com)
- **HTTPS** — certificado SSL para conexão segura

---

## 2. Diferença entre Desenvolvimento e Produção

| Aspecto | Desenvolvimento | Produção |
|---------|-----------------|----------|
| Onde roda | localhost (sua máquina) | Servidor na nuvem |
| Banco | PostgreSQL local | PostgreSQL hospedado |
| Frontend | Vite dev server (HMR) | Arquivos estáticos (build) |
| Variáveis | .env local | Variáveis do provedor |
| Erros | Logs no terminal | Serviço de monitoramento |
| CORS | Permissivo | Restrito ao domínio do front |

---

## 3. Preparando o Projeto

### Backend (produção)

- `NODE_ENV=production` — desativa logs verbosos, otimiza
- `JWT_SECRET` forte e único (nunca a chave padrão)
- CORS configurado para o domínio do frontend (não `*`)
- Banco em serviço hospedado (Não Supabase, Railway, Neon, etc.)

### Frontend (build)

- `npm run build` — gera pasta `dist/` com HTML, CSS, JS
- Em produção, o frontend precisa da URL real da API (não proxy local)

---

## 4. Opções de Deploy

### Opção A — Serviços gratuitos (Recomendado para aprender)

| Serviço | Backend | Frontend | Banco |
|--------|---------|----------|-------|
| **Render** | ✅ Node.js | ✅ Static | ✅ PostgreSQL free |
| **Railway** | ✅ Node.js | ✅ Static | ✅ PostgreSQL |
| **Vercel** | ✅ Serverless | ✅ React (excelente) | Via externo |
| **Neon** | — | — | ✅ PostgreSQL free |
| **Supabase** | — | — | ✅ PostgreSQL + auth |

**Sugestão para este projeto:** Render ou Railway — colocam backend, frontend e banco no mesmo lugar.

### Opção B — Docker (seu próprio servidor/VPS)

- Docker Compose sobe: backend, frontend (nginx), PostgreSQL
- Funciona em VPS (DigitalOcean, AWS EC2, Contabo, etc.)
- Você controla tudo, mas precisa configurar servidor, domínio, SSL

### Opção C — VPS tradicional

- SSH no servidor, instala Node.js, PostgreSQL, nginx
- Mais trabalho manual, bom para aprender Linux/servidor

---

## 5. Arquivos criados para Deploy

Foram criados:

- `backend/Dockerfile` — build da API
- `frontend/Dockerfile` — build do React + nginx
- `docker-compose.prod.yml` — orquestra backend, frontend e banco
- `.env.production.example` — variáveis de produção

---

## 6. Deploy com Docker (localhost ou VPS)

Na raiz do projeto:

```bash
# Build e subir tudo
docker compose -f docker-compose.prod.yml up -d --build

# Acessar
# Frontend: http://localhost
# Backend API: http://localhost/api (proxy pelo nginx)
```

O nginx no frontend faz proxy de `/api` para o backend.

**Primeira vez:** crie as tabelas no banco:

```bash
docker exec -i helpdesk-db-prod psql -U postgres -d helpdesk < database/schema.sql
```

---

## 7. Deploy no Render (passo a passo)

1. Crie conta em [render.com](https://render.com)
2. **Banco:** New → PostgreSQL → criar (copie a URL interna)
3. **Backend:** New → Web Service
   - Connect repo (GitHub) ou upload manual
   - Root: `backend`
   - Build: `npm install`
   - Start: `npm start`
   - Variáveis: `DATABASE_URL` (ou individual), `JWT_SECRET`, `NODE_ENV=production`
4. **Frontend:** New → Static Site
   - Root: `frontend`
   - Build: `npm install && npm run build`
   - Publish: `dist`
   - Adicione variável: `VITE_API_URL` = URL do backend (ex: https://seu-backend.onrender.com)

---

## 8. Checklist antes do Deploy

- [ ] `JWT_SECRET` forte (mín. 32 caracteres aleatórios)
- [ ] CORS no backend aceita só o domínio do front
- [ ] Senha do banco diferente da dev
- [ ] `NODE_ENV=production` no backend
- [ ] Frontend usa `VITE_API_URL` para chamadas à API
- [ ] Não commitamos `.env` no Git (apenas `.env.example`)

---

## 9. Exercício

1. Gere um `JWT_SECRET` com: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
2. Rode o build do frontend: `cd frontend && npm run build`. O que aparece na pasta `dist/`?
3. Pesquise: qual o custo do plano gratuito do Render? Quais limites?

---

*Documento criado para o projeto Help Desk — Etapa 8*
