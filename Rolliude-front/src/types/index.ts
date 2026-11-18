export type Region = 'Nordeste' | 'Norte' | 'Centro-Oeste' | 'Sudeste' | 'Sul';

export type AgeRating = 'Livre' | '10' | '12' | '14' | '16' | '18';

export interface LocationInfo {
  pais: string;
  regiao: Region;
  estado: string;
  estadoSigla: string;
  municipio: string;
}

export interface CastMember {
  id: string;
  nome: string;
  personagem: string;
  foto?: string;
}

export interface Review {
  id: string;
  autor: string;
  cidade: string;
  nota: number;
  data: string;
  comentario: string;
}

export interface BehindTheScenesItem {
  id: string;
  filmeId: string;
  titulo: string;
  tipo: 'making_of' | 'entrevista' | 'minidoc' | 'depoimento' | 'curiosidade' | 'galeria_fotos';
  descricao: string;
  duracao?: string;
  thumbnailUrl: string;
  videoUrl?: string;
  galeriaFotos?: string[];
  entrevistado?: string;
  dataPublicacao: string;
}

export interface Professional {
  id: string;
  nome: string;
  funcoes: ('Diretor(a)' | 'Ator/Atriz' | 'Roteirista' | 'Produtor(a)' | 'Diretor(a) de Fotografia' | 'Compositor(a)')[];
  foto: string;
  cidadeNatal: string;
  estadoNatal: string;
  biografia: string;
  premios: string[];
  filmesIds: string[];
}

export interface Movie {
  id: string;
  titulo: string;
  tituloOriginal?: string;
  sinopse: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  videoUrl: string;
  ano: number;
  duracaoMinutos: number;
  genero: string[];
  classificacaoIndicativa: AgeRating;
  localizacao: LocationInfo;
  
  direcao: string[];
  roteiro: string[];
  producao: string[];
  elenco: CastMember[];
  fotografia: string;
  trilhaSonora: string;
  produtora: string;
  premios: string[];
  curiosidades: string[];
  
  destaqueCuradoria?: boolean;
  curadoriaTag?: string;
  popularidade: number;
  notaMedia: number;
  avaliacoesCount: number;
  lancadoEm?: string;
  reviews?: Review[];
  
  bastidoresIds?: string[];
}

export interface CuratedCarousel {
  id: string;
  titulo: string;
  subtitulo: string;
  tagline: string;
  criterio: (movie: Movie) => boolean;
}

export interface AppNotification {
  id: string;
  filmeId: string;
  titulo: string;
  genero: string[];
  municipio: string;
  estadoSigla: string;
  classificacaoIndicativa: string;
  posterUrl: string;
  createdAt: string;
  lida: boolean;
}

export interface NotificationList {
  notifications: AppNotification[];
  naoLidas: number;
}

export type UserRole = 'USUARIO' | 'ADMIN';

export interface User {
  id: string;
  nome: string;
  email: string;
  papel: UserRole;
  criadoEm: string;
}

export interface AuthSession {
  token: string;
  usuario: User;
}

export interface AdminOverview {
  totais: {
    filmes: number;
    profissionais: number;
    bastidores: number;
    avaliacoes: number;
    usuarios: number;
  };
  ultimosFilmes: { id: string; titulo: string; cadastradoEm: string }[];
}

export interface ModeratedReview {
  id: string;
  autor: string;
  cidade: string;
  nota: number;
  comentario: string;
  data: string;
  filme: { id: string; titulo: string };
}

export interface PageResult<Item> {
  items: Item[];
  pagina: number;
  totalPaginas: number;
  total: number;
}

export type AppTab = 'inicio' | 'catalogo' | 'curadoria' | 'bastidores' | 'profissionais' | 'favoritos' | 'admin';
