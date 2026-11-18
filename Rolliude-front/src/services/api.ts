import { AppNotification, BehindTheScenesItem, CastMember, Movie, NotificationList, Professional, Review } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3333/api';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface ApiLocalizacao {
  pais: string;
  regiao: string;
  estado: string;
  estadoSigla: string;
  municipio: string;
}

interface ApiCastMember {
  id: string;
  nome: string;
  personagem: string;
  foto: string | null;
}

interface ApiReview {
  id: string;
  autor: string;
  cidade: string;
  nota: number;
  comentario: string;
  data: string;
}

interface ApiMovie {
  id: string;
  titulo: string;
  tituloOriginal: string | null;
  sinopse: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  videoUrl: string;
  ano: number;
  duracaoMinutos: number;
  genero: string[];
  classificacaoIndicativa: Movie['classificacaoIndicativa'];
  localizacao: ApiLocalizacao;
  direcao: string[];
  roteiro: string[];
  producao: string[];
  elenco: ApiCastMember[];
  fotografia: string;
  trilhaSonora: string;
  produtora: string;
  premios: string[];
  curiosidades: string[];
  destaqueCuradoria: boolean;
  curadoriaTag: string | null;
  popularidade: number;
  notaMedia: number;
  avaliacoesCount: number;
  lancadoEm: string | null;
  reviews: ApiReview[];
}

interface ApiProfessional {
  id: string;
  nome: string;
  funcoes: Professional['funcoes'];
  foto: string;
  cidadeNatal: string;
  estadoNatal: string;
  biografia: string;
  premios: string[];
  filmes: { id: string; titulo: string }[];
}

interface ApiBtsItem {
  id: string;
  filmeId: string;
  titulo: string;
  tipo: BehindTheScenesItem['tipo'];
  descricao: string;
  duracao: string | null;
  thumbnailUrl: string;
  videoUrl: string | null;
  galeriaFotos: string[];
  entrevistado: string | null;
  dataPublicacao: string;
}

interface ApiNotificationList {
  data: AppNotification[];
  meta: { naoLidas: number };
}

const NOTIFICATIONS_PAGE_SIZE = 20;
const NOTIFICATION_RELEASE_EVENT = 'release';

interface Envelope<Item> {
  data: Item;
}

interface PaginatedEnvelope<Item> {
  data: Item[];
  meta: { pagina: number; limite: number; total: number; totalPaginas: number };
}

async function request<ResponseBody>(path: string, init?: RequestInit): Promise<ResponseBody> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers }
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);

    throw new ApiError(body?.message ?? 'Falha na comunicação com a API', response.status);
  }

  if (response.status === 204) {
    return undefined as ResponseBody;
  }

  return response.json() as Promise<ResponseBody>;
}

function mapCastMember(item: ApiCastMember): CastMember {
  return { id: item.id, nome: item.nome, personagem: item.personagem, foto: item.foto ?? undefined };
}

function mapReview(item: ApiReview): Review {
  return { id: item.id, autor: item.autor, cidade: item.cidade, nota: item.nota, data: item.data, comentario: item.comentario };
}

function mapMovie(item: ApiMovie): Movie {
  return {
    id: item.id,
    titulo: item.titulo,
    tituloOriginal: item.tituloOriginal ?? undefined,
    sinopse: item.sinopse,
    posterUrl: item.posterUrl,
    backdropUrl: item.backdropUrl,
    trailerUrl: item.trailerUrl,
    videoUrl: item.videoUrl,
    ano: item.ano,
    duracaoMinutos: item.duracaoMinutos,
    genero: item.genero,
    classificacaoIndicativa: item.classificacaoIndicativa,
    localizacao: item.localizacao as Movie['localizacao'],
    direcao: item.direcao,
    roteiro: item.roteiro,
    producao: item.producao,
    elenco: item.elenco.map(mapCastMember),
    fotografia: item.fotografia,
    trilhaSonora: item.trilhaSonora,
    produtora: item.produtora,
    premios: item.premios,
    curiosidades: item.curiosidades,
    destaqueCuradoria: item.destaqueCuradoria,
    curadoriaTag: item.curadoriaTag ?? undefined,
    popularidade: item.popularidade,
    notaMedia: item.notaMedia,
    avaliacoesCount: item.avaliacoesCount,
    lancadoEm: item.lancadoEm ?? undefined,
    reviews: item.reviews.map(mapReview)
  };
}

function mapProfessional(item: ApiProfessional): Professional {
  return {
    id: item.id,
    nome: item.nome,
    funcoes: item.funcoes,
    foto: item.foto,
    cidadeNatal: item.cidadeNatal,
    estadoNatal: item.estadoNatal,
    biografia: item.biografia,
    premios: item.premios,
    filmesIds: item.filmes.map(filme => filme.id)
  };
}

function mapBtsItem(item: ApiBtsItem): BehindTheScenesItem {
  return {
    id: item.id,
    filmeId: item.filmeId,
    titulo: item.titulo,
    tipo: item.tipo,
    descricao: item.descricao,
    duracao: item.duracao ?? undefined,
    thumbnailUrl: item.thumbnailUrl,
    videoUrl: item.videoUrl ?? undefined,
    galeriaFotos: item.galeriaFotos.length > 0 ? item.galeriaFotos : undefined,
    entrevistado: item.entrevistado ?? undefined,
    dataPublicacao: item.dataPublicacao
  };
}

export interface CreateMoviePayload {
  titulo: string;
  sinopse: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  videoUrl: string;
  ano: number;
  duracaoMinutos: number;
  genero: string[];
  classificacaoIndicativa: Movie['classificacaoIndicativa'];
  localizacao: Movie['localizacao'];
  direcao: string[];
  roteiro: string[];
  producao: string[];
  elenco: { nome: string; personagem: string }[];
  fotografia: string;
  trilhaSonora: string;
  produtora: string;
  premios: string[];
  curiosidades: string[];
  destaqueCuradoria?: boolean;
  curadoriaTag?: string;
  popularidade?: number;
}

export interface CreateReviewPayload {
  autor: string;
  cidade: string;
  nota: number;
  comentario: string;
}

export async function getMovies(): Promise<Movie[]> {
  const page = await request<PaginatedEnvelope<ApiMovie>>('/movies?limite=48');

  return page.data.map(mapMovie);
}

export async function getMovieById(id: string): Promise<Movie> {
  const envelope = await request<Envelope<ApiMovie>>(`/movies/${encodeURIComponent(id)}`);

  return mapMovie(envelope.data);
}

export async function createMovie(payload: CreateMoviePayload): Promise<Movie> {
  const envelope = await request<Envelope<ApiMovie>>('/movies', { method: 'POST', body: JSON.stringify(payload) });

  return mapMovie(envelope.data);
}

export async function createReview(movieId: string, payload: CreateReviewPayload): Promise<Movie> {
  const envelope = await request<Envelope<ApiMovie>>(`/movies/${encodeURIComponent(movieId)}/reviews`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  return mapMovie(envelope.data);
}

export async function getProfessionals(): Promise<Professional[]> {
  const page = await request<PaginatedEnvelope<ApiProfessional>>('/professionals?limite=48');

  return page.data.map(mapProfessional);
}

export async function getBehindTheScenesItems(): Promise<BehindTheScenesItem[]> {
  const envelope = await request<Envelope<ApiBtsItem[]>>('/behind-the-scenes');

  return envelope.data.map(mapBtsItem);
}

export async function getNotifications(dispositivoId: string): Promise<NotificationList> {
  const query = new URLSearchParams({ dispositivoId, limite: String(NOTIFICATIONS_PAGE_SIZE) });
  const page = await request<ApiNotificationList>(`/notifications?${query.toString()}`);

  return { notifications: page.data, naoLidas: page.meta.naoLidas };
}

export async function markNotificationAsRead(notificationId: string, dispositivoId: string): Promise<void> {
  await request<void>(`/notifications/${encodeURIComponent(notificationId)}/read`, {
    method: 'POST',
    body: JSON.stringify({ dispositivoId })
  });
}

export async function markAllNotificationsAsRead(dispositivoId: string): Promise<void> {
  await request<void>('/notifications/read-all', { method: 'POST', body: JSON.stringify({ dispositivoId }) });
}

export function openNotificationStream(onRelease: (notification: AppNotification) => void): EventSource {
  const stream = new EventSource(`${API_BASE_URL}/notifications/stream`);

  stream.addEventListener(NOTIFICATION_RELEASE_EVENT, (event: MessageEvent<string>) => {
    onRelease(JSON.parse(event.data) as AppNotification);
  });

  return stream;
}
