# Sistema Help Desk

Sistema de Chamados desenvolvido com foco em aprendizado de engenharia de software e arquitetura profissional.

## Acesso online (Render)

| Serviço | URL |
|---------|-----|
| **Frontend** | [https://helpdesk-web-lxze.onrender.com](https://helpdesk-web-lxze.onrender.com) |
| **Backend API** | https://helpdesk-api-ldxn.onrender.com |

## Sobre o projeto

Projeto educacional construído etapa por etapa, explicando cada decisão técnica, alternativas e boas práticas usadas em empresas.

### Funcionalidades

- Cadastro e login de usuários
- Criação e listagem de chamados
- Filtros por status e prioridade
- Comentários nos chamados
- Alteração de status (atendentes e admins)
- **Painel administrativo** — gerenciar perfis (usuário, atendente, admin) sem acessar o banco

## Stack

| Camada | Tecnologia |
|--------|------------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Banco de dados | PostgreSQL |
| Deploy | Render |
| Ferramentas | Docker, Git, Postman |

## Estrutura de pastas

```
HelpDesk/
├── docs/                  # Documentação de cada etapa
│   ├── ETAPA-1-PLANEJAMENTO.md
│   ├── ETAPA-2-MODELAGEM-BANCO.md
│   ├── ETAPA-3-ESTRUTURA-BACKEND.md
│   ├── ETAPA-4-API-REST.md
│   ├── ETAPA-5-AUTENTICACAO.md
│   ├── ETAPA-6-FRONTEND.md
│   ├── ETAPA-7-INTEGRACAO.md
│   └── ETAPA-8-DEPLOY.md
├── database/
│   └── schema.sql         # Script SQL do banco
├── backend/               # API Node.js + Express
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── middlewares/
│   │   └── routes/
│   ├── server.js
│   └── package.json
├── frontend/              # React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
├── docker-compose.yml     # PostgreSQL para desenvolvimento
├── docker-compose.prod.yml
└── README.md
```

## Como rodar o projeto

### 1. Banco de dados (Docker)
```bash
docker-compose up -d
```

### 2. Criar tabelas
```bash
# Via Docker (conecta no container)
docker exec -i helpdesk-db psql -U postgres -d helpdesk < database/schema.sql

# Ou use pgAdmin/DBeaver e execute database/schema.sql
```

### 3. Backend
```bash
cd backend
cp .env.example .env    # Ajuste DB_PASSWORD se necessário
npm install
npm run dev
```

API em `http://localhost:3000` | Health: `http://localhost:3000/api/health`

### 4. Frontend
```bash
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173`

## Etapas do projeto

- [x] **Etapa 1** — Planejamento do sistema
- [x] **Etapa 2** — Modelagem do banco de dados
- [x] **Etapa 3** — Estrutura do backend
- [x] **Etapa 4** — API REST (CRUD)
- [x] **Etapa 5** — Autenticação (JWT)
- [x] **Etapa 6** — Frontend React
- [x] **Etapa 7** — Integração completa
- [x] **Etapa 8** — Deploy
- [ ] Etapa 9 — Boas práticas

## Como começar

1. Leia o documento `docs/ETAPA-1-PLANEJAMENTO.md`
2. Complete os exercícios da Etapa 1
3. Avance para a Etapa 2 quando estiver pronto
