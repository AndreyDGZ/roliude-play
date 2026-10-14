import { ReactElement, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { CatalogFilters } from './CatalogFilters';
import { FIRST_PAGE, hasActiveFilters, parseCatalogQuery, toSearchParams } from './catalog.query';
import { CatalogQuery } from './catalog.types';
import styles from './CatalogoPage.module.css';
import { FilmCard } from './FilmCard';
import { Pagination } from './Pagination';
import { useCatalogOptions } from './useCatalogOptions';
import { useFilmCatalog } from './useFilmCatalog';

export function CatalogoPage(): ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = useMemo(() => parseCatalogQuery(searchParams), [searchParams]);
  const options = useCatalogOptions(query.uf);
  const { state, retry } = useFilmCatalog(query);
  const filtersActive = hasActiveFilters(query);

  function updateQuery(next: CatalogQuery): void {
    setSearchParams(toSearchParams(next));
    window.scrollTo({ top: 0 });
  }

  function clearFilters(): void {
    setSearchParams({});
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Catálogo de Filmes</h1>
        <p className={styles.lead}>Explore nosso acervo de produções brasileiras, regionais e de domínio público.</p>
      </header>

      <CatalogFilters query={query} options={options} onChange={updateQuery} onClear={clearFilters} />

      <div role="status" aria-live="polite" className={styles.feedback}>
        {state.status === 'loading' ? 'Carregando filmes...' : null}
        {state.status === 'success'
          ? `${state.meta.total} filme(s) ${filtersActive ? 'encontrado(s)' : 'no catálogo'}.`
          : null}
      </div>

      {state.status === 'error' ? (
        <section className={styles.notice} role="alert">
          <p className={styles.noticeText}>Não foi possível carregar o catálogo agora.</p>
          <Button type="button" onClick={retry}>
            Tentar novamente
          </Button>
        </section>
      ) : null}

      {state.status === 'success' && state.films.length === 0 ? (
        <section className={styles.notice}>
          <p className={styles.noticeText}>
            {filtersActive ? 'Nenhum filme encontrado com esses filtros.' : 'Nenhum filme encontrado nesta página.'}
          </p>
          {filtersActive ? (
            <Button type="button" variant="secondary" onClick={clearFilters}>
              Limpar filtros
            </Button>
          ) : null}
          {!filtersActive && state.meta.total > 0 ? (
            <Button type="button" variant="secondary" onClick={() => updateQuery({ ...query, pagina: FIRST_PAGE })}>
              Voltar ao início do catálogo
            </Button>
          ) : null}
        </section>
      ) : null}

      {state.status === 'success' && state.films.length > 0 ? (
        <ul className={styles.grid} aria-label="Filmes do catálogo">
          {state.films.map(film => (
            <li key={film.id} className={styles.gridItem}>
              <FilmCard film={film} />
            </li>
          ))}
        </ul>
      ) : null}

      {state.status === 'success' && state.meta.totalPaginas > 1 ? (
        <Pagination
          currentPage={state.meta.pagina}
          totalPages={state.meta.totalPaginas}
          onPageChange={page => updateQuery({ ...query, pagina: page })}
        />
      ) : null}
    </div>
  );
}
