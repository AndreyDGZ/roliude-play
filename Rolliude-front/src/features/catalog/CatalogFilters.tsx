import { FormEvent, ReactElement, useEffect, useId, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { SelectField } from '../../components/ui/SelectField';
import { TextField } from '../../components/ui/TextField';
import { CATALOG_ORDERS, CATALOG_REGIONS, hasActiveFilters, MIN_RELEASE_YEAR } from './catalog.query';
import { CatalogQuery } from './catalog.types';
import styles from './CatalogFilters.module.css';
import { CatalogOptions } from './useCatalogOptions';

interface CatalogFiltersProps {
  query: CatalogQuery;
  options: CatalogOptions;
  onChange: (next: CatalogQuery) => void;
  onClear: () => void;
}

export function CatalogFilters({ query, options, onChange, onClear }: CatalogFiltersProps): ReactElement {
  const [searchDraft, setSearchDraft] = useState(query.busca ?? '');
  const [yearDraft, setYearDraft] = useState(query.ano ? String(query.ano) : '');
  const visibleStates = query.regiao ? options.states.filter(state => state.regiao === query.regiao) : options.states;
  const maxYear = new Date().getFullYear() + 1;
  const fieldId = useId();

  useEffect(() => setSearchDraft(query.busca ?? ''), [query.busca]);
  useEffect(() => setYearDraft(query.ano ? String(query.ano) : ''), [query.ano]);

  function applyText(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const parsedYear = Number.parseInt(yearDraft, 10);
    const validYear = Number.isInteger(parsedYear) && parsedYear >= MIN_RELEASE_YEAR && parsedYear <= maxYear;

    onChange({
      ...query,
      busca: searchDraft.trim() || undefined,
      ano: validYear ? parsedYear : undefined,
      pagina: 1
    });
  }

  function changeRegion(rawValue: string): void {
    const region = CATALOG_REGIONS.find(item => item.value === rawValue)?.value;
    const keepState = region === undefined || options.states.some(state => state.uf === query.uf && state.regiao === region);

    onChange({
      ...query,
      regiao: region,
      uf: keepState ? query.uf : undefined,
      municipioId: keepState ? query.municipioId : undefined,
      pagina: 1
    });
  }

  function changeState(rawValue: string): void {
    onChange({ ...query, uf: rawValue || undefined, municipioId: undefined, pagina: 1 });
  }

  function changeMunicipality(rawValue: string): void {
    onChange({ ...query, municipioId: rawValue || undefined, pagina: 1 });
  }

  function changeGenre(rawValue: string): void {
    onChange({ ...query, generoId: rawValue || undefined, pagina: 1 });
  }

  function changeOrder(rawValue: string): void {
    const order = CATALOG_ORDERS.find(item => item.value === rawValue)?.value;

    onChange({ ...query, ordenar: order ?? query.ordenar, pagina: 1 });
  }

  return (
    <section className={styles.filters} aria-label="Busca e filtros do catálogo">
      <form className={styles.searchRow} onSubmit={applyText} role="search">
        <div className={styles.searchField}>
          <label className={styles.label} htmlFor={`${fieldId}-busca`}>Buscar por título</label>
          <TextField
            id={`${fieldId}-busca`}
            type="search"
            name="busca"
            placeholder="Ex.: Compadecida"
            maxLength={100}
            value={searchDraft}
            onChange={event => setSearchDraft(event.target.value)}
          />
        </div>
        <div className={styles.yearField}>
          <label className={styles.label} htmlFor={`${fieldId}-ano`}>Ano</label>
          <TextField
            id={`${fieldId}-ano`}
            type="number"
            name="ano"
            inputMode="numeric"
            min={MIN_RELEASE_YEAR}
            max={maxYear}
            placeholder="Ex.: 2019"
            value={yearDraft}
            onChange={event => setYearDraft(event.target.value)}
          />
        </div>
        <Button type="submit">Buscar</Button>
      </form>

      <div className={styles.selects}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor={`${fieldId}-regiao`}>Região</label>
          <SelectField id={`${fieldId}-regiao`} value={query.regiao ?? ''} onChange={event => changeRegion(event.target.value)}>
            <option value="">Todas as regiões</option>
            {CATALOG_REGIONS.map(region => (
              <option key={region.value} value={region.value}>
                {region.label}
              </option>
            ))}
          </SelectField>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor={`${fieldId}-estado`}>Estado</label>
          <SelectField id={`${fieldId}-estado`} value={query.uf ?? ''} onChange={event => changeState(event.target.value)}>
            <option value="">Todos os estados</option>
            {visibleStates.map(state => (
              <option key={state.id} value={state.uf}>
                {state.nome}
              </option>
            ))}
          </SelectField>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor={`${fieldId}-municipio`}>Município</label>
          <SelectField
            id={`${fieldId}-municipio`}
            value={query.municipioId ?? ''}
            disabled={!query.uf}
            onChange={event => changeMunicipality(event.target.value)}
          >
            <option value="">{query.uf ? 'Todos os municípios' : 'Escolha um estado'}</option>
            {options.municipalities.map(municipality => (
              <option key={municipality.id} value={municipality.id}>
                {municipality.nome}
              </option>
            ))}
          </SelectField>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor={`${fieldId}-genero`}>Gênero</label>
          <SelectField id={`${fieldId}-genero`} value={query.generoId ?? ''} onChange={event => changeGenre(event.target.value)}>
            <option value="">Todos os gêneros</option>
            {options.genres.map(genre => (
              <option key={genre.id} value={genre.id}>
                {genre.nome}
              </option>
            ))}
          </SelectField>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor={`${fieldId}-ordenar`}>Ordenar por</label>
          <SelectField id={`${fieldId}-ordenar`} value={query.ordenar} onChange={event => changeOrder(event.target.value)}>
            {CATALOG_ORDERS.map(order => (
              <option key={order.value} value={order.value}>
                {order.label}
              </option>
            ))}
          </SelectField>
        </div>
      </div>

      {options.failed ? (
        <p className={styles.warning} role="status">
          Algumas opções de filtro não puderam ser carregadas.
        </p>
      ) : null}

      {hasActiveFilters(query) ? (
        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={onClear}>
            Limpar filtros
          </Button>
        </div>
      ) : null}
    </section>
  );
}
