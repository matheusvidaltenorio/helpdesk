/**
 * Página - Detalhe do chamado (com comentários)
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getChamado, adicionarComentario, atualizarChamado } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import styles from './ChamadoDetalhe.module.css';

export default function ChamadoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chamado, setChamado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [textoComentario, setTextoComentario] = useState('');
  const [enviando, setEnviando] = useState(false);

  const { user } = useAuth();
  const podeAlterarStatus = user?.role === 'atendente' || user?.role === 'admin';

  async function carregar() {
    try {
      const dados = await getChamado(id);
      setChamado(dados);
      setErro('');
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAlterarStatus(e) {
    const novoStatus = e.target.value;
    if (!novoStatus || novoStatus === chamado.status) return;
    try {
      await atualizarChamado(id, { status: novoStatus });
      setChamado((prev) => ({ ...prev, status: novoStatus }));
    } catch (err) {
      setErro(err.message);
    }
  }

  useEffect(() => {
    carregar();
  }, [id]);

  async function handleEnviarComentario(e) {
    e.preventDefault();
    if (!textoComentario.trim()) return;
    setEnviando(true);
    try {
      await adicionarComentario(id, textoComentario);
      setTextoComentario('');
      await carregar();
    } catch (err) {
      setErro(err.message);
    } finally {
      setEnviando(false);
    }
  }

  function formatarStatus(s) {
    const map = { aberto: 'Aberto', em_andamento: 'Em andamento', resolvido: 'Resolvido' };
    return map[s] || s;
  }

  if (loading) return <Layout><p className={styles.loading}>Carregando...</p></Layout>;
  if (erro) return <Layout><p className={styles.erro}>{erro}</p></Layout>;
  if (!chamado) return null;

  return (
    <Layout>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className={styles.btnVoltar}
      >
        ← Voltar
      </button>

      <article className={styles.card}>
        <div className={styles.header}>
          <span className={styles.id}>#{chamado.id}</span>
          <span className={styles[`badge_${chamado.prioridade}`]}>{chamado.prioridade}</span>
          {podeAlterarStatus ? (
            <select
              value={chamado.status}
              onChange={handleAlterarStatus}
              className={styles.selectStatus}
            >
              <option value="aberto">Aberto</option>
              <option value="em_andamento">Em andamento</option>
              <option value="resolvido">Resolvido</option>
            </select>
          ) : (
            <span className={styles.status}>{formatarStatus(chamado.status)}</span>
          )}
        </div>
        <h1 className={styles.titulo}>{chamado.titulo}</h1>
        <p className={styles.descricao}>{chamado.descricao}</p>
        <div className={styles.meta}>
          <span>Por {chamado.usuario_nome}</span>
          <span>{new Date(chamado.created_at).toLocaleString('pt-BR')}</span>
        </div>
      </article>

      <section className={styles.comentarios}>
        <h3>Comentários ({chamado.comentarios?.length || 0})</h3>

        {chamado.comentarios?.length > 0 && (
          <ul>
            {chamado.comentarios.map((c) => (
              <li key={c.id} className={styles.comentario}>
                <div className={styles.comentarioHeader}>
                  <strong>{c.usuario_nome}</strong>
                  <span>{new Date(c.created_at).toLocaleString('pt-BR')}</span>
                </div>
                <p>{c.texto}</p>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleEnviarComentario} className={styles.formComentario}>
          <textarea
            value={textoComentario}
            onChange={(e) => setTextoComentario(e.target.value)}
            placeholder="Escreva um comentário..."
            rows={3}
            disabled={enviando}
          />
          <button type="submit" disabled={enviando || !textoComentario.trim()}>
            {enviando ? 'Enviando...' : 'Enviar comentário'}
          </button>
        </form>
      </section>
    </Layout>
  );
}
