import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Page.module.css';

interface Movie {
  id: string;
  title: string;
  genre: string;
  coverUrl?: string;
}

export const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [carregando, setCarregando] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // 1. Identifica o perfil do utilizador logado
    const rawUser = localStorage.getItem('user') || localStorage.getItem('@Rolliude:user');
    if (rawUser) {
      try {
        const parsedUser = JSON.parse(rawUser);
        setUser(parsedUser);
        
        const role = String(parsedUser?.role || parsedUser?.tipo || '').toUpperCase();
        setIsAdmin(role === 'ADMIN' || parsedUser?.isAdmin === true);
      } catch (err) {
        console.error('Erro ao ler utilizador:', err);
      }
    }

    // 2. Busca a lista de filmes
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/movies');
      if (response.ok) {
        const data = await response.json();
        setMovies(data.data || data || []);
      }
    } catch (err) {
      console.error('Erro ao carregar catálogo:', err);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Catálogo de Filmes</h1>
          {user && <p style={{ color: '#666' }}>Bem-vindo(a), {user.nome || user.name}!</p>}
        </div>
      </header>

      {/* BLOCO DE MÉTRICAS: Visível APENAS para Administradores */}
      {isAdmin && (
        <section style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px', 
          marginBottom: '32px',
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>Total de Utilizadores</h3>
            <p style={{ margin: '8px 0 0', fontSize: '1.5rem', fontWeight: 'bold' }}>8,405</p>
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>Visualizações Hoje</h3>
            <p style={{ margin: '8px 0 0', fontSize: '1.5rem', fontWeight: 'bold' }}>45K</p>
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>Filmes Cadastrados</h3>
            <p style={{ margin: '8px 0 0', fontSize: '1.5rem', fontWeight: 'bold' }}>{movies.length}</p>
          </div>
        </section>
      )}

      {/* CATÁLOGO DE FILMES: Visível para Todos os Utilizadores */}
      <section>
        <h2 style={{ marginBottom: '16px' }}>
          {isAdmin ? 'Visão Geral do Catálogo' : 'Destaques do Cinema'}
        </h2>

        {carregando ? (
          <p>A carregar filmes...</p>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
            gap: '20px' 
          }}>
            {movies.length > 0 ? (
              movies.map((movie) => (
                <div 
                  key={movie.id} 
                  onClick={() => navigate(`/filme/${movie.id}`)}
                  style={{ 
                    cursor: 'pointer', 
                    border: '1px solid #ddd', 
                    borderRadius: '8px', 
                    overflow: 'hidden',
                    backgroundColor: '#fff'
                  }}
                >
                  <img 
                    src={movie.coverUrl || '/placeholder-movie.jpg'} 
                    alt={movie.title}
                    style={{ width: '100%', height: '240px', objectFit: 'cover' }} 
                  />
                  <div style={{ padding: '12px' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem' }}>{movie.title}</h3>
                    <span style={{ fontSize: '0.85rem', color: '#777' }}>{movie.genre}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>Nenhum filme disponível no momento.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};