export interface Usuario {
  id: string;
  email: string;
  nome: string;
  googleId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Estado {
  id: string;
  uf: string;
  nome: string;
}

export interface Municipio {
  id: string;
  nome: string;
  estadoId: string;
}

export interface Genero {
  id: string;
  nome: string;
}

export interface Profissional {
  id: string;
  nome: string;
  funcao: string;
  bio?: string;
}

export interface Filme {
  id: string;
  titulo: string;
  sinopse?: string;
  ano?: number;
  duracaoMin?: number;
  videoUrl?: string;
  capaUrl?: string;
  dominioPublico: boolean;
  generoId?: string;
  genero?: Genero;
  createdAt: string;
  updatedAt: string;
}

export interface CuradoriaDestaque {
  id: string;
  titulo: string;
  descricao: string;
  filmeId: string;
  filme?: Filme;
  ordem: number;
}

export interface ConteudoBastidores {
  id: string;
  filmeId: string;
  titulo: string;
  conteudo: string;
  tipo: 'texto' | 'video' | 'imagem';
}
