/**
 * Toast - Notificação temporária de sucesso ou erro
 */

import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import styles from './Toast.module.css';

export default function Toast({ id, tipo, mensagem, onFechar, duracao = 4000 }) {
  useEffect(() => {
    const timer = setTimeout(() => onFechar(id), duracao);
    return () => clearTimeout(timer);
  }, [id, duracao, onFechar]);

  const Icone = tipo === 'sucesso' ? CheckCircle : XCircle;

  return (
    <div
      className={`${styles.toast} ${styles[tipo]}`}
      role="alert"
    >
      <Icone size={20} className={styles.icone} />
      <span>{mensagem}</span>
      <button
        type="button"
        onClick={() => onFechar(id)}
        className={styles.btnFechar}
        aria-label="Fechar"
      >
        <X size={16} />
      </button>
    </div>
  );
}
