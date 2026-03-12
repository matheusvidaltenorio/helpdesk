# Etapa 1 — Planejamento do Sistema Help Desk

> **Objetivo desta etapa:** Antes de escrever qualquer linha de código, entendemos o problema, as regras de negócio e fazemos escolhas técnicas fundamentadas.

---

## 1. Definição do Problema

### O que é um Help Desk?

Um **Help Desk** (ou "Sistema de Chamados") é um software usado por empresas para centralizar, organizar e rastrear solicitações de suporte. Quando um colaborador tem um problema (ex: computador quebrou, pedido de acesso), ele abre um **chamado**. A equipe de TI (ou outro departamento) acompanha e resolve cada chamado.

### Problemas que o sistema resolve

| Problema | Como o Help Desk resolve |
|----------|--------------------------|
| Solicitações soltas em e-mail | Tudo fica em um só lugar, com histórico |
| "Quem pediu o que?" | Cada chamado tem responsável, data, status |
| Priorização caótica | Status e filtros ajudam a priorizar |
| Falta de métricas | Dá para medir tempo médio de resolução, volume, etc. |
| Comunicação fragmentada | Comentários centralizados no próprio chamado |

### Quem usa?

1. **Usuário final** — Abre chamados, acompanha status, adiciona comentários
2. **Atendente/Agente** — Recebe chamados, altera status, resolve
3. **Administrador** — Gerencia usuários, configurações, relatórios

---

## 2. Funcionalidades Detalhadas

### Funcionalidades principais

| # | Funcionalidade | Descrição | Quem usa |
|---|----------------|-----------|----------|
| 1 | Cadastro de usuário | Registrar novo usuário (nome, e-mail, senha, role) | Todos (ou Admin) |
| 2 | Login e autenticação | Entrar no sistema com e-mail e senha | Todos |
| 3 | Criação de chamados | Abrir um novo chamado com título, descrição, prioridade | Usuário/Atendente |
| 4 | Status do chamado | Aberto → Em andamento → Resolvido | Atendente |
| 5 | Comentários | Adicionar comentários em um chamado | Todos |
| 6 | Painel administrativo | Ver usuários, chamados, métricas | Admin |
| 7 | Filtros e busca | Filtrar por status, prioridade, data, texto | Todos |
| 8 | Histórico | Registro de alterações (quem mudou o quê, quando) | Atendente/Admin |

### Regras de negócio iniciais

- **Usuário** só pode editar/deletar chamados que criou (ou se for admin)
- **Senha** deve ter mínimo de 8 caracteres, com letras e números
- **Chamado** deve ter pelo menos título e descrição
- **Status** só pode mudar na ordem: Aberto → Em andamento → Resolvido
- **E-mail** deve ser único no sistema

---

## 3. Escolha das Tecnologias

### Frontend: React + Vite

**Por que React?**

- Bibliotecas para UI, roteamento e estado são maduras
- Grande mercado de trabalho
- Permite componente reutilizáveis e lógica clara

**Por que Vite (e não Create React App)?**

- Vite usa **ESM** e bundling via Rollup, então é bem mais rápido para desenvolvimento
- Create React App (CRA) está praticamente descontinuado
- Vite é o padrão moderno para projetos React

**Alternativas:**

- Next.js (se precisar de SSR/SEO)
- Vue + Vite
- Angular
- Svelte

**Como empresas fazem:** Projetos novos costumam usar React + Vite ou Next.js. CRA quase não é mais usado em projetos novos.

---

### Backend: Node.js + Express

**Por que Node.js?**

- Mesma linguagem (JavaScript/TypeScript) no front e no back
- Ótimo para I/O assíncrono (banco, APIs externas)
- Ecossistema rico (npm)

**Por que Express?**

- Simples, leve e amplamente usado
- Rotas e middlewares são fáceis de entender
- Base para NestJS, Fastify, etc.

**Alternativas:**

- NestJS (estrutura mais opinativa, inspirada em Angular)
- Fastify (mais rápido que Express)
- Python (Django, FastAPI)
- Java (Spring Boot)
- Go (Gin, Echo)

**Como empresas fazem:** Startups usam muito Node ou Python. Empresas grandes podem usar Java, .NET ou Go para alta escala.

---

### Banco de dados: PostgreSQL

**Por que PostgreSQL?**

- Relacional, SQL padrão
- Bom suporte a JSON (caso precise no futuro)
- Open source, robusto, amplamente usado
- Ideal para dados estruturados (usuários, chamados, relacionamentos)

**Alternativas:**

- MySQL / MariaDB — semelhante, muito usado (especialmente com WordPress)
- SQLite — para testes ou apps pequenas
- MongoDB — NoSQL, para dados mais flexíveis
- Supabase — PostgreSQL hospedado, com auth e APIs prontas

**Como empresas fazem:** PostgreSQL ou MySQL são padrão em muitas empresas. NoSQL (MongoDB) em casos de alta volumetria ou dados variáveis.

---

### Ferramentas auxiliares

| Ferramenta | Para que serve | Por que usar |
|------------|----------------|--------------|
| Docker | Containerização (back, front, banco) | Ambiente igual em dev e produção |
| Git | Controle de versão | Trabalho em equipe, histórico, branches |
| Postman | Testar APIs | Validar endpoints antes ou junto ao frontend |
| Prisma ou TypeORM | ORM (acesso ao banco) | Evitar SQL puro, migrations, tipos |

---

## 4. Arquitetura da Solução

### Visão geral (alto nível)

```
┌─────────────────┐     HTTP/JSON      ┌─────────────────┐     SQL       ┌─────────────────┐
│   Frontend      │ ◄────────────────► │   Backend       │ ◄───────────► │   PostgreSQL    │
│   React + Vite  │     (API REST)     │   Node + Express│               │   (Banco)       │
└─────────────────┘                    └─────────────────┘               └─────────────────┘
        │                                       │
        │                                       │
   Navegador do usuário                    Camada em camadas:
                                          Controller → Service → Repository
```

### Arquitetura do backend (Controller → Service → Repository)

Cada requisição passa por:

1. **Controller** — Recebe a requisição HTTP, extrai dados, chama o Service, devolve a resposta
2. **Service** — Regras de negócio, validações, orquestra chamadas ao Repository
3. **Repository** — Acesso ao banco (SELECT, INSERT, UPDATE, DELETE)
4. **Model** — Estrutura dos dados (tabelas, tipos)

**Exemplo prático:** "Criar um chamado"

```
Cliente (Postman/React)  →  POST /api/chamados { titulo, descricao }
         ↓
   ChamadoController.create(req, res)
         ↓
   ChamadoService.criar(dados, userId)  ← valida, aplica regras
         ↓
   ChamadoRepository.insert(chamado)    ← salva no PostgreSQL
         ↓
   Resposta: { id: 1, titulo: "...", status: "aberto", ... }
```

**Por que separar em camadas?**

- **Manutenção** — Cada camada tem responsabilidade clara
- **Testes** — Service e Repository podem ser testados separadamente
- **Reuso** — Um Service pode ser usado por Controller e por outro Service
- **Mudança de tecnologia** — Trocar banco altera só o Repository

---

## 5. Desenho da Arquitetura (Diagrama)

### Entidades principais

```
┌──────────────┐       ┌─────────────────┐       ┌──────────────────┐
│   Usuario    │       │    Chamado      │       │   Comentario     │
├──────────────┤       ├─────────────────┤       ├──────────────────┤
│ id           │  1   *│ id              │  1   *│ id               │
│ nome         │───┼──►│ usuario_id (FK) │───┼──►│ chamado_id (FK)  │
│ email        │       │ titulo          │       │ usuario_id (FK)  │
│ senha_hash   │       │ descricao       │       │ texto            │
│ role         │       │ status          │       │ created_at       │
│ created_at   │       │ prioridade      │       └──────────────────┘
└──────────────┘       │ created_at      │
                       └─────────────────┘
```

- **1 usuário** pode ter **vários chamados**
- **1 chamado** pode ter **vários comentários**
- Cada comentário pertence a **1 chamado** e **1 usuário**

---

## 6. Como empresas fazem

1. **Documentação** — Projeto real tem PRD (Product Requirements Document), wireframes, fluxos
2. **Revisão de requisitos** — Product Owner e Tech Lead validam escopo antes do desenvolvimento
3. **Sprint** — Trabalho em sprints (2 semanas é comum)
4. **Code review** — Merge apenas com aprovação de outro dev
5. **CI/CD** — Testes e deploy automatizados
6. **Monitoreamento** — Logs, métricas, alertas em produção

---

## 7. Exercícios para fixar

### Exercício 1 — Pensamento de produto
Liste 3 funcionalidades extras que um Help Desk de uma empresa média poderia ter (ex: anexar arquivos, SLA, integração com e-mail).

### Exercício 2 — Alternativas
Se a stack fosse **Python + Django + SQLite**, como você explicaria essa escolha para um cliente? Quais vantagens e desvantagens?

### Exercício 3 — Camadas
No fluxo "Deletar um chamado", descreva em uma frase o que cada camada faria: Controller, Service e Repository.

### Exercício 4 — Diagrama
Desenhe no papel (ou em um editor) as tabelas `usuarios`, `chamados` e `comentarios` com seus campos e setas de relacionamento.

---

## Próxima etapa

Na **Etapa 2**, vamos modelar o banco de dados em detalhes:
- Tabelas e colunas
- Tipos de dados
- Chaves primárias e estrangeiras
- Normalização

---

*Documento criado para o projeto Help Desk — Etapa 1*
