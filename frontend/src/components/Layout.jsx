/**
 * Layout - Cabeçalho comum das páginas autenticadas
 */

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Layout.module.css';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h1 className={styles.logo} onClick={() => navigate('/')}>Help Desk</h1>
        <nav className={styles.nav}>
          <button type="button" onClick={() => navigate('/')}>Chamados</button>
          <button type="button" onClick={() => navigate('/chamados/novo')}>Novo chamado</button>
          {user?.role === 'admin' && (
            <button type="button" onClick={() => navigate('/admin')} className={styles.adminLink}>
              Admin
            </button>
          )}
        </nav>
        <div className={styles.userArea}>
          <span className={styles.userName}>{user?.nome}</span>
          <button type="button" onClick={handleLogout} className={styles.btnLogout}>
            Sair
          </button>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
