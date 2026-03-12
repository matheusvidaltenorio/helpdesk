/**
 * Página - Criar novo chamado
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { criarChamado } from '../services/api';
import styles from './NovoChamado.module.css';

export default function NovoChamado() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prioridade, setPrioridade] = useState('media');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      const chamado = await criarChamado({ titulo, descricao, prioridade });
      navigate(`/chamados/${chamado.id}`);
    } catch (err) {
      setErro(err.message || 'Erro ao criar chamado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className={styles.header}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={styles.btnVoltar}
        >
          ← Voltar
        </button>
        <h2>Novo chamado</h2>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="titulo">Título</label>
          <input
            id="titulo"
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            placeholder="Ex: Computador não liga"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
            rows={5}
            placeholder="Descreva o problema em detalhes..."
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="prioridade">Prioridade</label>
          <select
            id="prioridade"
            value={prioridade}
            onChange={(e) => setPrioridade(e.target.value)}
          >
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </select>
        </div>
        {erro && <p className={styles.erro}>{erro}</p>}
        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={styles.btnCancelar}
          >
            Cancelar
          </button>
          <button type="submit" disabled={loading} className={styles.btnSalvar}>
            {loading ? 'Salvando...' : 'Criar chamado'}
          </button>
        </div>
      </form>
    </Layout>
  );
}
