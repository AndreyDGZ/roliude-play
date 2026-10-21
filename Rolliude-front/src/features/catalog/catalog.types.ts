export type FilmClassification = 'L' | '10' | '12' | '14' | '16' | '18';

export type BrazilRegion = 'NORTE' | 'NORDESTE' | 'CENTRO_OESTE' | 'SUDESTE' | 'SUL';

export interface FilmGenre {
  id: string;
  nome: string;
}

export interface FilmLocation {
  id: string;
  nome: string;
  estado: {
    id: string;
    uf: string;
    nome: string;
    regiao: BrazilRegion;
  };
}

export interface FilmSummary {
  id: string;
  titulo: string;
  tituloOriginal: string | null;
  sinopse: string | null;
  anoLancamento: number | null;
  duracaoMin: number | null;
  classificacaoIndicativa: FilmClassification;
  posterUrl: string | null;
  trailerUrl: string | null;
  dominioPublico: boolean;
  municipio: FilmLocation | null;
  generos: FilmGenre[];
}

export interface PaginationMeta {
  pagina: number;
  limite: number;
  total: number;
  totalPaginas: number;
}

export interface FilmPage {
  data: FilmSummary[];
  meta: PaginationMeta;
}

export type CatalogOrder = 'recentes' | 'titulo' | 'ano';

export interface CatalogFilters {
  busca?: string;
  regiao?: BrazilRegion;
  uf?: string;
  municipioId?: string;
  generoId?: string;
  ano?: number;
  ordenar: CatalogOrder;
}

export interface CatalogQuery extends CatalogFilters {
  pagina: number;
  limite: number;
}

export interface StateOption {
  id: string;
  uf: string;
  nome: string;
  regiao: BrazilRegion;
}

export interface MunicipalityOption {
  id: string;
  nome: string;
}
