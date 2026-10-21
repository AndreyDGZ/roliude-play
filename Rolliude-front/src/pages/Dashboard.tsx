import React, { useEffect, useState } from 'react';
import styles from './Page.module.css';

interface UserData {
  nome?: string;
  email?: string;
  role?: string;
  tipo?: string;
  isAdmin?: boolean;
}

interface Movie {
  id: string;
  title: string;
  genre: string;
  coverUrl?: string;
}

export const Dashboard: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const rawUser = sessionStorage.getItem('user') || sessionStorage.getItem('@Rolliude:user');
    if (rawUser) {
      try {
        const parsedUser = JSON.parse(rawUser) as UserData;
        setUser(parsedUser);

        const role = String(parsedUser.role || parsedUser.tipo || '').toUpperCase();
        setIsAdmin(role === 'ADMIN' || parsedUser.isAdmin === true);
      } catch {
        setUser(null);
      }
    }
    setCarregando(false);
  }, []);

  return (
    <div className={styles.container}>
      <h2>Painel Administrativo</h2>
      {carregando ? (
        <p>Carregando...</p>
      ) : (
        <div>
          <p>Bem-vindo, {user?.nome || 'Administrador'}!</p>

          {isAdmin ? (
            <div style={{ marginTop: '2rem' }}>
              <h3>Métricas e Gestão</h3>
              <p>Total de filmes cadastrados no catálogo: {movies.length}</p>
            </div>
          ) : (
            <p>Acesso restrito apenas a administradores.</p>
          )}
        </div>
      )}
    </div>
  );
};