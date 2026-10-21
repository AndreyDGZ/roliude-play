import { BrazilRegion, CatalogOrder, CatalogQuery } from './catalog.types';

export const PAGE_SIZE = 12;
export const FIRST_PAGE = 1;
export const DEFAULT_ORDER: CatalogOrder = 'recentes';
export const MIN_RELEASE_YEAR = 1888;

export const CATALOG_REGIONS: { value: BrazilRegion; label: string }[] = [
  { value: 'NORTE', label: 'Norte' },
  { value: 'NORDESTE', label: 'Nordeste' },
  { value: 'CENTRO_OESTE', label: 'Centro-Oeste' },
  { value: 'SUDESTE', label: 'Sudeste' },
  { value: 'SUL', label: 'Sul' }
];

export const CATALOG_ORDERS: { value: CatalogOrder; label: string }[] = [
  { value: 'recentes', label: 'Adicionados recentemente' },
  { value: 'titulo', label: 'Título (A a Z)' },
  { value: 'ano', label: 'Ano de lançamento' }
];

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const STATE_PATTERN = /^[a-z]{2}$/i;

function getMaxReleaseYear(): number {
  return new Date().getFullYear() + 1;
}

function parsePositiveInteger(rawValue: string | null): number | undefined {
  const parsed = Number.parseInt(rawValue ?? '', 10);

  return Number.isInteger(parsed) && parsed >= FIRST_PAGE ? parsed : undefined;
}

function parseYear(rawValue: string | null): number | undefined {
  const parsed = parsePositiveInteger(rawValue);

  return parsed !== undefined && parsed >= MIN_RELEASE_YEAR && parsed <= getMaxReleaseYear() ? parsed : undefined;
}

function parseIdentifier(rawValue: string | null): string | undefined {
  return rawValue !== null && UUID_PATTERN.test(rawValue) ? rawValue : undefined;
}

function parseRegion(rawValue: string | null): BrazilRegion | undefined {
  return CATALOG_REGIONS.find(region => region.value === rawValue)?.value;
}

function parseOrder(rawValue: string | null): CatalogOrder {
  return CATALOG_ORDERS.find(order => order.value === rawValue)?.value ?? DEFAULT_ORDER;
}

function parseState(rawValue: string | null): string | undefined {
  return rawValue !== null && STATE_PATTERN.test(rawValue) ? rawValue.toUpperCase() : undefined;
}

function parseSearch(rawValue: string | null): string | undefined {
  const trimmed = rawValue?.trim() ?? '';

  return trimmed.length > 0 ? trimmed : undefined;
}

export function parseCatalogQuery(searchParams: URLSearchParams): CatalogQuery {
  return {
    busca: parseSearch(searchParams.get('busca')),
    regiao: parseRegion(searchParams.get('regiao')),
    uf: parseState(searchParams.get('uf')),
    municipioId: parseIdentifier(searchParams.get('municipioId')),
    generoId: parseIdentifier(searchParams.get('generoId')),
    ano: parseYear(searchParams.get('ano')),
    ordenar: parseOrder(searchParams.get('ordenar')),
    pagina: parsePositiveInteger(searchParams.get('pagina')) ?? FIRST_PAGE,
    limite: PAGE_SIZE
  };
}

export function toSearchParams(query: CatalogQuery, forApi = false): URLSearchParams {
  const searchParams = new URLSearchParams();

  if (query.busca) {
    searchParams.set('busca', query.busca);
  }

  if (query.regiao) {
    searchParams.set('regiao', query.regiao);
  }

  if (query.uf) {
    searchParams.set('uf', query.uf);
  }

  if (query.municipioId) {
    searchParams.set('municipioId', query.municipioId);
  }

  if (query.generoId) {
    searchParams.set('generoId', query.generoId);
  }

  if (query.ano) {
    searchParams.set('ano', String(query.ano));
  }

  if (forApi || query.ordenar !== DEFAULT_ORDER) {
    searchParams.set('ordenar', query.ordenar);
  }

  if (forApi || query.pagina > FIRST_PAGE) {
    searchParams.set('pagina', String(query.pagina));
  }

  if (forApi) {
    searchParams.set('limite', String(query.limite));
  }

  return searchParams;
}

export function hasActiveFilters(query: CatalogQuery): boolean {
  return Boolean(query.busca || query.regiao || query.uf || query.municipioId || query.generoId || query.ano);
}
