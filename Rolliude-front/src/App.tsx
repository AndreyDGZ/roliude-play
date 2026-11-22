import React, { useCallback, useState, useEffect } from 'react';
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
import { AdminPanelView } from './components/AdminPanelView';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { NotificationBell } from './components/NotificationBell';
import { ReleaseToast } from './components/ReleaseToast';
import { useAuth } from './hooks/useAuth';
import { useNotifications } from './hooks/useNotifications';
import { useFavorites } from './hooks/useFavorites';
import { USER_ROLES } from './data/mockData';
import { AppNotification, AppTab, Movie, Professional, BehindTheScenesItem, Review, User } from './types';
import {
  createBehindTheScenesItem,
  createMovie,
  createProfessional,
  createReview,
  deleteBehindTheScenesItem,
  deleteMovie,
  deleteProfessional,
  getBehindTheScenesItems,
  getMovieById,
  getMovies,
  getProfessionals,
  updateBehindTheScenesItem,
  updateMovie,
  updateProfessional,
  BehindTheScenesPayload,
  CreateMoviePayload,
  ProfessionalPayload
} from './services/api';

type AppStatus = 'loading' | 'error' | 'ready';

function replaceById<Item extends { id: string }>(items: Item[], updatedItem: Item): Item[] {
  return items.map((item) => (item.id === updatedItem.id ? updatedItem : item));
}

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('inicio');

  const [searchQuery, setSearchQuery] = useState('');

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

  const [selectedMovieForDetail, setSelectedMovieForDetail] = useState<Movie | null>(null);
  const [selectedMediaForPlay, setSelectedMediaForPlay] = useState<Movie | BehindTheScenesItem | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [movieBeingEdited, setMovieBeingEdited] = useState<Movie | undefined>(undefined);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleSessionEnded = useCallback(() => {
    setIsAddModalOpen(false);
    setMovieBeingEdited(undefined);
    setActiveTab('inicio');
  }, []);

  const { user, isAdmin, login, register, logout } = useAuth(handleSessionEnded);

  const prependMovie = useCallback((movie: Movie) => {
    setMovies((previous) => (previous.some((existing) => existing.id === movie.id) ? previous : [movie, ...previous]));
  }, []);

  const handleRelease = useCallback(
    (notification: AppNotification) => {
      getMovieById(notification.filmeId)
        .then(prependMovie)
        .catch((error) => console.warn('Erro ao carregar o filme lançado', error));
    },
    [prependMovie]
  );

  const { notifications, naoLidas, toasts, markAsRead, markAllAsRead, dismissToast } = useNotifications(handleRelease);

  const { favoriteIds, favoriteMovies, toggleFavorite, removeFavorite } = useFavorites(movies);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim() && activeTab !== 'catalogo') {
      setActiveTab('catalogo');
    }
  };

  const handleSelectProfessionalByName = (name: string) => {
    const found = professionals.find(
      (professional) =>
        professional.nome.toLowerCase() === name.toLowerCase() || name.toLowerCase().includes(professional.nome.toLowerCase())
    );
    if (found) {
      setSelectedProfessional(found);
    }
  };

  const handleAddReview = async (movieId: string, newReview: Review) => {
    const updatedMovie = await createReview(movieId, {
      autor: newReview.autor,
      cidade: newReview.cidade,
      nota: newReview.nota,
      comentario: newReview.comentario
    });

    setMovies((prevMovies) => prevMovies.map((movie) => (movie.id === movieId ? updatedMovie : movie)));

    if (selectedMovieForDetail && selectedMovieForDetail.id === movieId) {
      setSelectedMovieForDetail(updatedMovie);
    }
  };

  const handleAddMovie = async (payload: CreateMoviePayload) => {
    const createdMovie = await createMovie(payload);
    prependMovie(createdMovie);
    if (activeTab !== 'admin') setActiveTab('catalogo');
  };

  const handleUpdateMovie = async (movieId: string, payload: Partial<CreateMoviePayload>) => {
    const updatedMovie = await updateMovie(movieId, payload);
    setMovies((previous) => replaceById(previous, updatedMovie));
  };

  const handleToggleMovieHighlight = (movie: Movie) =>
    handleUpdateMovie(movie.id, { destaqueCuradoria: !movie.destaqueCuradoria });

  const handleDeleteMovie = async (movieId: string) => {
    await deleteMovie(movieId);
    setMovies((previous) => previous.filter((movie) => movie.id !== movieId));
    setBtsItems((previous) => previous.filter((item) => item.filmeId !== movieId));
    removeFavorite(movieId);
  };

  const handleCreateProfessional = async (payload: ProfessionalPayload) => {
    const createdProfessional = await createProfessional(payload);
    setProfessionals((previous) => [...previous, createdProfessional]);
  };

  const handleUpdateProfessional = async (professionalId: string, payload: ProfessionalPayload) => {
    const updatedProfessional = await updateProfessional(professionalId, payload);
    setProfessionals((previous) => replaceById(previous, updatedProfessional));
  };

  const handleDeleteProfessional = async (professionalId: string) => {
    await deleteProfessional(professionalId);
    setProfessionals((previous) => previous.filter((professional) => professional.id !== professionalId));
  };

  const handleCreateBtsItem = async (payload: BehindTheScenesPayload) => {
    const createdItem = await createBehindTheScenesItem(payload);
    setBtsItems((previous) => [createdItem, ...previous]);
  };

  const handleUpdateBtsItem = async (itemId: string, payload: BehindTheScenesPayload) => {
    const updatedItem = await updateBehindTheScenesItem(itemId, payload);
    setBtsItems((previous) => replaceById(previous, updatedItem));
  };

  const handleDeleteBtsItem = async (itemId: string) => {
    await deleteBehindTheScenesItem(itemId);
    setBtsItems((previous) => previous.filter((item) => item.id !== itemId));
  };

  const handleReviewRemoved = (movieId: string) => {
    getMovieById(movieId)
      .then((refreshedMovie) => setMovies((previous) => replaceById(previous, refreshedMovie)))
      .catch(() => loadData());
  };

  const handleOpenMovieForm = (movie?: Movie) => {
    setMovieBeingEdited(movie);
    setIsAddModalOpen(true);
  };

  const handleCloseMovieForm = () => {
    setIsAddModalOpen(false);
    setMovieBeingEdited(undefined);
  };

  const handleAuthenticated = (authenticatedUser: User) => {
    setIsAuthModalOpen(false);
    if (authenticatedUser.papel === USER_ROLES.admin) setActiveTab('admin');
  };

  const handleOpenNotification = (notification: AppNotification) => {
    markAsRead(notification.id);
    dismissToast(notification.id);

    const loadedMovie = movies.find((movie) => movie.id === notification.filmeId);
    if (loadedMovie) {
      setSelectedMovieForDetail(loadedMovie);
      return;
    }

    getMovieById(notification.filmeId)
      .then(setSelectedMovieForDetail)
      .catch((error) => console.warn('Erro ao abrir o filme da notificação', error));
  };

  const heroMovie = movies[0];

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-brand-bg text-brand-text flex items-center justify-center font-sans">
        <p className="text-sm text-brand-text-soft">Carregando o catálogo...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col items-center justify-center gap-4 font-sans">
        <p className="text-sm text-brand-text-soft">Não foi possível carregar o catálogo agora.</p>
        <button
          onClick={loadData}
          className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-accent text-white text-sm font-bold transition"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col font-sans selection:bg-brand-primary selection:text-white">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={handleSearchChange}
        favoritesCount={favoriteMovies.length}
        currentUser={user}
        isAdmin={isAdmin}
        onOpenAddModal={() => handleOpenMovieForm()}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={logout}
        notificationBell={
          <NotificationBell
            notifications={notifications}
            naoLidas={naoLidas}
            onSelectNotification={handleOpenNotification}
            onMarkAllAsRead={markAllAsRead}
          />
        }
      />

      <ReleaseToast toasts={toasts} onDismiss={dismissToast} onSelect={handleOpenNotification} />

      <main className="flex-1">
        {activeTab === 'inicio' && (
          <div className="space-y-12">
            {heroMovie && (
              <HeroBanner
                movie={heroMovie}
                onPlay={(movie) => setSelectedMediaForPlay(movie)}
                onOpenDetails={(movie) => setSelectedMovieForDetail(movie)}
                isFavorite={favoriteIds.includes(heroMovie.id)}
                onToggleFavorite={toggleFavorite}
              />
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-12">
              <CuratedSections
                movies={movies}
                onPlay={(movie) => setSelectedMediaForPlay(movie)}
                onOpenDetails={(movie) => setSelectedMovieForDetail(movie)}
                favoriteIds={favoriteIds}
                onToggleFavorite={toggleFavorite}
                onExploreCategory={() => setActiveTab('curadoria')}
              />
            </div>
          </div>
        )}

        {activeTab === 'catalogo' && (
          <CatalogView
            movies={movies}
            onPlay={(movie) => setSelectedMediaForPlay(movie)}
            onOpenDetails={(movie) => setSelectedMovieForDetail(movie)}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
            initialSearchQuery={searchQuery}
          />
        )}

        {activeTab === 'curadoria' && (
          <CuradoriaView
            movies={movies}
            onPlay={(movie) => setSelectedMediaForPlay(movie)}
            onOpenDetails={(movie) => setSelectedMovieForDetail(movie)}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {activeTab === 'bastidores' && (
          <BehindTheScenesView
            items={btsItems}
            movies={movies}
            onOpenItem={(item) => setSelectedMediaForPlay(item)}
            onOpenMovieDetail={(movie) => setSelectedMovieForDetail(movie)}
          />
        )}

        {activeTab === 'profissionais' && (
          <ProfessionalsView
            professionals={professionals}
            movies={movies}
            onSelectProfessional={(prof) => setSelectedProfessional(prof)}
          />
        )}

        {activeTab === 'favoritos' && (
          <FavoritesView
            movies={movies}
            favoriteIds={favoriteIds}
            onPlay={(movie) => setSelectedMediaForPlay(movie)}
            onOpenDetails={(movie) => setSelectedMovieForDetail(movie)}
            onToggleFavorite={toggleFavorite}
            onGoToCatalog={() => setActiveTab('catalogo')}
          />
        )}

        {activeTab === 'admin' && isAdmin && user && (
          <AdminPanelView
            currentUser={user}
            movies={movies}
            professionals={professionals}
            btsItems={btsItems}
            onCreateMovie={() => handleOpenMovieForm()}
            onEditMovie={handleOpenMovieForm}
            onToggleMovieHighlight={handleToggleMovieHighlight}
            onDeleteMovie={handleDeleteMovie}
            onCreateProfessional={handleCreateProfessional}
            onUpdateProfessional={handleUpdateProfessional}
            onDeleteProfessional={handleDeleteProfessional}
            onCreateBtsItem={handleCreateBtsItem}
            onUpdateBtsItem={handleUpdateBtsItem}
            onDeleteBtsItem={handleDeleteBtsItem}
            onReviewRemoved={handleReviewRemoved}
          />
        )}
      </main>

      <Footer onNavigateTab={(tab) => setActiveTab(tab)} />

      {selectedMovieForDetail && (
        <MovieDetailModal
          movie={selectedMovieForDetail}
          onClose={() => setSelectedMovieForDetail(null)}
          onPlay={(movie) => setSelectedMediaForPlay(movie)}
          isFavorite={favoriteIds.includes(selectedMovieForDetail.id)}
          onToggleFavorite={toggleFavorite}
          onSelectProfessionalName={handleSelectProfessionalByName}
          onOpenBehindTheScenes={(bts) => setSelectedMediaForPlay(bts)}
          allBtsItems={btsItems}
          onAddReview={handleAddReview}
        />
      )}

      {selectedProfessional && (
        <ProfessionalModal
          professional={selectedProfessional}
          onClose={() => setSelectedProfessional(null)}
          movies={movies}
          onSelectMovie={(movie) => {
            setSelectedProfessional(null);
            setSelectedMovieForDetail(movie);
          }}
          onPlayMovie={(movie) => {
            setSelectedProfessional(null);
            setSelectedMediaForPlay(movie);
          }}
        />
      )}

      {selectedMediaForPlay && (
        <VideoPlayerModal
          item={selectedMediaForPlay}
          onClose={() => setSelectedMediaForPlay(null)}
        />
      )}

      {isAddModalOpen && isAdmin && (
        <AdminAddMovieModal
          initialMovie={movieBeingEdited}
          onClose={handleCloseMovieForm}
          onCreateMovie={handleAddMovie}
          onUpdateMovie={handleUpdateMovie}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onLogin={login}
          onRegister={register}
          onAuthenticated={handleAuthenticated}
        />
      )}
    </div>
  );
}
