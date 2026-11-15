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
import { Movie, Professional, BehindTheScenesItem, Review } from './types';
import {
  createMovie,
  createReview,
  getBehindTheScenesItems,
  getMovies,
  getProfessionals,
  CreateMoviePayload
} from './services/api';

type AppStatus = 'loading' | 'error' | 'ready';

export default function App() {
  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<
    'inicio' | 'catalogo' | 'curadoria' | 'bastidores' | 'profissionais' | 'favoritos'
  >('inicio');

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Data loaded from the real API
  const [status, setStatus] = useState<AppStatus>('loading');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [btsItems, setBtsItems] = useState<BehindTheScenesItem[]>([]);

  function loadData(): void {
    setStatus('loading');
    Promise.all([getMovies(), getProfessionals(), getBehindTheScenesItems()])
      .then(([loadedMovies, loadedProfessionals, loadedBtsItems]) => {
        setMovies(loadedMovies);
        setProfessionals(loadedProfessionals);
        setBtsItems(loadedBtsItems);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }

  useEffect(() => {
    loadData();
  }, []);

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
  const handleAddReview = async (movieId: string, newReview: Review) => {
    const updatedMovie = await createReview(movieId, {
      autor: newReview.autor,
      cidade: newReview.cidade,
      nota: newReview.nota,
      comentario: newReview.comentario
    });

    setMovies((prevMovies) => prevMovies.map((m) => (m.id === movieId ? updatedMovie : m)));

    if (selectedMovieForDetail && selectedMovieForDetail.id === movieId) {
      setSelectedMovieForDetail(updatedMovie);
    }
  };

  // Add New Movie from Admin/Curator Modal
  const handleAddMovie = async (payload: CreateMoviePayload) => {
    const createdMovie = await createMovie(payload);
    setMovies((prev) => [createdMovie, ...prev]);
    setActiveTab('catalogo');
  };

  // Featured Hero movie
  const heroMovie = movies[0];

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#120D0A] text-[#FAF6EE] flex items-center justify-center font-sans">
        <p className="text-sm text-[#C89D77]">Carregando o catálogo...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-[#120D0A] text-[#FAF6EE] flex flex-col items-center justify-center gap-4 font-sans">
        <p className="text-sm text-[#C89D77]">Não foi possível carregar o catálogo agora.</p>
        <button
          onClick={loadData}
          className="px-4 py-2 rounded-xl bg-[#C2410C] hover:bg-[#EA580C] text-white text-sm font-bold transition"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

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
        <AdminAddMovieModal onClose={() => setIsAddModalOpen(false)} onAddMovie={handleAddMovie} />
      )}
    </div>
  );
}
