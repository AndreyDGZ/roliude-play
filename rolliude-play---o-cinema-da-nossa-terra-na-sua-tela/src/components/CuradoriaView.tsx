import React, { useState } from 'react';
import { Sparkles, Award, MapPin, Film, Compass, ChevronRight } from 'lucide-react';
import { Movie } from '../types';
import { MovieCard } from './MovieCard';

interface CuradoriaViewProps {
  movies: Movie[];
  onPlay: (movie: Movie) => void;
  onOpenDetails: (movie: Movie) => void;
  favoriteIds: string[];
  onToggleFavorite: (movieId: string) => void;
}

export const CuradoriaView: React.FC<CuradoriaViewProps> = ({
  movies,
  onPlay,
  onOpenDetails,
  favoriteIds,
  onToggleFavorite
}) => {
  const [selectedTheme, setSelectedTheme] = useState<string>('todos');

  const themes = [
    {
      id: 'todos',
      label: 'Todas as Curadorias',
      tagline: 'Panorama completo da curadoria editorial Rolliude Play'
    },
    {
      id: 'cabaceiras',
      label: 'Roliúde Nordestina (Cabaceiras)',
      tagline: 'Obras gravadas na capital cinematográfica do Cariri paraibano'
    },
    {
      id: 'campina',
      label: 'Polo Campina Grande & Agreste',
      tagline: 'O dinamismo cultural e cinematográfico da Rainha da Borborema'
    },
    {
      id: 'resistencia',
      label: 'Cinema de Resistência & Sertão',
      tagline: 'Narrativas anti-hegemônicas e de emancipação cultural'
    },
    {
      id: 'acervo',
      label: 'Acervo & Preservação Histórica',
      tagline: 'Filmes fundadores restaurados para as novas gerações'
    }
  ];

  const getFilteredMovies = () => {
    if (selectedTheme === 'todos') return movies;
    if (selectedTheme === 'cabaceiras') {
      return movies.filter(m => m.localizacao.municipio.toLowerCase().includes('cabaceiras') || m.curadoriaTag?.toLowerCase().includes('roliúde'));
    }
    if (selectedTheme === 'campina') {
      return movies.filter(m => m.localizacao.municipio.toLowerCase().includes('campina'));
    }
    if (selectedTheme === 'resistencia') {
      return movies.filter(m => m.genero.includes('Cinema de Resistência') || m.curadoriaTag?.toLowerCase().includes('resistência'));
    }
    if (selectedTheme === 'acervo') {
      return movies.filter(m => m.ano <= 2005 || m.curadoriaTag?.toLowerCase().includes('patrimônio') || m.curadoriaTag?.toLowerCase().includes('acervo'));
    }
    return movies;
  };

  const currentMovies = getFilteredMovies();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Banner */}
      <div className="relative rounded-2xl p-6 sm:p-10 bg-gradient-to-r from-[#2B140B] via-[#211008] to-[#160B05] border border-[#482515] shadow-2xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#C2410C] text-white">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curadoria Editorial Especializada</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-['Cinzel'] text-[#FAF6EE]">
          Vitrine Cultural & Destaques Regionais
        </h1>
        <p className="text-sm sm:text-base text-[#DCC7B3] max-w-3xl leading-relaxed">
          Diferente dos algoritmos comerciais que priorizam grandes estúdios, a curadoria do Rolliude Play é guiada pelo compromisso histórico com a diversidade geográfica e a valorização das produções independentes do Nordeste e de todo o Brasil.
        </p>
      </div>

      {/* Curatorial Theme Navigation Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-[#351D10]">
        {themes.map(th => (
          <button
            key={th.id}
            onClick={() => setSelectedTheme(th.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedTheme === th.id
                ? 'bg-[#C2410C] text-white shadow-md'
                : 'bg-[#20110A] text-[#C89D77] border border-[#3E2114] hover:bg-[#2C180E] hover:text-white'
            }`}
          >
            {th.label}
          </button>
        ))}
      </div>

      {/* Description of active theme */}
      <div className="p-4 rounded-xl bg-[#1B0F09] border border-[#381D11] flex items-center justify-between text-xs text-[#E5D4C3]">
        <div className="flex items-center space-x-2">
          <Compass className="w-4 h-4 text-[#EA580C]" />
          <span>{themes.find(t => t.id === selectedTheme)?.tagline}</span>
        </div>
        <span className="text-[#9E7B5D]">
          <strong>{currentMovies.length}</strong> {currentMovies.length === 1 ? 'obra selecionada' : 'obras selecionadas'}
        </span>
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {currentMovies.map(movie => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onPlay={onPlay}
            onOpenDetails={onOpenDetails}
            isFavorite={favoriteIds.includes(movie.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};
