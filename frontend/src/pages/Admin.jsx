/**
 * Página - Painel administrativo (apenas admin)
 * Lista usuários e permite alterar role (usuario, atendente, admin)
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { getUsuarios, alterarRoleUsuario } from '../services/api';
import styles from './Admin.module.css';

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    async function carregar() {
      try {
        const dados = await getUsuarios();
        setUsuarios(dados);
      } catch (err) {
        setErro(err.message);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [user]);

  async function handleAlterarRole(usuarioId, novaRole) {
    try {
      await alterarRoleUsuario(usuarioId, novaRole);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === usuarioId ? { ...u, role: novaRole } : u))
      );
    } catch (err) {
      setErro(err.message);
    }
  }

  function formatarRole(role) {
    const map = {
      usuario: 'Usuário',
      atendente: 'Atendente',
      admin: 'Admin',
    };
    return map[role] || role;
  }

  if (loading) {
    return (
      <Layout>
        <p className={styles.loading}>Carregando...</p>
      </Layout>
    );
  }

  if (erro) {
    return (
      <Layout>
        <p className={styles.erro}>{erro}</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.header}>
        <h1>Painel Administrativo</h1>
        <p className={styles.subtitle}>Gerencie os perfis dos usuários</p>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Perfil</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nome}</td>
                <td>{u.email}</td>
                <td>
                  <span className={styles[`badge_${u.role}`]}>
                    {formatarRole(u.role)}
                  </span>
                </td>
                <td>
                  <select
                    value={u.role}
                    onChange={(e) => handleAlterarRole(u.id, e.target.value)}
                    className={styles.select}
                  >
                    <option value="usuario">Usuário</option>
                    <option value="atendente">Atendente</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
