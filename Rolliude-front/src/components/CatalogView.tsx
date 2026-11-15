import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  MapPin, 
  Calendar, 
  Film, 
  Clock, 
  RotateCcw, 
  SlidersHorizontal,
  ChevronDown,
  Layers,
  Sparkles
} from 'lucide-react';
import { Movie, Region, AgeRating } from '../types';
import { MovieCard } from './MovieCard';
import { STATES_LIST, GENRES_LIST, MUNICIPALITIES_LIST } from '../data/mockData';

interface CatalogViewProps {
  movies: Movie[];
  onPlay: (movie: Movie) => void;
  onOpenDetails: (movie: Movie) => void;
  favoriteIds: string[];
  onToggleFavorite: (movieId: string) => void;
  initialSearchQuery?: string;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  movies,
  onPlay,
  onOpenDetails,
  favoriteIds,
  onToggleFavorite,
  initialSearchQuery = ''
}) => {
  // Filter States
  const [search, setSearch] = useState(initialSearchQuery);
  const [selectedRegion, setSelectedRegion] = useState<string>('Todas');
  const [selectedState, setSelectedState] = useState<string>('Todos');
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('Todos');
  const [selectedGenre, setSelectedGenre] = useState<string>('Todos');
  const [selectedRating, setSelectedRating] = useState<string>('Todas');
  const [selectedDuration, setSelectedDuration] = useState<string>('Todas');
  const [selectedSort, setSelectedSort] = useState<'populares' | 'nota' | 'recentes' | 'alfabetica'>('populares');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Available unique municipalities extracted from movies
  const availableMunicipalities = useMemo(() => {
    const list = Array.from(new Set(movies.map(m => m.localizacao.municipio)));
    return ['Todos', ...list];
  }, [movies]);

  // Available states
  const availableStates = useMemo(() => {
    const set = new Set(movies.map(m => m.localizacao.estadoSigla));
    return ['Todos', ...Array.from(set)];
  }, [movies]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setSelectedRegion('Todas');
    setSelectedState('Todos');
    setSelectedMunicipality('Todos');
    setSelectedGenre('Todos');
    setSelectedRating('Todas');
    setSelectedDuration('Todas');
    setSelectedSort('populares');
  };

  const hasActiveFilters = 
    search !== '' ||
    selectedRegion !== 'Todas' ||
    selectedState !== 'Todos' ||
    selectedMunicipality !== 'Todos' ||
    selectedGenre !== 'Todos' ||
    selectedRating !== 'Todas' ||
    selectedDuration !== 'Todas';

  // Filtered and Sorted Movies
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      // Text search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = movie.titulo.toLowerCase().includes(q);
        const matchesDirector = movie.direcao.some(d => d.toLowerCase().includes(q));
        const matchesCast = movie.elenco.some(c => c.nome.toLowerCase().includes(q));
        const matchesCity = movie.localizacao.municipio.toLowerCase().includes(q);
        const matchesSynopsis = movie.sinopse.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDirector && !matchesCast && !matchesCity && !matchesSynopsis) {
          return false;
        }
      }

      // Region
      if (selectedRegion !== 'Todas' && movie.localizacao.regiao !== selectedRegion) {
        return false;
      }

      // State
      if (selectedState !== 'Todos' && movie.localizacao.estadoSigla !== selectedState) {
        return false;
      }

      // Municipality
      if (selectedMunicipality !== 'Todos' && movie.localizacao.municipio !== selectedMunicipality) {
        return false;
      }

      // Genre
      if (selectedGenre !== 'Todos' && !movie.genero.includes(selectedGenre)) {
        return false;
      }

      // Rating
      if (selectedRating !== 'Todas' && movie.classificacaoIndicativa !== selectedRating) {
        return false;
      }

      // Duration
      if (selectedDuration === 'curta' && movie.duracaoMinutos >= 30) return false;
      if (selectedDuration === 'media' && (movie.duracaoMinutos < 30 || movie.duracaoMinutos > 70)) return false;
      if (selectedDuration === 'longa' && movie.duracaoMinutos <= 70) return false;

      return true;
    }).sort((a, b) => {
      if (selectedSort === 'populares') return b.popularidade - a.popularidade;
      if (selectedSort === 'nota') return b.notaMedia - a.notaMedia;
      if (selectedSort === 'recentes') return b.ano - a.ano;
      if (selectedSort === 'alfabetica') return a.titulo.localeCompare(b.titulo);
      return 0;
    });
  }, [
    movies,
    search,
    selectedRegion,
    selectedState,
    selectedMunicipality,
    selectedGenre,
    selectedRating,
    selectedDuration,
    selectedSort
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Catalog Title & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#361D11]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#EA580C] mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Catálogo Completo & Acervo Regional</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-['Cinzel'] text-[#FAF6EE]">
            Explorar Cinema Brasileiro
          </h1>
          <p className="text-sm text-[#C89D77] mt-1">
            Filtre por hierarquia geográfica (País → Região → Estado → Município), gêneros, épocas e classificação.
          </p>
        </div>

        {/* Count & Reset */}
        <div className="flex items-center space-x-3">
          <span className="text-xs text-[#E5D4C3] bg-[#24130A] px-3 py-1.5 rounded-lg border border-[#3E2114]">
            <strong>{filteredMovies.length}</strong> {filteredMovies.length === 1 ? 'obra encontrada' : 'obras encontradas'}
          </span>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#2C160E] hover:bg-[#3D1E12] text-[#FCD34D] border border-[#522915] transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar Filtros</span>
            </button>
          )}

          {/* Toggle for mobile filters */}
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="md:hidden inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#C2410C] text-white"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className={`space-y-4 ${mobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
        <div className="p-4 sm:p-5 rounded-2xl bg-[#1C0F0A] border border-[#3E2114] shadow-xl space-y-4">
          
          {/* Row 1: Hierarquia Geográfica (País -> Região -> Estado -> Município) */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C] flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Localização de Origem / Locação</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Região */}
              <div>
                <label className="block text-[11px] text-[#A67E5D] mb-1">Região</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#25140D] border border-[#482515] text-xs text-[#FAF6EE] focus:outline-none focus:border-[#EA580C]"
                >
                  <option value="Todas">Todas as Regiões</option>
                  <option value="Nordeste">Nordeste (Foco Regional)</option>
                  <option value="Sudeste">Sudeste</option>
                  <option value="Centro-Oeste">Centro-Oeste</option>
                  <option value="Norte">Norte</option>
                  <option value="Sul">Sul</option>
                </select>
              </div>

              {/* Estado */}
              <div>
                <label className="block text-[11px] text-[#A67E5D] mb-1">Estado</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#25140D] border border-[#482515] text-xs text-[#FAF6EE] focus:outline-none focus:border-[#EA580C]"
                >
                  <option value="Todos">Todos os Estados</option>
                  {STATES_LIST.map((st) => (
                    <option key={st.sigla} value={st.sigla}>
                      {st.nome} ({st.sigla})
                    </option>
                  ))}
                </select>
              </div>

              {/* Município */}
              <div>
                <label className="block text-[11px] text-[#A67E5D] mb-1">Município em Destaque</label>
                <select
                  value={selectedMunicipality}
                  onChange={(e) => setSelectedMunicipality(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#25140D] border border-[#482515] text-xs text-[#FAF6EE] focus:outline-none focus:border-[#EA580C]"
                >
                  {availableMunicipalities.map((city) => (
                    <option key={city} value={city}>
                      {city === 'Todos' ? 'Todos os Municípios' : city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Row 2: Gênero, Classificação, Duração e Ordenação */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#2F170E]">
            {/* Gênero */}
            <div>
              <label className="block text-[11px] text-[#A67E5D] mb-1">Gênero Temático</label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#25140D] border border-[#482515] text-xs text-[#FAF6EE] focus:outline-none focus:border-[#EA580C]"
              >
                {GENRES_LIST.map((g) => (
                  <option key={g} value={g}>{g === 'Todos' ? 'Todos os Gêneros' : g}</option>
                ))}
              </select>
            </div>

            {/* Duração */}
            <div>
              <label className="block text-[11px] text-[#A67E5D] mb-1">Formato / Duração</label>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#25140D] border border-[#482515] text-xs text-[#FAF6EE] focus:outline-none focus:border-[#EA580C]"
              >
                <option value="Todas">Todas as Durações</option>
                <option value="curta">Curtas (&lt; 30 min)</option>
                <option value="media">Médias (30 a 70 min)</option>
                <option value="longa">Longas (&gt; 70 min)</option>
              </select>
            </div>

            {/* Classificação Indicativa */}
            <div>
              <label className="block text-[11px] text-[#A67E5D] mb-1">Classificação Indicativa</label>
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#25140D] border border-[#482515] text-xs text-[#FAF6EE] focus:outline-none focus:border-[#EA580C]"
              >
                <option value="Todas">Todas as Faixas</option>
                <option value="Livre">Livre para Todos</option>
                <option value="10">10 anos</option>
                <option value="12">12 anos</option>
                <option value="14">14 anos</option>
                <option value="16">16 anos</option>
              </select>
            </div>

            {/* Ordenação */}
            <div>
              <label className="block text-[11px] text-[#A67E5D] mb-1">Ordenar Por</label>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#25140D] border border-[#482515] text-xs text-[#FAF6EE] focus:outline-none focus:border-[#EA580C]"
              >
                <option value="populares">Mais Populares</option>
                <option value="nota">Melhor Avaliados</option>
                <option value="recentes">Mais Recentes</option>
                <option value="alfabetica">Ordem Alfabética (A-Z)</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* MOVIES GRID */}
      {filteredMovies.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-[#1B0F09] border border-[#381D11] space-y-4">
          <Film className="w-12 h-12 text-[#EA580C] mx-auto opacity-50" />
          <h3 className="text-lg font-bold text-white">Nenhuma obra encontrada</h3>
          <p className="text-xs text-[#B89271] max-w-md mx-auto">
            Não encontramos títulos com os critérios selecionados. Tente ajustar os filtros ou redefinir a busca.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-[#C2410C] hover:bg-[#EA580C] text-white text-xs font-bold transition"
          >
            Redefinir Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {filteredMovies.map((movie) => (
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
      )}
    </div>
  );
};
