# Etapa 3 — Estrutura do Backend

> **Objetivo:** Criar o projeto Node.js + Express com organização profissional de pastas, configurações e conexão com o banco.

---

## 1. Conceitos fundamentais

### Por que organizar pastas?

- **Escalabilidade** — Novos módulos não bagunçam o código existente
- **Manutenção** — Fácil encontrar onde está cada coisa
- **Trabalho em equipe** — Todos seguem a mesma estrutura
- **Testes** — Camadas isoladas são mais fáceis de testar

### Padrão de pastas em Node.js

Empresas costumam usar variações de:

- **Por recurso** — `usuarios/`, `chamados/` (cada pasta com controller, service, etc.)
- **Por camada** — `controllers/`, `services/`, `repositories/` (todos na mesma pasta)

Vamos usar **por camada** porque é mais didático e o projeto é pequeno. Em projetos maiores, "por recurso" escala melhor.

---

## 2. Estrutura de pastas

```
backend/
├── src/
│   ├── config/          # Configurações (DB, env)
│   ├── controllers/     # Recebem HTTP, chamam Services
│   ├── services/        # Regras de negócio
│   ├── repositories/    # Acesso ao banco
│   ├── models/          # Definições (se usar ORM)
│   ├── middlewares/     # Funções intermediárias (auth, erro)
│   ├── routes/          # Definição das rotas
│   └── app.js           # Configuração do Express
├── database/
│   └── schema.sql       # Script do banco (na raiz do projeto)
├── .env.example         # Exemplo de variáveis de ambiente
├── .env                 # Suas variáveis (não vai pro Git)
├── package.json
└── server.js            # Ponto de entrada
```

---

## 3. Explicação dos arquivos

### `package.json`
- **name** — Nome do projeto
- **scripts** — Comandos (start, dev com nodemon)
- **dependencies** — Libs usadas em produção
- **devDependencies** — Libs só em desenvolvimento

### `.env` e `.env.example`
- **.env** — Valores reais (senha do banco, secrets). **Nunca** commitar.
- **.env.example** — Template sem dados sensíveis. Commitar para outros devs saberem o que configurar.

### `server.js`
- Ponto de entrada. Conecta no banco, inicia o Express, sobe o servidor.

### `src/app.js`
- Configura Express: middlewares (json, cors), rotas, tratamento de erro.

### `src/config/database.js`
- Conexão com PostgreSQL. Usa `pg` (node-postgres).

---

## 4. Dependências

| Pacote | Uso |
|--------|-----|
| express | Framework web |
| pg | Cliente PostgreSQL |
| dotenv | Carrega variáveis do .env |
| cors | Permite requisições do frontend (outra porta) |
| bcryptjs | Hash de senhas |
| jsonwebtoken | JWT para autenticação (Etapa 5) |
| nodemon | Reinicia o servidor ao alterar código (dev) |

---

## 5. Como empresas fazem

- **TypeScript** — Muitos projetos usam `.ts` em vez de `.js`
- **ORM** — Prisma, TypeORM para abstrair SQL
- **Validação** — Zod, Joi ou express-validator
- **Logs** — Winston, Pino
- **Testes** — Jest, Vitest

---

## 6. Exercícios

1. Rode `npm run dev` e acesse `http://localhost:3000`. O que aparece?
2. Adicione uma rota `GET /api/health` que retorna `{ status: "ok" }`.
3. Pesquise: qual a diferença entre `dependencies` e `devDependencies`?
