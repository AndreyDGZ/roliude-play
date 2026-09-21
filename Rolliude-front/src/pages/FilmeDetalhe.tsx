import React from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './Page.module.css';

export const FilmeDetalhe: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className={styles.stack}>
      <Link to="/catalogo" className={styles.link}>Voltar ao catálogo</Link>
      <section className={styles.surface}>
        <h1>Detalhes do Filme #{id}</h1>
        <p>Em breve: sinopse, ficha técnica integrada, bastidores e reprodução em vídeo.</p>
      </section>
    </div>
  );
};
