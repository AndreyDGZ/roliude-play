import { requestJson } from '../../lib/http/httpClient';
import { FilmGenre, FilmPage, MunicipalityOption, StateOption } from './catalog.types';

interface DataEnvelope<Item> {
  data: Item[];
}

export function fetchFilmPage(requestKey: string, signal: AbortSignal): Promise<FilmPage> {
  return requestJson<FilmPage>({ path: `/films?${requestKey}`, init: { signal } });
}

export async function fetchGenres(signal: AbortSignal): Promise<FilmGenre[]> {
  const body = await requestJson<DataEnvelope<FilmGenre>>({ path: '/genres', init: { signal } });

  return body.data;
}

export async function fetchStates(signal: AbortSignal): Promise<StateOption[]> {
  const body = await requestJson<DataEnvelope<StateOption>>({ path: '/locations/states', init: { signal } });

  return body.data;
}

export async function fetchMunicipalities(uf: string, signal: AbortSignal): Promise<MunicipalityOption[]> {
  const body = await requestJson<DataEnvelope<MunicipalityOption>>({
    path: `/locations/states/${encodeURIComponent(uf)}/municipalities`,
    init: { signal }
  });

  return body.data;
}
