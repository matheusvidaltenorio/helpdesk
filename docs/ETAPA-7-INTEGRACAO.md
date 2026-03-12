# Etapa 7 — Integração Completa

> **Objetivo:** Garantir que frontend e backend funcionem juntos de ponta a ponta, com todas as funcionalidades previstas.

---

## O que foi implementado

### 1. Comentários (backend + frontend)

**Backend:**
- `POST /api/chamados/:id/comentarios` — Adiciona comentário ao chamado
- Body: `{ "texto": "..." }`
- Usuário vem do token JWT (autenticado)

**Frontend:**
- Formulário na página de detalhe do chamado para adicionar comentários
- Lista de comentários com nome do autor e data
- Atualização automática após enviar

### 2. Alteração de status (atendentes e admins)

- Na página de detalhe do chamado, usuários com `role` **atendente** ou **admin** veem um **select** para alterar o status
- Opções: Aberto → Em andamento → Resolvido
- Alteração em tempo real (sem recarregar a página)

### 3. Página de Cadastro

- Rota `/cadastro` — formulário para criar nova conta
- Campos: nome, e-mail, senha (mínimo 8 caracteres)
- Após cadastro, redireciona para login
- Link na tela de login: "Não tem conta? Cadastrar"
- Link na tela de cadastro: "Já tem conta? Fazer login"

---

## Fluxo completo (usuário típico)

1. **Cadastro** — Cria conta em `/cadastro`
2. **Login** — Entra em `/login`
3. **Lista de chamados** — Vê todos os chamados em `/chamados`
4. **Criar chamado** — Clica em "Novo chamado", preenche título e descrição
5. **Detalhe** — Clica em um chamado para ver detalhes
6. **Comentário** — Adiciona comentários na página de detalhe
7. **Status** — (se atendente/admin) Altera status pelo select

---

## Próxima etapa

**Etapa 8 — Deploy:** Preparar o projeto para rodar em produção (build, variáveis de ambiente, hospedagem).
