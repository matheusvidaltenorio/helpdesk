# Etapa 9 — Boas Práticas

> **Objetivo:** Aplicar segurança, logs estruturados, tratamento de erros e validação de ambiente em produção.

---

## 1. Segurança

### O que implementamos

| Prática | Descrição |
|---------|-----------|
| **CORS restrito** | Em produção, só aceita requisições do domínio do frontend |
| **Erros opacos** | Em produção, erros 500 não expõem detalhes internos (stack, mensagens sensíveis) |
| **JWT_SECRET** | Validação ao subir: em produção, exige JWT_SECRET forte |
| **Senhas** | Sempre hasheadas com bcrypt (nunca texto plano) |

### O que empresas fazem a mais

- Rate limiting (limitar requisições por IP)
- Helmet (headers de segurança HTTP)
- Sanitização de inputs (evitar SQL injection, XSS)
- HTTPS obrigatório
- Auditoria de acesso (quem fez o quê, quando)

---

## 2. Logs

### Logger criado

- `logger.js` — registra horário, nível (info/error) e mensagem
- Em produção, poderia enviar para serviço (Sentry, Datadog, CloudWatch)

### Formato

```
[2025-03-12 10:30:45] INFO: Servidor iniciado na porta 3000
[2025-03-12 10:31:02] ERROR: Erro ao conectar no banco: ...
```

---

## 3. Tratamento de Erros

### Regras

1. **Erros conhecidos** — têm `statusCode` (400, 401, 404, 409) → mensagem amigável ao cliente
2. **Erros inesperados** — 500 → mensagem genérica ao cliente, detalhes só nos logs

### Classe AppError

- Erros de negócio usam `throw new AppError('Mensagem', 400)`
- O handler global captura e formata a resposta

---

## 4. Validação de Ambiente

Na inicialização, em produção:

- `JWT_SECRET` deve ser definido e diferente da chave padrão
- Evita deploy acidental sem configuração segura

---

## 5. Organização do Código

| Pasta/Arquivo | Responsabilidade |
|---------------|------------------|
| `utils/logger.js` | Logs centralizados |
| `utils/AppError.js` | Erros padronizados |
| Middlewares | authRequired, adminRequired |
| Services | Regras de negócio |
| Repositories | Acesso ao banco |

---

## 6. Checklist de Produção

- [ ] `NODE_ENV=production`
- [ ] `JWT_SECRET` forte (32+ caracteres aleatórios)
- [ ] CORS com domínio do frontend
- [ ] `DATABASE_URL` ou variáveis do banco configuradas
- [ ] Logs não expõem dados sensíveis
- [ ] Erros 500 não retornam stack ao cliente

---

## 7. Exercícios

1. Pesquise o que o pacote **helmet** faz e como usá-lo no Express
2. O que é **rate limiting**? Por que é importante em APIs públicas?
3. Em um erro 500, por que não devemos enviar o stack trace para o cliente?

---

*Documento criado para o projeto Help Desk — Etapa 9*
