/**
 * Layout - Cabeçalho comum das páginas autenticadas
 */

import { useNavigate } from 'react-router-dom';
import { Ticket, PlusCircle, Settings, LogOut, Menu } from 'lucide-react';
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
          <button type="button" onClick={() => navigate('/')} className={styles.navBtn}>
            <Ticket size={18} />
            <span>Chamados</span>
          </button>
          <button type="button" onClick={() => navigate('/chamados/novo')} className={styles.navBtn}>
            <PlusCircle size={18} />
            <span>Novo chamado</span>
          </button>
          {user?.role === 'admin' && (
            <button type="button" onClick={() => navigate('/admin')} className={styles.adminLink}>
              <Settings size={18} />
              <span>Admin</span>
            </button>
          )}
        </nav>
        <div className={styles.userArea}>
          <span className={styles.userName}>{user?.nome}</span>
          <button type="button" onClick={handleLogout} className={styles.btnLogout}>
            <LogOut size={16} />
            <span>Sair</span>
          </button>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
