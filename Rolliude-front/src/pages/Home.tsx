import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import styles from './Page.module.css';

export const Home: React.FC = () => {
  const [backendStatus, setBackendStatus] = useState<string>('Verificando conexão...');

  useEffect(() => {
    api.getHealth()
      .then(response => setBackendStatus(`Online (${response.status})`))
      .catch(() => setBackendStatus('Offline (Backend não detectado)'));
  }, []);

  return (
    <div className={styles.stack}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Rolliúde Play</h1>
        <p>O cinema da nossa terra na sua tela.</p>
        <p>Uma plataforma para valorizar, descobrir e assistir ao cinema brasileiro e regional.</p>
      </section>
      <section className={styles.surface}>
        <strong>Status da API Backend:</strong> {backendStatus}
      </section>
    </div>
  );
};
