import React from 'react';
import { Link } from 'react-router-dom';

export const Catalogo: React.FC = () => {
  return (
    <div>
      <h1>Catálogo de Filmes</h1>
      <p>Explore nosso acervo de produções e obras de domínio público.</p>
      <div style={{ marginTop: '1.5rem' }}>
        <Link to="/filme/1" style={{ color: '#e50914' }}>Exemplo: Ver Detalhes do Filme #1</Link>
      </div>
    </div>
  );
};
