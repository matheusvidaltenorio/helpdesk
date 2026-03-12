# Etapa 6 — Frontend React

> **Objetivo:** Criar a interface do usuário com React + Vite, consumo da API e autenticação.

---

## 1. Estrutura criada

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Cabeçalho + área de conteúdo
│   │   └── Layout.module.css
│   ├── contexts/
│   │   └── AuthContext.jsx     # Estado global de autenticação
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Chamados.jsx        # Lista de chamados
│   │   ├── NovoChamado.jsx     # Formulário de criação
│   │   └── ChamadoDetalhe.jsx  # Detalhe + comentários
│   ├── services/
│   │   └── api.js              # Funções que chamam o backend
│   ├── App.jsx                 # Rotas
│   ├── main.jsx
│   └── index.css
├── vite.config.js              # Proxy /api → localhost:3000
└── package.json
```

---

## 2. Conceitos usados

### AuthContext
- Mantém `user` e `token` no `localStorage` + estado React
- `login()` salva token e redireciona
- `logout()` limpa e redireciona para /login

### Rotas protegidas
- `RotaProtegida` verifica `isAuthenticated`
- Se não logado, redireciona para `/login`

### Proxy (vite.config.js)
- Requisições para `/api/*` são redirecionadas para `http://localhost:3000`
- Evita problema de CORS e permite usar caminhos relativos

---

## 3. Como rodar

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Acesse `http://localhost:5173` (porta padrão do Vite).

---

## 4. Fluxo do usuário

1. Acessa → redireciona para /login (se não logado)
2. Faz login → token salvo → redireciona para /
3. Lista chamados, clica em "Novo chamado", preenche e salva
4. Clica em um chamado → vê detalhe e comentários
