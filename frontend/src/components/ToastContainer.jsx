/**
 * ToastContainer - Renderiza toasts na tela
 */

import Toast from './Toast';
import { useToast } from '../contexts/ToastContext';
import styles from './ToastContainer.module.css';

export default function ToastContainer() {
  const { toasts, removerToast } = useToast();

  return (
    <div className={styles.container} aria-live="polite">
      {toasts.map((t) => (
        <Toast
          key={t.id}
          id={t.id}
          tipo={t.tipo}
          mensagem={t.mensagem}
          onFechar={removerToast}
        />
      ))}
    </div>
  );
}
