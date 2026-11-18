import React, { useCallback, useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { AdminDeleteButton } from './AdminDeleteButton';
import { AdminPagination } from './AdminPagination';
import { AdminStatusMessage } from './AdminStatusMessage';
import { deleteReview, getReviews } from '../services/api';
import { ModeratedReview, PageResult } from '../types';

interface AdminReviewsSectionProps {
  onReviewRemoved: (movieId: string) => void;
}

type LoadStatus = 'loading' | 'error' | 'ready';

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' });

export const AdminReviewsSection: React.FC<AdminReviewsSectionProps> = ({ onReviewRemoved }) => {
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [page, setPage] = useState<PageResult<ModeratedReview> | null>(null);
  const [pagina, setPagina] = useState(1);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadReviews = useCallback(() => {
    setStatus('loading');
    getReviews(pagina)
      .then((loadedPage) => {
        setPage(loadedPage);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [pagina]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleDelete = async (review: ModeratedReview) => {
    setActionError(null);
    try {
      await deleteReview(review.id);
      onReviewRemoved(review.filme.id);
      loadReviews();
    } catch {
      setActionError('Não foi possível remover a avaliação.');
    }
  };

  if (status === 'loading') return <AdminStatusMessage message="Carregando avaliações..." />;
  if (status === 'error' || !page) {
    return <AdminStatusMessage message="Não foi possível carregar as avaliações." onRetry={loadReviews} />;
  }
  if (page.items.length === 0) return <AdminStatusMessage message="Nenhuma avaliação registrada." />;

  return (
    <div className="space-y-4">
      {actionError && <p role="alert" className="text-xs text-brand-accent">{actionError}</p>}
      <ul className="divide-y divide-brand-border rounded-xl bg-brand-surface border border-brand-border">
        {page.items.map((review) => (
          <li key={review.id} className="p-3 flex items-start gap-3">
            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-xs text-brand-text-soft">
                <span className="font-semibold text-brand-text">{review.autor}</span> ({review.cidade}) em{' '}
                <span className="text-brand-accent">{review.filme.titulo}</span>
              </p>
              <p className="flex items-center gap-1 text-xs text-brand-star" aria-label={`Nota ${review.nota} de 5`}>
                <Star className="w-3.5 h-3.5" />
                <span className="font-mono">{review.nota}</span>
                <span className="font-mono text-brand-text-soft">· {dateFormatter.format(new Date(review.data))}</span>
              </p>
              <p className="text-sm text-brand-text">{review.comentario}</p>
            </div>
            <AdminDeleteButton itemLabel={`a avaliação de ${review.autor}`} onConfirm={() => handleDelete(review)} />
          </li>
        ))}
      </ul>
      <AdminPagination pagina={page.pagina} totalPaginas={page.totalPaginas} onChangePage={setPagina} />
    </div>
  );
};
