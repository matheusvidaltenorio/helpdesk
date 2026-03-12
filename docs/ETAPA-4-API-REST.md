# Etapa 4 — API REST (CRUD)

> **Objetivo:** Implementar os endpoints de usuários e chamados seguindo Controller → Service → Repository.

---

## 1. Endpoints

### Usuários

| Método | Rota | Ação |
|--------|------|------|
| POST | /api/usuarios | Criar usuário |
| GET | /api/usuarios | Listar todos |
| GET | /api/usuarios/:id | Buscar por ID |
| PUT | /api/usuarios/:id | Atualizar |
| DELETE | /api/usuarios/:id | Deletar |

### Chamados

| Método | Rota | Ação |
|--------|------|------|
| POST | /api/chamados | Criar chamado |
| GET | /api/chamados | Listar (filtros: status, prioridade) |
| GET | /api/chamados/:id | Buscar por ID (com comentários) |
| PUT | /api/chamados/:id | Atualizar |
| DELETE | /api/chamados/:id | Deletar |

---

## 2. Fluxo Controller → Service → Repository

Cada requisição passa pelas 3 camadas. Exemplo: criar usuário

```
POST /api/usuarios { nome, email, senha }
  → UsuarioController.create extrai dados, chama Service
  → UsuarioService.criar valida, faz hash da senha, chama Repository
  → UsuarioRepository.insert faz INSERT no banco
  → Resposta: { id, nome, email, role } (sem senha_hash)
```

---

## 3. Segurança

- **Nunca** retornar `senha_hash` na API
- Senha deve ser hasheada com bcrypt antes de salvar
- Validações básicas (campos obrigatórios, email único)

---

## 4. Testando com Postman

### Criar usuário
```
POST http://localhost:3000/api/usuarios
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "12345678"
}
```

### Criar chamado (use o id do usuário criado)
```
POST http://localhost:3000/api/chamados
Content-Type: application/json

{
  "titulo": "Computador não liga",
  "descricao": "Ao pressionar o botão, nada acontece.",
  "prioridade": "alta",
  "usuario_id": 1
}
```

### Listar chamados com filtro
```
GET http://localhost:3000/api/chamados?status=aberto
GET http://localhost:3000/api/chamados?prioridade=alta
```

---

## 5. Exercícios

1. Crie um usuário e um chamado via Postman. Confira no banco se os dados foram salvos.
2. O que acontece se enviar `POST /api/usuarios` com email duplicado?
3. Adicione um endpoint `POST /api/chamados/:id/comentarios` para criar comentários.
