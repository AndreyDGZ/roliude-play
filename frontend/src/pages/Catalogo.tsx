import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Page.module.css';

export const Catalogo: React.FC = () => {
  return (
    <div className={styles.stack}>
      <h1>Catálogo de Filmes</h1>
      <p>Explore nosso acervo de produções brasileiras, regionais e de domínio público.</p>
      <div className={styles.surface}>
        <Link to="/filme/1" className={styles.link}>Exemplo: Ver detalhes do filme #1</Link>
      </div>
    </div>
  );
};
