/**
 * Cliente API - centraliza chamadas ao backend
 * 
 * Usa o token salvo no localStorage para requisições autenticadas.
 * Em produção (deploy separado), configure VITE_API_URL no .env
 */

const API_URL = import.meta.env.VITE_API_URL || '/api';

function getToken() {
  return localStorage.getItem('token');
}

function getHeaders(includeAuth = true) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (includeAuth && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function cadastrar(dados) {
  const res = await fetch(`${API_URL}/usuarios`, {
    method: 'POST',
    headers: getHeaders(false),
    body: JSON.stringify(dados),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao cadastrar');
  return data;
}

export async function login(email, senha) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: getHeaders(false),
    body: JSON.stringify({ email, senha }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro no login');
  return data;
}

export async function getChamados(filtros = {}) {
  const params = new URLSearchParams(filtros).toString();
  const url = params ? `${API_URL}/chamados?${params}` : `${API_URL}/chamados`;
  const res = await fetch(url, { headers: getHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao listar chamados');
  return data;
}

export async function getChamado(id) {
  const res = await fetch(`${API_URL}/chamados/${id}`, { headers: getHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar chamado');
  return data;
}

export async function criarChamado(chamado) {
  const res = await fetch(`${API_URL}/chamados`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(chamado),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao criar chamado');
  return data;
}

export async function atualizarChamado(id, chamado) {
  const res = await fetch(`${API_URL}/chamados/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(chamado),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao atualizar chamado');
  return data;
}

export async function adicionarComentario(chamadoId, texto) {
  const res = await fetch(`${API_URL}/chamados/${chamadoId}/comentarios`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ texto }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao adicionar comentário');
  return data;
}

export async function getUsuarios() {
  const res = await fetch(`${API_URL}/usuarios`, { headers: getHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao listar usuários');
  return data;
}

export async function alterarRoleUsuario(id, role) {
  const res = await fetch(`${API_URL}/usuarios/${id}/role`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ role }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao alterar role');
  return data;
}
