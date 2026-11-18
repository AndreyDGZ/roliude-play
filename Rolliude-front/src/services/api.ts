import {
  AdminOverview,
  AppNotification,
  AuthSession,
  BehindTheScenesItem,
  CastMember,
  ModeratedReview,
  Movie,
  NotificationList,
  PageResult,
  Professional,
  Review,
  User,
  UserRole
} from '../types';

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

const AUTH_STORAGE_KEY = 'rolliude_auth_v1';

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler;
}

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function storeToken(token: string): void {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, token);
  } catch {
    return;
  }
}

export function clearStoredToken(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    return;
  }
}

function buildAuthorizationHeader(token: string | null): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<ResponseBody>(path: string, init?: RequestInit): Promise<ResponseBody> {
  const token = getStoredToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...buildAuthorizationHeader(token), ...init?.headers }
  });

  if (response.status === 401 && token) {
    clearStoredToken();
    unauthorizedHandler?.();
  }

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

export interface RegisterPayload {
  nome: string;
  email: string;
  senha: string;
}

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface ProfessionalPayload {
  nome: string;
  funcoes: Professional['funcoes'];
  foto: string;
  cidadeNatal: string;
  estadoNatal: string;
  biografia: string;
  premios: string[];
}

export interface BehindTheScenesPayload {
  filmeId: string;
  titulo: string;
  tipo: BehindTheScenesItem['tipo'];
  descricao: string;
  thumbnailUrl: string;
  videoUrl?: string;
  dataPublicacao: string;
}

function toPageResult<Item, Mapped>(page: PaginatedEnvelope<Item>, mapItem: (item: Item) => Mapped): PageResult<Mapped> {
  return {
    items: page.data.map(mapItem),
    pagina: page.meta.pagina,
    totalPaginas: page.meta.totalPaginas,
    total: page.meta.total
  };
}

function keepItem<Item>(item: Item): Item {
  return item;
}

export async function register(payload: RegisterPayload): Promise<AuthSession> {
  const envelope = await request<Envelope<AuthSession>>('/auth/register', { method: 'POST', body: JSON.stringify(payload) });

  return envelope.data;
}

export async function login(payload: LoginPayload): Promise<AuthSession> {
  const envelope = await request<Envelope<AuthSession>>('/auth/login', { method: 'POST', body: JSON.stringify(payload) });

  return envelope.data;
}

export async function getCurrentUser(): Promise<User> {
  const envelope = await request<Envelope<User>>('/auth/me');

  return envelope.data;
}

export async function updateMovie(id: string, payload: Partial<CreateMoviePayload>): Promise<Movie> {
  const envelope = await request<Envelope<ApiMovie>>(`/movies/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });

  return mapMovie(envelope.data);
}

export async function deleteMovie(id: string): Promise<void> {
  await request<void>(`/movies/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function createProfessional(payload: ProfessionalPayload): Promise<Professional> {
  const envelope = await request<Envelope<ApiProfessional>>('/professionals', { method: 'POST', body: JSON.stringify(payload) });

  return mapProfessional(envelope.data);
}

export async function updateProfessional(id: string, payload: Partial<ProfessionalPayload>): Promise<Professional> {
  const envelope = await request<Envelope<ApiProfessional>>(`/professionals/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });

  return mapProfessional(envelope.data);
}

export async function deleteProfessional(id: string): Promise<void> {
  await request<void>(`/professionals/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function createBehindTheScenesItem(payload: BehindTheScenesPayload): Promise<BehindTheScenesItem> {
  const envelope = await request<Envelope<ApiBtsItem>>('/behind-the-scenes', { method: 'POST', body: JSON.stringify(payload) });

  return mapBtsItem(envelope.data);
}

export async function updateBehindTheScenesItem(id: string, payload: Partial<BehindTheScenesPayload>): Promise<BehindTheScenesItem> {
  const envelope = await request<Envelope<ApiBtsItem>>(`/behind-the-scenes/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });

  return mapBtsItem(envelope.data);
}

export async function deleteBehindTheScenesItem(id: string): Promise<void> {
  await request<void>(`/behind-the-scenes/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const envelope = await request<Envelope<AdminOverview>>('/admin/overview');

  return envelope.data;
}

export async function getUsers(pagina: number): Promise<PageResult<User>> {
  const page = await request<PaginatedEnvelope<User>>(`/admin/users?pagina=${pagina}`);

  return toPageResult(page, keepItem);
}

export async function updateUserRole(id: string, papel: UserRole): Promise<User> {
  const envelope = await request<Envelope<User>>(`/admin/users/${encodeURIComponent(id)}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ papel })
  });

  return envelope.data;
}

export async function getReviews(pagina: number): Promise<PageResult<ModeratedReview>> {
  const page = await request<PaginatedEnvelope<ModeratedReview>>(`/reviews?pagina=${pagina}`);

  return toPageResult(page, keepItem);
}

export async function deleteReview(id: string): Promise<void> {
  await request<void>(`/reviews/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
