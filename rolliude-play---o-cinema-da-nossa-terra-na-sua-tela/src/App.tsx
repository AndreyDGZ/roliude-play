import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CuratedSections } from './components/CuratedSections';
import { CatalogView } from './components/CatalogView';
import { CuradoriaView } from './components/CuradoriaView';
import { BehindTheScenesView } from './components/BehindTheScenesView';
import { ProfessionalsView } from './components/ProfessionalsView';
import { FavoritesView } from './components/FavoritesView';
import { MovieDetailModal } from './components/MovieDetailModal';
import { ProfessionalModal } from './components/ProfessionalModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { AdminAddMovieModal } from './components/AdminAddMovieModal';
import { Footer } from './components/Footer';
import { 
  INITIAL_MOVIES, 
  INITIAL_PROFESSIONALS, 
  INITIAL_BEHIND_THE_SCENES 
} from './data/mockData';
import { Movie, Professional, BehindTheScenesItem, Review } from './types';

export default function App() {
  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<
    'inicio' | 'catalogo' | 'curadoria' | 'bastidores' | 'profissionais' | 'favoritos'
  >('inicio');

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Catalog Movies State with LocalStorage persistence
  const [movies, setMovies] = useState<Movie[]>(() => {
    try {
      const saved = localStorage.getItem('rolliude_catalog_movies_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Erro ao carregar dados salvos do localStorage', e);
    }
    return INITIAL_MOVIES;
  });

  // Professionals & Behind the Scenes
  const [professionals] = useState<Professional[]>(INITIAL_PROFESSIONALS);
  const [btsItems] = useState<BehindTheScenesItem[]>(INITIAL_BEHIND_THE_SCENES);

  // Favorites state with persistence
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rolliude_favorites_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Erro ao carregar favoritos', e);
    }
    return ['filme-auto-compadecida', 'filme-aruanda'];
  });

  // Modals state
  const [selectedMovieForDetail, setSelectedMovieForDetail] = useState<Movie | null>(null);
  const [selectedMediaForPlay, setSelectedMediaForPlay] = useState<Movie | BehindTheScenesItem | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('rolliude_catalog_movies_v1', JSON.stringify(movies));
    } catch (e) {
      console.warn('Erro ao salvar no localStorage', e);
    }
  }, [movies]);

  useEffect(() => {
    try {
      localStorage.setItem('rolliude_favorites_v1', JSON.stringify(favoriteIds));
    } catch (e) {
      console.warn('Erro ao salvar favoritos', e);
    }
  }, [favoriteIds]);

  // If user types in global search bar, navigate smoothly to catalog if on another tab
  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    if (q.trim() && activeTab !== 'catalogo') {
      setActiveTab('catalogo');
    }
  };

  // Toggle Favorite
  const handleToggleFavorite = (movieId: string) => {
    setFavoriteIds((prev) =>
      prev.includes(movieId) ? prev.filter((id) => id !== movieId) : [...prev, movieId]
    );
  };

  // Select Professional by Name (e.g. from cast or director click in Ficha Técnica)
  const handleSelectProfessionalByName = (name: string) => {
    const found = professionals.find(
      (p) => p.nome.toLowerCase() === name.toLowerCase() || name.toLowerCase().includes(p.nome.toLowerCase())
    );
    if (found) {
      setSelectedProfessional(found);
    }
  };

  // Add Review
  const handleAddReview = (movieId: string, newReview: Review) => {
    setMovies((prevMovies) =>
      prevMovies.map((m) => {
        if (m.id !== movieId) return m;
        const currentReviews = m.reviews || [];
        const updatedReviews = [newReview, ...currentReviews];
        const newCount = m.avaliacoesCount + 1;
        const sum = (m.notaMedia * m.avaliacoesCount) + newReview.nota;
        const newAvg = Number((sum / newCount).toFixed(1));

        return {
          ...m,
          notaMedia: newAvg,
          avaliacoesCount: newCount,
          reviews: updatedReviews
        };
      })
    );

    // Also update current modal if open
    if (selectedMovieForDetail && selectedMovieForDetail.id === movieId) {
      const currentReviews = selectedMovieForDetail.reviews || [];
      const updatedReviews = [newReview, ...currentReviews];
      const newCount = selectedMovieForDetail.avaliacoesCount + 1;
      const sum = (selectedMovieForDetail.notaMedia * selectedMovieForDetail.avaliacoesCount) + newReview.nota;
      const newAvg = Number((sum / newCount).toFixed(1));

      setSelectedMovieForDetail({
        ...selectedMovieForDetail,
        notaMedia: newAvg,
        avaliacoesCount: newCount,
        reviews: updatedReviews
      });
    }
  };

  // Add New Movie from Admin/Curator Modal
  const handleAddMovie = (newMovie: Movie) => {
    setMovies((prev) => [newMovie, ...prev]);
    setActiveTab('catalogo');
  };

  // Reset to default sample catalog
  const handleResetCatalog = () => {
    setMovies(INITIAL_MOVIES);
    try {
      localStorage.removeItem('rolliude_catalog_movies_v1');
    } catch (e) {}
  };

  // Featured Hero movie (O Auto da Compadecida or first item)
  const heroMovie = movies.find((m) => m.id === 'filme-auto-compadecida') || movies[0];

  return (
    <div className="min-h-screen bg-[#120D0A] text-[#FAF6EE] flex flex-col font-sans selection:bg-[#C2410C] selection:text-white">
      {/* Main Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={handleSearchChange}
        favoritesCount={favoriteIds.length}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {/* TAB 1: INÍCIO (Home Showcase with Hero Banner and Curated Rows) */}
        {activeTab === 'inicio' && (
          <div className="space-y-12">
            {heroMovie && (
              <HeroBanner
                movie={heroMovie}
                onPlay={(m) => setSelectedMediaForPlay(m)}
                onOpenDetails={(m) => setSelectedMovieForDetail(m)}
                isFavorite={favoriteIds.includes(heroMovie.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-12">
              <CuratedSections
                movies={movies}
                onPlay={(m) => setSelectedMediaForPlay(m)}
                onOpenDetails={(m) => setSelectedMovieForDetail(m)}
                favoriteIds={favoriteIds}
                onToggleFavorite={handleToggleFavorite}
                onExploreCategory={() => setActiveTab('curadoria')}
              />
            </div>
          </div>
        )}

        {/* TAB 2: CATÁLOGO COM FILTROS GEOGRÁFICOS E TEMÁTICOS */}
        {activeTab === 'catalogo' && (
          <CatalogView
            movies={movies}
            onPlay={(m) => setSelectedMediaForPlay(m)}
            onOpenDetails={(m) => setSelectedMovieForDetail(m)}
            favoriteIds={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
            initialSearchQuery={searchQuery}
          />
        )}

        {/* TAB 3: CURADORIA LOCAL & CATEGORIAS */}
        {activeTab === 'curadoria' && (
          <CuradoriaView
            movies={movies}
            onPlay={(m) => setSelectedMediaForPlay(m)}
            onOpenDetails={(m) => setSelectedMovieForDetail(m)}
            favoriteIds={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {/* TAB 4: ESPAÇO BASTIDORES & DIREÇÃO */}
        {activeTab === 'bastidores' && (
          <BehindTheScenesView
            items={btsItems}
            movies={movies}
            onOpenItem={(item) => setSelectedMediaForPlay(item)}
            onOpenMovieDetail={(movie) => setSelectedMovieForDetail(movie)}
          />
        )}

        {/* TAB 5: PROFISSIONAIS DO AUDIOVISUAL */}
        {activeTab === 'profissionais' && (
          <ProfessionalsView
            professionals={professionals}
            movies={movies}
            onSelectProfessional={(prof) => setSelectedProfessional(prof)}
          />
        )}

        {/* TAB 6: MINHA LISTA / FAVORITOS */}
        {activeTab === 'favoritos' && (
          <FavoritesView
            movies={movies}
            favoriteIds={favoriteIds}
            onPlay={(m) => setSelectedMediaForPlay(m)}
            onOpenDetails={(m) => setSelectedMovieForDetail(m)}
            onToggleFavorite={handleToggleFavorite}
            onGoToCatalog={() => setActiveTab('catalogo')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigateTab={(tab) => setActiveTab(tab)} />

      {/* MODAL 1: Ficha Técnica Integrada */}
      {selectedMovieForDetail && (
        <MovieDetailModal
          movie={selectedMovieForDetail}
          onClose={() => setSelectedMovieForDetail(null)}
          onPlay={(m) => setSelectedMediaForPlay(m)}
          isFavorite={favoriteIds.includes(selectedMovieForDetail.id)}
          onToggleFavorite={handleToggleFavorite}
          onSelectProfessionalName={handleSelectProfessionalByName}
          onOpenBehindTheScenes={(bts) => setSelectedMediaForPlay(bts)}
          allBtsItems={btsItems}
          onAddReview={handleAddReview}
        />
      )}

      {/* MODAL 2: Perfil Profissional */}
      {selectedProfessional && (
        <ProfessionalModal
          professional={selectedProfessional}
          onClose={() => setSelectedProfessional(null)}
          movies={movies}
          onSelectMovie={(m) => {
            setSelectedProfessional(null);
            setSelectedMovieForDetail(m);
          }}
          onPlayMovie={(m) => {
            setSelectedProfessional(null);
            setSelectedMediaForPlay(m);
          }}
        />
      )}

      {/* MODAL 3: Player de Vídeo e Áudio */}
      {selectedMediaForPlay && (
        <VideoPlayerModal
          item={selectedMediaForPlay}
          onClose={() => setSelectedMediaForPlay(null)}
        />
      )}

      {/* MODAL 4: Cadastro / Gestão de Obras de Exemplo */}
      {isAddModalOpen && (
        <AdminAddMovieModal
          onClose={() => setIsAddModalOpen(false)}
          onAddMovie={handleAddMovie}
          onResetToDefault={handleResetCatalog}
        />
      )}
    </div>
  );
}
