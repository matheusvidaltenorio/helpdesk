# Etapa 2 — Modelagem do Banco de Dados

> **Objetivo:** Definir tabelas, tipos de dados, relacionamentos e normalização. O banco é a base do sistema — uma modelagem sólida evita retrabalho.

---

## 1. Conceitos fundamentais

### O que é modelagem de dados?

É o processo de descrever os dados do sistema de forma estruturada: **quais entidades existem**, **quais atributos têm** e **como se relacionam**. Resultado: um schema (esquema) que vira CREATE TABLE no SQL.

### Por que modelar antes de codificar?

| Razão | Explicação |
|-------|------------|
| Evitar retrabalho | Mudar tabelas depois que o código usa é custoso |
| Clareza | Todos entendem a estrutura antes de implementar |
| Integridade | Chaves e constraints garantem dados consistentes |
| Performance | Índices planejados evitam consultas lentas |

---

## 2. Tabelas e colunas

### Tabela: `usuarios`

| Coluna | Tipo | Restrições | Explicação |
|--------|------|------------|------------|
| id | SERIAL | PRIMARY KEY | Identificador único; SERIAL = auto-incremento |
| nome | VARCHAR(100) | NOT NULL | Nome completo; 100 chars é suficiente |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Login; UNIQUE evita duplicados |
| senha_hash | VARCHAR(255) | NOT NULL | Hash bcrypt; nunca guardamos senha em texto puro |
| role | VARCHAR(20) | NOT NULL, DEFAULT 'usuario' | Papel: usuario, atendente, admin |
| created_at | TIMESTAMP | DEFAULT NOW() | Quando foi criado |
| updated_at | TIMESTAMP | DEFAULT NOW() | Última atualização |

**Por que VARCHAR e não TEXT?**
- VARCHAR limita tamanho; TEXT é ilimitado. Para nome/email, limite ajuda a controlar dados e índices.
- 255 para email segue padrão (RFC 5321). Senha_hash do bcrypt tem ~60 caracteres; 255 é folga.

---

### Tabela: `chamados`

| Coluna | Tipo | Restrições | Explicação |
|--------|------|------------|------------|
| id | SERIAL | PRIMARY KEY | Identificador único |
| usuario_id | INT | REFERENCES usuarios(id), NOT NULL | Quem criou; chave estrangeira |
| titulo | VARCHAR(200) | NOT NULL | Título curto do chamado |
| descricao | TEXT | NOT NULL | Descrição detalhada; TEXT para textos longos |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'aberto' | aberto, em_andamento, resolvido |
| prioridade | VARCHAR(20) | NOT NULL, DEFAULT 'media' | baixa, media, alta |
| created_at | TIMESTAMP | DEFAULT NOW() | Data de criação |
| updated_at | TIMESTAMP | DEFAULT NOW() | Última atualização |

**Por que status e prioridade como VARCHAR e não ENUM?**
- ENUM no PostgreSQL existe, mas dificulta mudanças futuras (adicionar novo status exige ALTER TABLE).
- VARCHAR com CHECK constraint é flexível e suficiente para nosso caso.
- Em produção, às vezes usa-se tabela auxiliar `status_chamado` com id e nome (mais normalizado).

---

### Tabela: `comentarios`

| Coluna | Tipo | Restrições | Explicação |
|--------|------|------------|------------|
| id | SERIAL | PRIMARY KEY | Identificador único |
| chamado_id | INT | REFERENCES chamados(id) ON DELETE CASCADE, NOT NULL | Chamado ao qual pertence |
| usuario_id | INT | REFERENCES usuarios(id), NOT NULL | Quem escreveu |
| texto | TEXT | NOT NULL | Conteúdo do comentário |
| created_at | TIMESTAMP | DEFAULT NOW() | Quando foi criado |

**ON DELETE CASCADE:** Se o chamado for deletado, todos os comentários dele são deletados automaticamente. Sem CASCADE, o banco bloquearia o DELETE do chamado.

---

## 3. Relacionamentos

### Diagrama ER (Entidade-Relacionamento)

```
usuarios (1) ──────────────< chamados (N)
    │                              │
    │                              │
    └──────────< comentarios (N) >─┘
                    (cada comentário pertence a 1 chamado e 1 usuário)
```

### Cardinalidade

| Relacionamento | Tipo | Explicação |
|----------------|------|------------|
| usuarios → chamados | 1:N | Um usuário cria vários chamados |
| chamados → comentarios | 1:N | Um chamado tem vários comentários |
| usuarios → comentarios | 1:N | Um usuário escreve vários comentários |

---

## 4. Normalização

**O que é?** Técnica para evitar redundância e inconsistência. As "formas normais" (1NF, 2NF, 3NF) são regras que organizam os dados.

| Forma | Regra | Nosso caso |
|-------|-------|------------|
| 1NF | Cada célula com valor atômico (não repetir grupos) | ✓ Cada campo tem um valor único |
| 2NF | 1NF + colunas dependem da chave toda | ✓ Não há chave composta com dependências parciais |
| 3NF | 2NF + colunas não-chave não dependem de outras não-chave | ✓ Nome não depende de email; cada coluna depende do id |

Nossa modelagem está em 3NF. Não há redundância como "nome do usuário" duplicado em cada chamado — usamos usuario_id e fazemos JOIN quando precisar.

---

## 5. Índices

Índices aceleram buscas. Sem índice, o banco faz "full table scan" (percorre todas as linhas).

| Tabela | Coluna(s) | Motivo |
|--------|-----------|--------|
| usuarios | email | Busca por email no login (UNIQUE já cria índice) |
| chamados | usuario_id | Filtrar "meus chamados" |
| chamados | status | Filtrar por status |
| chamados | created_at | Ordenar por data |
| comentarios | chamado_id | Listar comentários de um chamado |

CREATE INDEX é feito no arquivo SQL do schema.

---

## 6. Como empresas fazem

- **Migrations** — Cada mudança no schema vira um arquivo de migration (ex: `001_create_usuarios.sql`), versionado no Git.
- **ORMs** — Prisma, TypeORM, Sequelize geram migrations a partir do código.
- **Documentação** — Diagramas ER em ferramentas como dbdiagram.io, Draw.io ou Mermaid.
- **Revisão** — DBA ou dev sênior revisa modelagem antes de implementar.

---

## 7. Exercícios

1. **Pensamento:** Se quiséssemos "anexos" em um chamado, como você modelaria? Nova tabela ou coluna JSON?
2. **Alternativa:** Pesquise o tipo ENUM do PostgreSQL. Quando você usaria ENUM em vez de VARCHAR?
3. **Prática:** Execute o script `database/schema.sql` no PostgreSQL e confira se as tabelas foram criadas.

---

## Próxima etapa

Na **Etapa 3**, vamos criar a estrutura do backend: pastas, package.json, Express e conexão com o banco.
