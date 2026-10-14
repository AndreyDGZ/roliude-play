import { useCallback, useEffect, useState } from 'react';
import { fetchFilmPage } from './catalog.api';
import { toSearchParams } from './catalog.query';
import { CatalogQuery, FilmSummary, PaginationMeta } from './catalog.types';

export type FilmCatalogState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'success'; films: FilmSummary[]; meta: PaginationMeta };

export interface FilmCatalog {
  state: FilmCatalogState;
  retry: () => void;
}

export function useFilmCatalog(query: CatalogQuery): FilmCatalog {
  const [state, setState] = useState<FilmCatalogState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const requestKey = toSearchParams(query, true).toString();

  useEffect(() => {
    const controller = new AbortController();

    setState({ status: 'loading' });

    fetchFilmPage(requestKey, controller.signal)
      .then(page => setState({ status: 'success', films: page.data, meta: page.meta }))
      .catch(() => {
        if (!controller.signal.aborted) {
          setState({ status: 'error' });
        }
      });

    return () => controller.abort();
  }, [requestKey, attempt]);

  const retry = useCallback(() => setAttempt(previous => previous + 1), []);

  return { state, retry };
}
