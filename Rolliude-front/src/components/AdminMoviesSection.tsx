import React, { useMemo, useState } from 'react';
import { Pencil, Plus, Search, Star } from 'lucide-react';
import { AdminDeleteButton } from './AdminDeleteButton';
import { AdminStatusMessage } from './AdminStatusMessage';
import { Movie } from '../types';

interface AdminMoviesSectionProps {
  movies: Movie[];
  onCreateMovie: () => void;
  onEditMovie: (movie: Movie) => void;
  onToggleHighlight: (movie: Movie) => Promise<void>;
  onDeleteMovie: (movieId: string) => Promise<void>;
}

const actionClassName =
  'px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-brand-border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent';

export const AdminMoviesSection: React.FC<AdminMoviesSectionProps> = ({
  movies,
  onCreateMovie,
  onEditMovie,
  onToggleHighlight,
  onDeleteMovie
}) => {
  const [searchText, setSearchText] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  const filteredMovies = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();
    if (!normalizedSearch) return movies;
    return movies.filter((movie) => movie.titulo.toLowerCase().includes(normalizedSearch));
  }, [movies, searchText]);

  const runAction = async (action: () => Promise<void>) => {
    setActionError(null);
    try {
      await action();
    } catch {
      setActionError('Não foi possível concluir a ação. Tente novamente.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
          <input
            type="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Filtrar por título..."
            aria-label="Filtrar filmes por título"
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-brand-surface border border-brand-border text-sm text-brand-text placeholder-brand-text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          />
        </div>
        <button
          type="button"
          onClick={onCreateMovie}
          className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-accent text-white text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        >
          <Plus className="w-4 h-4" />
          <span>Nova obra</span>
        </button>
      </div>

      {actionError && <p role="alert" className="text-xs text-brand-accent">{actionError}</p>}

      {filteredMovies.length === 0 ? (
        <AdminStatusMessage message="Nenhum filme encontrado." />
      ) : (
        <ul className="divide-y divide-brand-border rounded-xl bg-brand-surface border border-brand-border">
          {filteredMovies.map((movie) => (
            <li key={movie.id} className="p-3 flex flex-col sm:flex-row sm:items-center gap-3">
              <img src={movie.posterUrl} alt={`Pôster de ${movie.titulo}`} className="w-10 h-14 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-brand-text truncate">{movie.titulo}</p>
                <p className="text-xs text-brand-text-soft">
                  <span className="font-mono">{movie.ano}</span> · {movie.localizacao.municipio}/{movie.localizacao.estadoSigla}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => runAction(() => onToggleHighlight(movie))}
                  aria-pressed={movie.destaqueCuradoria === true}
                  aria-label={movie.destaqueCuradoria ? `Tirar ${movie.titulo} do destaque` : `Destacar ${movie.titulo} na curadoria`}
                  className={`${actionClassName} ${movie.destaqueCuradoria ? 'bg-brand-surface-raised text-brand-star' : 'bg-brand-bg text-brand-text-soft'}`}
                >
                  <Star className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onEditMovie(movie)}
                  aria-label={`Editar ${movie.titulo}`}
                  className={`${actionClassName} bg-brand-bg text-brand-text-soft hover:text-brand-text`}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <AdminDeleteButton itemLabel={movie.titulo} onConfirm={() => runAction(() => onDeleteMovie(movie.id))} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
