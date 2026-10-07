import React from 'react';
import { Play, Heart, Star, MapPin, Clock } from 'lucide-react';
import { Movie } from '../types';

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
  return (
    <div className="group relative flex flex-col bg-[#1B100B] border border-[#3A1F13] rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:border-[#EA580C] hover:shadow-2xl hover:-translate-y-1">
      {/* Poster Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#24130A] cursor-pointer" onClick={() => onOpenDetails(movie)}>
        <img
          src={movie.posterUrl}
          alt={movie.titulo}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Dark gradient on poster */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B100B] via-transparent to-black/30" />

        {/* Location pill */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-[#160D08]/90 border border-[#4E2716] text-[11px] font-semibold text-[#FBD0A4] shadow-md backdrop-blur-sm">
          <MapPin className="w-3 h-3 text-[#EA580C]" />
          <span className="truncate max-w-[120px]">{movie.localizacao.municipio}</span>
        </div>

        {/* Favorite toggle top right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(movie.id);
          }}
          className={`absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full backdrop-blur-md transition ${
            isFavorite
              ? 'bg-[#EA580C] text-white shadow-md'
              : 'bg-black/60 text-[#E5C9A4] hover:bg-black/80 hover:text-white'
          }`}
          title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white' : ''}`} />
        </button>

        {/* Curatorial highlight tag if any */}
        {movie.curadoriaTag && (
          <div className="absolute bottom-2.5 left-2.5 z-10 px-2 py-0.5 rounded text-[10px] font-bold bg-[#C2410C]/90 text-white shadow">
            {movie.curadoriaTag}
          </div>
        )}

        {/* Quick Play overlay on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(movie);
            }}
            className="w-12 h-12 rounded-full bg-[#EA580C] hover:bg-[#F97316] text-white flex items-center justify-center shadow-xl transform transition hover:scale-110"
            title="Assistir agora"
          >
            <Play className="w-5 h-5 fill-white translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Info Content */}
      <div className="p-3.5 flex flex-col flex-1 justify-between bg-[#1B100B]">
        <div>
          {/* Metadata Row: Rating & Year & Duration */}
          <div className="flex items-center justify-between text-[11px] text-[#A67E5D] mb-1.5">
            <div className="flex items-center space-x-1 text-amber-400 font-bold">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{movie.notaMedia.toFixed(1)}</span>
            </div>
            <span>{movie.ano}</span>
            <div className="flex items-center space-x-1">
              <Clock className="w-2.5 h-2.5" />
              <span>{movie.duracaoMinutos}m</span>
            </div>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-[#2C180F] text-[#FCD34D] border border-[#4A2615]">
              {movie.classificacaoIndicativa === 'Livre' ? 'L' : `+${movie.classificacaoIndicativa}`}
            </span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onOpenDetails(movie)}
            className="text-sm font-bold text-[#FDF8F0] hover:text-[#EA580C] transition line-clamp-1 cursor-pointer font-['Cinzel'] tracking-wide"
            title={movie.titulo}
          >
            {movie.titulo}
          </h3>

          {/* Genres */}
          <p className="text-[11px] text-[#B89271] mt-0.5 truncate">
            {movie.genero.join(' • ')}
          </p>
        </div>

        {/* Bottom Direct Buttons */}
        <div className="mt-3 pt-2.5 border-t border-[#2C170E] flex items-center gap-2">
          <button
            onClick={() => onPlay(movie)}
            className="flex-1 py-1.5 rounded-lg bg-[#C2410C]/20 hover:bg-[#C2410C] text-[#FCD34D] hover:text-white border border-[#C2410C]/40 text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Assistir</span>
          </button>

          <button
            onClick={() => onOpenDetails(movie)}
            className="px-2.5 py-1.5 rounded-lg bg-[#27150C] hover:bg-[#381D10] text-[#D8B490] hover:text-[#FFF] border border-[#482414] text-xs font-medium transition"
            title="Ver Ficha Técnica"
          >
            Ficha
          </button>
        </div>
      </div>
    </div>
  );
};
