import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Page.module.css';

interface Movie {
  id: string;
  title: string;
  genre: string;
  year?: number | string;
  publicado?: boolean;
}

export const Dashboard: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminMovies = async () => {
      try {
        const adminUrl = 'http:/' + '/localhost:3000/api/movies';
        const token = sessionStorage.getItem('token') || sessionStorage.getItem('@Rolliude:token');

        const response = await fetch(adminUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const resData = await response.json();
          const list = resData.data || resData;
          if (Array.isArray(list)) {
            setMovies(list);
          }
        }
      } catch {
        setMovies([]);
      } finally {
        setCarregando(false);
      }
    };

    fetchAdminMovies();
  }, []);

  return (
    <div className={styles.formPage}>
      <h1>Gerenciamento de Filmes</h1>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => navigate('/admin/filmes/novo')}
          style={{
            padding: '10px 16px',
            backgroundColor: '#FF9200',
            color: '#FFF',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          + Cadastrar Novo Filme
        </button>
      </div>

      {carregando ? (
        <p>Carregando filmes...</p>
      ) : (
        <div>
          <p style={{ marginBottom: '16px' }}>Total de cadastros: {movies.length}</p>

          <ul style={{ listStyle: 'none', padding: 0 }}>
            {movies.map((movie) => (
              <li
                key={movie.id}
                style={{
                  padding: '12px',
                  border: '1px solid #E0E0E0',
                  borderRadius: '6px',
                  marginBottom: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>
                  <strong>{movie.title}</strong> — {movie.genre}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};