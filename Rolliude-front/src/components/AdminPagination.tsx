import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AdminPaginationProps {
  pagina: number;
  totalPaginas: number;
  onChangePage: (pagina: number) => void;
}

const pageButtonClassName =
  'p-2 rounded-lg bg-brand-surface border border-brand-border text-brand-text-soft hover:text-brand-text disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent';

export const AdminPagination: React.FC<AdminPaginationProps> = ({ pagina, totalPaginas, onChangePage }) => {
  if (totalPaginas <= 1) return null;

  return (
    <div className="flex items-center justify-end gap-2 text-xs text-brand-text-soft">
      <button type="button" onClick={() => onChangePage(pagina - 1)} disabled={pagina <= 1} aria-label="Página anterior" className={pageButtonClassName}>
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="font-mono">
        {pagina} / {totalPaginas}
      </span>
      <button type="button" onClick={() => onChangePage(pagina + 1)} disabled={pagina >= totalPaginas} aria-label="Próxima página" className={pageButtonClassName}>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
