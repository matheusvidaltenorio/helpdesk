/**
 * Layout - Sidebar vertical escura + área de conteúdo
 */

import { useNavigate, useLocation } from 'react-router-dom';
import { Ticket, PlusCircle, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import styles from './Layout.module.css';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function isActive(path) {
    if (path === '/') return location.pathname === '/' || location.pathname === '/chamados';
    return location.pathname.startsWith(path);
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.logo} onClick={() => navigate('/')}>Help Desk</h1>
        </div>

        <nav className={styles.sidebarNav}>
          <button
            type="button"
            onClick={() => navigate('/')}
            className={`${styles.navItem} ${isActive('/') ? styles.navItemActive : ''}`}
          >
            <Ticket size={20} />
            <span>Chamados</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/chamados/novo')}
            className={`${styles.navItem} ${isActive('/chamados/novo') ? styles.navItemActive : ''}`}
          >
            <PlusCircle size={20} />
            <span>Novo chamado</span>
          </button>
          {user?.role === 'admin' && (
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className={`${styles.navItem} ${styles.adminItem} ${isActive('/admin') ? styles.navItemActive : ''}`}
            >
              <Settings size={20} />
              <span>Admin</span>
            </button>
          )}
        </nav>

        <div className={styles.sidebarFooter}>
          <span className={styles.userName}>{user?.nome}</span>
          <button type="button" onClick={handleLogout} className={styles.btnLogout}>
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <main className={styles.main}>{children}</main>
    </div>
  );
}
