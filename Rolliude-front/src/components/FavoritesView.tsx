import React from 'react';
import { Heart, Film, ArrowRight } from 'lucide-react';
import { Movie } from '../types';
import { MovieCard } from './MovieCard';

interface FavoritesViewProps {
  movies: Movie[];
  favoriteIds: string[];
  onPlay: (movie: Movie) => void;
  onOpenDetails: (movie: Movie) => void;
  onToggleFavorite: (movieId: string) => void;
  onGoToCatalog: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  movies,
  favoriteIds,
  onPlay,
  onOpenDetails,
  onToggleFavorite,
  onGoToCatalog
}) => {
  const favoriteMovies = movies.filter(m => favoriteIds.includes(m.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="p-6 sm:p-10 rounded-2xl bg-gradient-to-r from-[#24130A] to-[#170C06] border border-[#442315] shadow-xl space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#C2410C] text-white">
          <Heart className="w-3.5 h-3.5 fill-white" />
          <span>Minha Lista de Filmes</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-['Cinzel'] text-[#FAF6EE]">
          Obras Favoritas & Para Assistir Depois
        </h1>
        <p className="text-sm text-[#DCC7B3]">
          Seu acervo particular de produções salvas para assistir quando quiser.
        </p>
      </div>

      {favoriteMovies.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#1B0F09] border border-[#381D11] space-y-4">
          <Heart className="w-12 h-12 text-[#EA580C] mx-auto opacity-50" />
          <h3 className="text-lg font-bold text-white">Sua lista ainda está vazia</h3>
          <p className="text-xs text-[#B89271] max-w-md mx-auto">
            Clique no ícone de coração em qualquer pôster de filme para adicionar produções à sua lista pessoal.
          </p>
          <button
            onClick={onGoToCatalog}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#C2410C] hover:bg-[#EA580C] text-white text-xs font-bold transition shadow-lg"
          >
            <span>Explorar Catálogo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {favoriteMovies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onPlay={onPlay}
              onOpenDetails={onOpenDetails}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};
