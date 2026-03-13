/**
 * Página principal - Lista de chamados
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getChamados } from '../services/api';
import styles from './Chamados.module.css';

export default function Chamados() {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const navigate = useNavigate();

  async function carregar() {
    setLoading(true);
    setErro('');
    try {
      const dados = await getChamados(
        filtroStatus ? { status: filtroStatus } : {}
      );
      setChamados(dados);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, [filtroStatus]);

  function formatarStatus(s) {
    const map = { aberto: 'Aberto', em_andamento: 'Em andamento', resolvido: 'Resolvido' };
    return map[s] || s;
  }

  function badgePrioridade(p) {
    const cores = { baixa: 'badgeBaixa', media: 'badgeMedia', alta: 'badgeAlta' };
    return cores[p] || 'badgeMedia';
  }

  return (
    <Layout>
      <div className={styles.toolbar}>
        <h2>Meus chamados</h2>
        <div className={styles.actions}>
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className={styles.select}
          >
            <option value="">Todos os status</option>
            <option value="aberto">Aberto</option>
            <option value="em_andamento">Em andamento</option>
            <option value="resolvido">Resolvido</option>
          </select>
          <button
            type="button"
            onClick={() => navigate('/chamados/novo')}
            className={styles.btnNovo}
          >
            Novo chamado
          </button>
        </div>
      </div>

      {erro && <p className={styles.erro}>{erro}</p>}

      {loading ? (
        <p className={styles.loading}>Carregando...</p>
      ) : chamados.length === 0 ? (
        <p className={styles.vazio}>Nenhum chamado encontrado.</p>
      ) : (
        <ul className={styles.lista}>
          {chamados.map((c) => (
            <li
              key={c.id}
              className={styles.item}
              onClick={() => navigate(`/chamados/${c.id}`)}
            >
              <div className={styles.itemHeader}>
                <span className={styles.itemId}>#{c.id}</span>
                <span className={styles[badgePrioridade(c.prioridade)]}>
                  {(c.prioridade || '').toUpperCase()}
                </span>
                <span className={styles.status}>{formatarStatus(c.status)}</span>
              </div>
              <h3 className={styles.itemTitulo}>{c.titulo}</h3>
              <p className={styles.itemDescricao}>{c.descricao}</p>
              <div className={styles.itemMeta}>
                <span>{c.usuario_nome}</span>
                <span>
                  {new Date(c.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}
