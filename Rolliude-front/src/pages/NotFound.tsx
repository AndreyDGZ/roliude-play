import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1>404 - Página Não Encontrada</h1>
      <p>O conteúdo que você tentou acessar não existe.</p>
      <Link to="/" style={{ color: '#e50914', textDecoration: 'none', fontWeight: 'bold' }}>Voltar para a página inicial</Link>
    </div>
  );
};
