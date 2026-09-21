const DEFAULT_API_BASE_URL = ['http:', '', 'localhost:3000', 'api'].join('/');

export interface HttpClientOptions {
  path: string;
  init?: RequestInit;
}

function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL;
}

export async function requestJson<ResponseBody>({ path, init }: HttpClientOptions): Promise<ResponseBody> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, init);

  if (!response.ok) {
    throw new Error('Falha na comunicação com a API');
  }

  return response.json() as Promise<ResponseBody>;
}

export async function requestVoid({ path, init }: HttpClientOptions): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, init);

  if (!response.ok) {
    throw new Error('Falha na comunicação com a API');
  }
}
