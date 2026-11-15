import React, { useState } from 'react';
import { Play, Camera, Film, Sparkles, Filter, Calendar, Clock, MapPin } from 'lucide-react';
import { BehindTheScenesItem, Movie } from '../types';

interface BehindTheScenesViewProps {
  items: BehindTheScenesItem[];
  movies: Movie[];
  onOpenItem: (item: BehindTheScenesItem) => void;
  onOpenMovieDetail: (movie: Movie) => void;
}

export const BehindTheScenesView: React.FC<BehindTheScenesViewProps> = ({
  items,
  movies,
  onOpenItem,
  onOpenMovieDetail
}) => {
  const [selectedType, setSelectedType] = useState<string>('todos');

  const filteredItems = selectedType === 'todos' 
    ? items 
    : items.filter(it => it.tipo === selectedType);

  const filterOptions = [
    { id: 'todos', label: 'Todos os Conteúdos' },
    { id: 'making_of', label: 'Making Of & Locações' },
    { id: 'entrevista', label: 'Entrevistas com Elenco/Direção' },
    { id: 'minidoc', label: 'Minidocumentários & Restauração' },
    { id: 'depoimento', label: 'Depoimentos & Trilha Sonora' }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Intro Header */}
      <div className="relative rounded-2xl p-6 sm:p-10 bg-gradient-to-r from-[#24130A] via-[#1F1008] to-[#160A04] border border-[#482515] overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#C2410C] text-white">
            <Camera className="w-3.5 h-3.5" />
            <span>Espaço Bastidores & Direção</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-['Cinzel'] text-[#FAF6EE]">
            O Processo Criativo por Trás das Câmeras
          </h1>

          <p className="text-sm sm:text-base text-[#DCC7B3] leading-relaxed">
            Mergulhe nas pesquisas de campo no Cariri paraibano, nas memórias dos realizadores de Campina Grande e Cabaceiras, no desenho de som com pífanos e rabeceiros e nos desafios da produção independente no cinema brasileiro.
          </p>
        </div>

        {/* Decorative background camera illustration */}
        <div className="absolute right-6 -bottom-8 opacity-10 text-amber-500 pointer-events-none hidden md:block">
          <Film className="w-64 h-64" />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-[#EA580C] mr-1 flex-shrink-0" />
        {filterOptions.map(opt => (
          <button
            key={opt.id}
            onClick={() => setSelectedType(opt.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              selectedType === opt.id
                ? 'bg-[#C2410C] text-white shadow-md'
                : 'bg-[#21120A] text-[#C89D77] border border-[#3E2114] hover:bg-[#2C180E] hover:text-white'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => {
          const relatedMovie = movies.find(m => m.id === item.filmeId);

          return (
            <div
              key={item.id}
              onClick={() => onOpenItem(item)}
              className="group cursor-pointer rounded-2xl bg-[#1B0F09] border border-[#3A1F13] overflow-hidden hover:border-[#EA580C] hover:shadow-2xl transition duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative aspect-video bg-[#26130B] overflow-hidden">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#EA580C] text-white flex items-center justify-center shadow-xl transform group-hover:scale-110 transition">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>

                  {item.duracao && (
                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 text-[10px] text-white font-mono flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-[#EA580C]" />
                      <span>{item.duracao}</span>
                    </span>
                  )}

                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded bg-[#C2410C] text-[10px] font-bold text-white uppercase shadow-sm">
                    {item.tipo.replace('_', ' ')}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4 space-y-2">
                  <h3 className="text-base font-bold text-[#FAF6EE] group-hover:text-[#EA580C] transition leading-snug">
                    {item.titulo}
                  </h3>

                  <p className="text-xs text-[#C89D77] line-clamp-3 leading-relaxed">
                    {item.descricao}
                  </p>

                  {item.entrevistado && (
                    <p className="text-xs text-[#FCD34D] font-medium pt-1">
                      Com: <span className="text-white">{item.entrevistado}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom bar linking to the movie */}
              {relatedMovie && (
                <div className="px-4 py-2.5 bg-[#140A05] border-t border-[#2E180E] flex items-center justify-between text-xs">
                  <span className="text-[#8F6647]">Obra Vinculada:</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenMovieDetail(relatedMovie);
                    }}
                    className="font-semibold text-[#EA580C] hover:underline flex items-center space-x-1 truncate max-w-[180px]"
                  >
                    <span>{relatedMovie.titulo}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
