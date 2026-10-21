import { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { FilmSummary } from './catalog.types';
import styles from './FilmCard.module.css';

interface FilmCardProps {
  film: FilmSummary;
}

function buildMetaLine(film: FilmSummary): string {
  const parts: string[] = [];

  if (film.anoLancamento) {
    parts.push(String(film.anoLancamento));
  }

  if (film.duracaoMin) {
    parts.push(`${film.duracaoMin} min`);
  }

  parts.push(film.classificacaoIndicativa === 'L' ? 'Livre' : `${film.classificacaoIndicativa} anos`);

  return parts.join(' · ');
}

function buildLocationLine(film: FilmSummary): string | null {
  if (!film.municipio) {
    return null;
  }

  return `${film.municipio.nome}, ${film.municipio.estado.uf}`;
}

export function FilmCard({ film }: FilmCardProps): ReactElement {
  const locationLine = buildLocationLine(film);

  return (
    <article className={styles.card}>
      <Link to={`/filme/${film.id}`} className={styles.link}>
        <div className={styles.poster}>
          {film.posterUrl ? (
            <img className={styles.posterImage} src={film.posterUrl} alt={`Pôster de ${film.titulo}`} loading="lazy" />
          ) : (
            <span className={styles.posterPlaceholder} aria-hidden="true">
              {film.titulo}
            </span>
          )}
        </div>
        <div className={styles.body}>
          <h2 className={styles.title}>{film.titulo}</h2>
          <p className={styles.meta}>{buildMetaLine(film)}</p>
          {locationLine ? <p className={styles.location}>{locationLine}</p> : null}
        </div>
      </Link>
      {film.generos.length > 0 ? (
        <ul className={styles.genres} aria-label="Gêneros">
          {film.generos.map(genre => (
            <li key={genre.id} className={styles.genre}>
              {genre.nome}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
