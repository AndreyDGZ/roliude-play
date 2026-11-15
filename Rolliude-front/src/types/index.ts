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
  nota: number; // 1 a 5
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
  
  // Ficha técnica completa
  direcao: string[];
  roteiro: string[];
  producao: string[];
  elenco: CastMember[];
  fotografia: string;
  trilhaSonora: string;
  produtora: string;
  premios: string[];
  curiosidades: string[];
  
  // Metadados curatoriais
  destaqueCuradoria?: boolean;
  curadoriaTag?: string; // ex: 'Roliúde Nordestina', 'Memória Viva', 'Cinema de Resistência'
  popularidade: number; // 0 a 100
  notaMedia: number; // 1 a 5
  avaliacoesCount: number;
  reviews?: Review[];
  
  // Bastidores associados
  bastidoresIds?: string[];
}

export interface CuratedCarousel {
  id: string;
  titulo: string;
  subtitulo: string;
  tagline: string;
  criterio: (movie: Movie) => boolean;
}
