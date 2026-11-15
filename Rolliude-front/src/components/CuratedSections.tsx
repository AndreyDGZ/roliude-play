import React from 'react';
import { Sparkles, Award, MapPin, ChevronRight } from 'lucide-react';
import { Movie } from '../types';
import { MovieCard } from './MovieCard';

interface CuratedSectionsProps {
  movies: Movie[];
  onPlay: (movie: Movie) => void;
  onOpenDetails: (movie: Movie) => void;
  favoriteIds: string[];
  onToggleFavorite: (movieId: string) => void;
  onExploreCategory?: (categoryFilter: string) => void;
}

export const CuratedSections: React.FC<CuratedSectionsProps> = ({
  movies,
  onPlay,
  onOpenDetails,
  favoriteIds,
  onToggleFavorite,
  onExploreCategory
}) => {
  // Define Curated Categories
  const sections = [
    {
      id: 'roliude-nordestina',
      tag: 'Cenário Mítico',
      titulo: 'Roliúde Nordestina: Gravados em Cabaceiras & Cariri',
      subtitulo: 'A cidade paraibana apelidada de Roliúde Nordestina pelo acolhimento de mais de 30 produções',
      filmes: movies.filter(m => 
        m.localizacao.municipio.toLowerCase().includes('cabaceiras') || 
        m.curadoriaTag?.toLowerCase().includes('roliúde')
      )
    },
    {
      id: 'cinema-campinense-jpa',
      tag: 'Polo Regional',
      titulo: 'Cinema de Campina Grande & João Pessoa',
      subtitulo: 'Produções urbanas, documentais e poéticas nascidas no coração da Borborema e do litoral paraibano',
      filmes: movies.filter(m => 
        m.localizacao.municipio.toLowerCase().includes('campina') || 
        m.localizacao.municipio.toLowerCase().includes('joão pessoa')
      )
    },
    {
      id: 'resistencia-sertao',
      tag: 'Temática & Força',
      titulo: 'Sertão & Cinema de Resistência',
      subtitulo: 'Obras que questionam o status quo, celebram a bravura e recriam a estética do sertão',
      filmes: movies.filter(m => 
        m.genero.includes('Cinema de Resistência') || 
        m.genero.includes('Memória & Identidade') ||
        m.curadoriaTag?.toLowerCase().includes('resistência')
      )
    },
    {
      id: 'acervo-historico',
      tag: 'Memória Audiovisual',
      titulo: 'Acervo e Memória Viva do Cinema Nacional',
      subtitulo: 'Clássicos fundadores como Aruanda (1960), O Auto da Compadecida e grandes marcos premiados',
      filmes: movies.filter(m => 
        m.ano <= 2005 || 
        m.curadoriaTag?.toLowerCase().includes('patrimônio') ||
        m.curadoriaTag?.toLowerCase().includes('acervo')
      )
    }
  ];

  return (
    <div className="space-y-12">
      {sections.map(section => {
        if (section.filmes.length === 0) return null;

        return (
          <div key={section.id} className="space-y-4">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#351C10] pb-3">
              <div>
                <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-[#EA580C] mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{section.tag}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold font-['Cinzel'] text-[#FAF6EE]">
                  {section.titulo}
                </h2>
                <p className="text-xs text-[#B89271] mt-0.5">
                  {section.subtitulo}
                </p>
              </div>

              {onExploreCategory && (
                <button
                  onClick={() => onExploreCategory(section.id)}
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-[#EA580C] hover:text-[#F97316] transition whitespace-nowrap self-start sm:self-auto"
                >
                  <span>Ver todas</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Horizontal Scroll / Responsive Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
              {section.filmes.slice(0, 4).map(movie => (
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
      })}
    </div>
  );
};
