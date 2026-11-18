import { Movie } from '../types';

export const NEW_RELEASE_WINDOW_DAYS = 7;
const JUST_RELEASED_WINDOW_MS = 60 * 1000;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const RELATIVE_TIME_STEPS: { unit: Intl.RelativeTimeFormatUnit; milliseconds: number }[] = [
  { unit: 'day', milliseconds: DAY_IN_MS },
  { unit: 'hour', milliseconds: 60 * 60 * 1000 },
  { unit: 'minute', milliseconds: 60 * 1000 }
];

const relativeTimeFormatter = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });

function millisecondsSinceRelease(movie: Movie): number | null {
  if (!movie.lancadoEm) {
    return null;
  }

  return Date.now() - new Date(movie.lancadoEm).getTime();
}

export function isNewRelease(movie: Movie): boolean {
  const elapsed = millisecondsSinceRelease(movie);

  return elapsed !== null && elapsed < NEW_RELEASE_WINDOW_DAYS * DAY_IN_MS;
}

export function isJustReleased(movie: Movie): boolean {
  const elapsed = millisecondsSinceRelease(movie);

  return elapsed !== null && elapsed < JUST_RELEASED_WINDOW_MS;
}

export function formatReleaseTime(isoDate: string): string {
  const elapsed = Date.now() - new Date(isoDate).getTime();
  const step = RELATIVE_TIME_STEPS.find(candidate => elapsed >= candidate.milliseconds);

  if (!step) {
    return 'agora mesmo';
  }

  return relativeTimeFormatter.format(-Math.floor(elapsed / step.milliseconds), step.unit);
}
