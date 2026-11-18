import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Play, Heart, Star, MapPin, Clock } from 'lucide-react';
import { Movie } from '../types';
import { isJustReleased, isNewRelease } from '../data/releases';

const NEW_TAG_PULSE = { scale: [1, 1.18, 1, 1.18, 1] };

interface MovieCardProps {
  movie: Movie;
  onPlay: (movie: Movie) => void;
  onOpenDetails: (movie: Movie) => void;
  isFavorite: boolean;
  onToggleFavorite: (movieId: string) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onPlay,
  onOpenDetails,
  isFavorite,
  onToggleFavorite
}) => {
  const reduceMotion = useReducedMotion();
  const isNew = isNewRelease(movie);
  const shouldPulse = isNew && isJustReleased(movie) && !reduceMotion;

  return (
    <div className="group relative flex flex-col bg-brand-bg border border-brand-border rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:border-brand-accent hover:shadow-2xl hover:-translate-y-1">
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-brand-surface cursor-pointer" onClick={() => onOpenDetails(movie)}>
        <img
          src={movie.posterUrl}
          alt={movie.titulo}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-transparent to-black/30" />

        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col items-start gap-1.5">
          {isNew && (
            <motion.span
              animate={shouldPulse ? NEW_TAG_PULSE : undefined}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="px-2 py-0.5 rounded-full bg-brand-primary text-white text-[10px] font-bold shadow-md"
            >
              Novo
            </motion.span>
          )}
          <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-brand-bg/90 border border-brand-border text-[11px] font-semibold text-brand-text shadow-md backdrop-blur-sm">
            <MapPin className="w-3 h-3 text-brand-accent" />
            <span className="truncate max-w-[120px]">{movie.localizacao.municipio}</span>
          </div>
        </div>

        <button
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite(movie.id);
          }}
          className={`absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full backdrop-blur-md transition ${
            isFavorite
              ? 'bg-brand-accent text-white shadow-md'
              : 'bg-black/60 text-brand-text-soft hover:bg-black/80 hover:text-white'
          }`}
          title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white' : ''}`} />
        </button>

        {movie.curadoriaTag && (
          <div className="absolute bottom-2.5 left-2.5 z-10 px-2 py-0.5 rounded text-[10px] font-bold bg-brand-primary/90 text-white shadow">
            {movie.curadoriaTag}
          </div>
        )}

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={(event) => {
              event.stopPropagation();
              onPlay(movie);
            }}
            className="w-12 h-12 rounded-full bg-brand-accent hover:bg-brand-accent text-white flex items-center justify-center shadow-xl transform transition hover:scale-110"
            title="Assistir agora"
          >
            <Play className="w-5 h-5 fill-white translate-x-0.5" />
          </button>
        </div>
      </div>

      <div className="p-3.5 flex flex-col flex-1 justify-between bg-brand-bg">
        <div>
          <div className="flex items-center justify-between text-[11px] text-brand-text-muted mb-1.5">
            <div className="flex items-center space-x-1 text-brand-star font-bold">
              <Star className="w-3 h-3 fill-brand-star" />
              <span>{movie.notaMedia.toFixed(1)}</span>
            </div>
            <span>{movie.ano}</span>
            <div className="flex items-center space-x-1">
              <Clock className="w-2.5 h-2.5" />
              <span>{movie.duracaoMinutos}m</span>
            </div>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-brand-surface text-brand-star border border-brand-border">
              {movie.classificacaoIndicativa === 'Livre' ? 'L' : `+${movie.classificacaoIndicativa}`}
            </span>
          </div>

          <h3 
            onClick={() => onOpenDetails(movie)}
            className="text-sm font-bold text-brand-text hover:text-brand-accent transition line-clamp-1 cursor-pointer font-display tracking-wide"
            title={movie.titulo}
          >
            {movie.titulo}
          </h3>

          <p className="text-[11px] text-brand-text-muted mt-0.5 truncate">
            {movie.genero.join(' • ')}
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-brand-border flex items-center gap-2">
          <button
            onClick={() => onPlay(movie)}
            className="flex-1 py-1.5 rounded-lg bg-brand-primary/20 hover:bg-brand-primary text-brand-star hover:text-white border border-brand-primary/40 text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Assistir</span>
          </button>

          <button
            onClick={() => onOpenDetails(movie)}
            className="px-2.5 py-1.5 rounded-lg bg-brand-surface hover:bg-brand-surface-raised text-brand-text-soft hover:text-white border border-brand-border text-xs font-medium transition"
            title="Ver Ficha Técnica"
          >
            Ficha
          </button>
        </div>
      </div>
    </div>
  );
};
