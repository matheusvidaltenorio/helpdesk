# Etapa 5 — Autenticação (Login, JWT, Proteção de Rotas)

> **Objetivo:** Implementar login, geração de JWT e proteção das rotas que exigem usuário autenticado.

---

## 1. Conceitos

### O que é JWT?

**JWT (JSON Web Token)** é um token criptográfico que representa a identidade do usuário. O servidor assina o token com uma chave secreta; o cliente envia o token no header `Authorization` em cada requisição.

```
Login: POST /api/auth/login { email, senha }
  → Servidor valida, retorna { token: "eyJhbG..." }

Requisição protegida: GET /api/chamados
  → Header: Authorization: Bearer eyJhbG...
  → Middleware valida o token, extrai user, continua
```

### Por que JWT?

- **Stateless** — Servidor não guarda sessão; o token contém os dados necessários
- **Escalável** — Múltiplos servidores podem validar o mesmo token
- **Padrão** — Amplamente usado em APIs REST

### Alternativas

- **Session + Cookie** — Mais simples, mas exige armazenar sessão no servidor
- **OAuth** — Para login com Google, GitHub, etc.

---

## 2. Fluxo

1. **Login** → valida email/senha → retorna JWT
2. **Rota protegida** → middleware verifica `Authorization: Bearer <token>` → extrai usuário → `req.user`
3. **Chamados** → criação usa `req.user.id` (não aceita `usuario_id` no body)
4. **Editar/Deletar** → só o dono do chamado, atendente ou admin pode (deletar só dono ou admin)

---

## 3. Como testar no Postman

### 1. Login
```
POST http://localhost:3000/api/auth/login
Body (JSON):
{
  "email": "joao@email.com",
  "senha": "12345678"
}
```
Resposta: `{ "token": "eyJ...", "usuario": { ... } }`

### 2. Chamados (com token)
Na aba **Headers** do Postman:
- Key: `Authorization`
- Value: `Bearer SEU_TOKEN_AQUI`

Ou na aba **Authorization**:
- Type: Bearer Token
- Token: cole o token retornado no login

Depois faça GET/POST/PUT/DELETE em `/api/chamados`.

### 3. Criar chamado (não precisa mais de usuario_id)
O `usuario_id` vem do token automaticamente.

```
POST http://localhost:3000/api/chamados
Authorization: Bearer <seu_token>
Body:
{
  "titulo": "Problema no PC",
  "descricao": "Não liga",
  "prioridade": "alta"
}
```
