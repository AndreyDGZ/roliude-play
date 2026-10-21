export type StatusFilme = 'RASCUNHO' | 'PUBLICADO' | 'ARQUIVADO';

export interface Genero {
  id: string;
  nome: string;
}

export interface Filme {
  id: string;
  titulo: string;
  sinopse: string | null;
  diretor: string | null;
  anoLancamento: number | null;
  duracaoMinutos: number | null;
  idioma: string;
  classificacaoIndicativa: string | null;
  posterUrl: string | null;
  trailerUrl: string | null;
  videoUrl: string | null;
  dominioPublico: boolean;
  status: StatusFilme;
  generos: Genero[];
}

export interface FilmeFormData {
  titulo: string;
  sinopse: string;
  diretor: string;
  anoLancamento: number;
  duracaoMinutos: number;
  idioma: string;
  classificacaoIndicativa: string;
  posterUrl: string;
  trailerUrl: string;
  videoUrl: string;
  dominioPublico: boolean;
  status: StatusFilme;
  generoIds: string[];
}

const BASE_URL = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3000'}/api/admin/movies`;

function buildHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'x-admin-key': sessionStorage.getItem('adminKey') ?? '',
  };
}

async function request<Result>(path: string, init?: RequestInit): Promise<Result> {
  const response = await fetch(`${BASE_URL}${path}`, { ...init, headers: buildHeaders() });
  if (!response.ok) {
    const body: { error?: string } = await response.json().catch(() => ({}));
    throw new Error(body.error ?? `Erro ${response.status}`);
  }
  if (response.status === 204) return undefined as Result;
  return response.json() as Promise<Result>;
}

function toPayload(data: FilmeFormData) {
  return JSON.stringify({
    ...data,
    classificacaoIndicativa: data.classificacaoIndicativa || undefined,
  });
}

export const moviesApi = {
  list: (search = '', status = '') => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    return request<{ items: Filme[]; total: number }>(`?${params.toString()}`);
  },
  listGeneros: () => request<Genero[]>('/generos'),
  create: (data: FilmeFormData) => request<Filme>('', { method: 'POST', body: toPayload(data) }),
  update: (id: string, data: FilmeFormData) =>
    request<Filme>(`/${id}`, { method: 'PUT', body: toPayload(data) }),
  setStatus: (id: string, status: StatusFilme) =>
    request<Filme>(`/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  remove: (id: string) => request<void>(`/${id}`, { method: 'DELETE' }),
};
