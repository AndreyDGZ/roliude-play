import React from 'react';
import { useParams, Link } from 'react-router-dom';

export const FilmeDetalhe: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <Link to="/catalogo" style={{ color: '#aaa', textDecoration: 'none' }}>&larr; Voltar ao Catálogo</Link>
      <h1 style={{ marginTop: '1rem' }}>Detalhes do Filme #{id}</h1>
      <p>Em breve: sinopse, ficha técnica integrada, bastidores e reprodução em vídeo.</p>
    </div>
  );
};
