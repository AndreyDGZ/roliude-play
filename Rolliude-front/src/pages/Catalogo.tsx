import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Catalogo.module.css';

interface Movie {
  id: string;
  title: string;
  year?: number | string;
  genre: string;
  state?: string;
  coverUrl?: string;
}

const MOCK_MOVIES: Movie[] = [
  { id: '1', title: 'Terra de Cabaceiras', year: 2022, genre: 'Documentário', state: 'PB' },
  { id: '2', title: 'Retirantes', year: 2021, genre: 'Drama', state: 'PB' },
  { id: '3', title: 'Festa de Reis', year: 2023, genre: 'Curta-metragem', state: 'PB' },
  { id: '4', title: 'Rio Paraíba', year: 2020, genre: 'Documentário', state: 'PB' },
  { id: '5', title: 'Aboio da Serra', year: 2024, genre: 'Drama', state: 'PE' },
  { id: '6', title: 'Jangada', year: 2019, genre: 'Drama', state: 'CE' },
];

export const Catalogo: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [busca, setBusca] = useState('');
  const [generosSelecionados, setGenerosSelecionados] = useState<string[]>([]);
  const [estadoPB, setEstadoPB] = useState(false);
  const [carregando, setCarregando] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const moviesUrl = 'http:/' + '/localhost:3000/api/movies';
      const response = await fetch(moviesUrl);
      if (response.ok) {
        const resData = await response.json();
        const apiMovies = resData.data || resData;
        setMovies(Array.isArray(apiMovies) && apiMovies.length > 0 ? apiMovies : MOCK_MOVIES);
      } else {
        setMovies(MOCK_MOVIES);
      }
    } catch {
      setMovies(MOCK_MOVIES);
    } finally {
      setCarregando(false);
    }
  };

  const handleGenreToggle = (genre: string) => {
    setGenerosSelecionados((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleClearFilters = () => {
    setBusca('');
    setGenerosSelecionados([]);
    setEstadoPB(false);
  };

  const filmesFiltrados = movies.filter((movie) => {
    const tituloMatch = movie.title.toLowerCase().includes(busca.toLowerCase());
    const generoMatch =
      generosSelecionados.length === 0 || generosSelecionados.includes(movie.genre);
    const estadoMatch = !estadoPB || movie.state === 'PB';
    return tituloMatch && generoMatch && estadoMatch;
  });

  const getGradientClass = (index: number) => {
    const gradients = [styles.g1, styles.g2, styles.g3, styles.g4];
    return gradients[index % gradients.length];
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1>Catálogo</h1>
        <p className={styles.breadcrumb}>
          Catálogo de produções
          {(busca || generosSelecionados.length > 0 || estadoPB) && (
            <button className={styles.clearFiltersBtn} onClick={handleClearFilters}>
              Limpar Filtros
            </button>
          )}
        </p>

        <div className={styles.searchRow}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar por título, diretor, município..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <button type="button" className={styles.sortBtn}>
            Ordenar ▾
          </button>
        </div>
      </div>

      <div className={styles.catalogLayout}>
        <aside className={styles.filterBox}>
          <div className={styles.filterGroup}>
            <h4>Localização</h4>
            <label className={styles.filterOpt}>
              <input
                type="checkbox"
                checked={estadoPB}
                onChange={(e) => setEstadoPB(e.target.checked)}
              />
              Paraíba
            </label>
          </div>

          <div className={styles.filterGroup}>
            <h4>Gênero</h4>
            {['Drama', 'Documentário', 'Curta-metragem', 'Comédia'].map((genero) => (
              <label key={genero} className={styles.filterOpt}>
                <input
                  type="checkbox"
                  checked={generosSelecionados.includes(genero)}
                  onChange={() => handleGenreToggle(genero)}
                />
                {genero}
              </label>
            ))}
          </div>

          <div className={styles.filterGroup}>
            <h4>Ano</h4>
            <div className={styles.filterOpt}>
              <span>1990 — 2026</span>
            </div>
          </div>
        </aside>

        <div>
          <div className={styles.resultsTop}>
            <span>
              {carregando
                ? 'Carregando filmes...'
                : `${filmesFiltrados.length} filme(s) encontrado(s)`}
            </span>
          </div>

          <div className={styles.grid4}>
            {filmesFiltrados.map((movie, index) => (
              <article
                key={movie.id}
                className={styles.card}
                onClick={() => navigate(`/filme/${movie.id}`)}
              >
                <div
                  className={`${styles.art} ${!movie.coverUrl ? getGradientClass(index) : ''}`}
                  style={movie.coverUrl ? { backgroundImage: `url(${movie.coverUrl})` } : undefined}
                >
                  {movie.state && <span className={styles.badge}>{movie.state}</span>}
                </div>
                <div className={styles.info}>
                  <h4>{movie.title}</h4>
                  <p>
                    {movie.year ? `${movie.year} · ` : ''}
                    {movie.genre}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {!carregando && filmesFiltrados.length === 0 && (
            <p style={{ marginTop: '24px', color: 'rgba(36,26,16,0.62)' }}>
              Nenhum filme encontrado com os filtros selecionados.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};