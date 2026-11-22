import { useCallback, useEffect, useMemo, useState } from 'react';
import { Movie } from '../types';

const FAVORITES_STORAGE_KEY = 'rolliude_favorites_v1';

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function readStoredFavoriteIds(): string[] {
  try {
    const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!saved) return [];

    const parsed: unknown = JSON.parse(saved);
    return isStringList(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Erro ao carregar favoritos', error);
    return [];
  }
}

export interface FavoritesState {
  favoriteIds: string[];
  favoriteMovies: Movie[];
  toggleFavorite: (movieId: string) => void;
  removeFavorite: (movieId: string) => void;
}

export function useFavorites(movies: Movie[]): FavoritesState {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(readStoredFavoriteIds);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch (error) {
      console.warn('Erro ao salvar favoritos', error);
    }
  }, [favoriteIds]);

  const favoriteMovies = useMemo(
    () => movies.filter((movie) => favoriteIds.includes(movie.id)),
    [movies, favoriteIds]
  );

  const toggleFavorite = useCallback((movieId: string) => {
    setFavoriteIds((previous) =>
      previous.includes(movieId) ? previous.filter((favoriteId) => favoriteId !== movieId) : [...previous, movieId]
    );
  }, []);

  const removeFavorite = useCallback((movieId: string) => {
    setFavoriteIds((previous) => previous.filter((favoriteId) => favoriteId !== movieId));
  }, []);

  return { favoriteIds, favoriteMovies, toggleFavorite, removeFavorite };
}
