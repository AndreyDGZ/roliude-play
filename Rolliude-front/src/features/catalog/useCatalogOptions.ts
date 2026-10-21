import { useEffect, useState } from 'react';
import { fetchGenres, fetchMunicipalities, fetchStates } from './catalog.api';
import { FilmGenre, MunicipalityOption, StateOption } from './catalog.types';

export interface CatalogOptions {
  genres: FilmGenre[];
  states: StateOption[];
  municipalities: MunicipalityOption[];
  failed: boolean;
}

export function useCatalogOptions(selectedState: string | undefined): CatalogOptions {
  const [genres, setGenres] = useState<FilmGenre[]>([]);
  const [states, setStates] = useState<StateOption[]>([]);
  const [municipalities, setMunicipalities] = useState<MunicipalityOption[]>([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([fetchGenres(controller.signal), fetchStates(controller.signal)])
      .then(([loadedGenres, loadedStates]) => {
        setGenres(loadedGenres);
        setStates(loadedStates);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setFailed(true);
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!selectedState) {
      setMunicipalities([]);
      return;
    }

    const controller = new AbortController();

    fetchMunicipalities(selectedState, controller.signal)
      .then(setMunicipalities)
      .catch(() => {
        if (!controller.signal.aborted) {
          setMunicipalities([]);
          setFailed(true);
        }
      });

    return () => controller.abort();
  }, [selectedState]);

  return { genres, states, municipalities, failed };
}
