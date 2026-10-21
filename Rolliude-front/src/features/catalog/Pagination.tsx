import { ReactElement } from 'react';
import { Button } from '../../components/ui/Button';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps): ReactElement {
  const previousPage = Math.min(currentPage - 1, totalPages);

  return (
    <nav className={styles.pagination} aria-label="Paginação do catálogo">
      <Button type="button" variant="secondary" disabled={currentPage <= 1} onClick={() => onPageChange(previousPage)}>
        Anterior
      </Button>
      <span className={styles.status} aria-current="page">
        Página {currentPage} de {totalPages}
      </span>
      <Button
        type="button"
        variant="secondary"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Próxima
      </Button>
    </nav>
  );
}
