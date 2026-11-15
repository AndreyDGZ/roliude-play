import React from 'react';
import { Play, Film, Info, Heart, Award, MapPin, Calendar, Clock, Star } from 'lucide-react';
import { Movie } from '../types';

interface HeroBannerProps {
  movie: Movie;
  onPlay: (movie: Movie) => void;
  onOpenDetails: (movie: Movie) => void;
  isFavorite: boolean;
  onToggleFavorite: (movieId: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  movie,
  onPlay,
  onOpenDetails,
  isFavorite,
  onToggleFavorite
}) => {
  return (
    <div className="relative w-full h-[520px] sm:h-[580px] lg:h-[640px] overflow-hidden bg-[#100906]">
      {/* Background with cinematic overlay */}
      <img
        src={movie.backdropUrl}
        alt={movie.titulo}
        className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.45] contrast-[1.1] transform scale-105 transition-transform duration-1000"
      />

      {/* Atmospheric Gradients: Dark earthy vignette and warmth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#120D0A] via-[#120D0A]/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#120D0A] via-[#120D0A]/85 to-transparent w-full lg:w-3/4" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#100906]/90" />

      {/* Content wrapper */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-16 z-10">
        <div className="max-w-2xl space-y-4">
          
          {/* Curatorial badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#C2410C] text-white shadow-lg">
              <Award className="w-3.5 h-3.5" />
              <span>{movie.curadoriaTag || 'Destaque Cultural'}</span>
            </span>

            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#2B170E]/85 border border-[#522915] text-[#FCD34D]">
              <MapPin className="w-3 h-3 text-[#EA580C]" />
              <span>{movie.localizacao.municipio} — {movie.localizacao.estadoSigla}</span>
            </span>

            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-900/60 border border-amber-700/50 text-amber-200">
              {movie.classificacaoIndicativa === 'Livre' ? 'Livre' : `+${movie.classificacaoIndicativa}`}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#FAF6EE] tracking-tight font-['Cinzel'] leading-tight drop-shadow-md">
            {movie.titulo}
          </h1>

          {/* Quick specs */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#D8B490]">
            <div className="flex items-center space-x-1 text-amber-400 font-semibold">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{movie.notaMedia.toFixed(1)}</span>
              <span className="text-[#9E7B5D] text-xs">({movie.avaliacoesCount})</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-[#C2410C]" />
              <span>{movie.ano}</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-[#C2410C]" />
              <span>{movie.duracaoMinutos} min</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Film className="w-3.5 h-3.5 text-[#C2410C]" />
              <span>{movie.genero.slice(0, 2).join(', ')}</span>
            </div>
          </div>

          {/* Synopsis preview */}
          <p className="text-sm sm:text-base text-[#E2D2C0] line-clamp-3 leading-relaxed drop-shadow">
            {movie.sinopse}
          </p>

          {/* Direction preview */}
          <p className="text-xs text-[#B89270]">
            Direção: <span className="text-[#F3E5D4] font-medium">{movie.direcao.join(', ')}</span>
            {movie.elenco.length > 0 && (
              <> • Elenco: <span className="text-[#F3E5D4] font-medium">{movie.elenco.slice(0, 3).map(e => e.nome).join(', ')}</span></>
            )}
          </p>

          {/* Action buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onPlay(movie)}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#C2410C] hover:bg-[#EA580C] text-white font-bold text-sm tracking-wide shadow-xl transform transition hover:-translate-y-0.5 active:translate-y-0"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Assistir Filme</span>
            </button>

            <button
              onClick={() => onOpenDetails(movie)}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-[#28150D]/90 hover:bg-[#3D1E12] text-[#F3E5D4] border border-[#5A2C17] font-semibold text-sm transition hover:border-[#EA580C]"
            >
              <Info className="w-4 h-4 text-[#EA580C]" />
              <span>Ficha Técnica Completa</span>
            </button>

            <button
              onClick={() => onToggleFavorite(movie.id)}
              className={`p-3 rounded-xl border transition ${
                isFavorite
                  ? 'bg-[#C2410C]/20 border-[#EA580C] text-[#EA580C]'
                  : 'bg-[#28150D]/80 border-[#4D2716] text-[#D8B490] hover:text-white hover:border-[#EA580C]'
              }`}
              title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#EA580C]' : ''}`} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
