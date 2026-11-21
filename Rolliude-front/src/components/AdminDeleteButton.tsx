import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

interface AdminDeleteButtonProps {
  itemLabel: string;
  onConfirm: () => Promise<void>;
}

const actionClassName =
  'px-2.5 py-1.5 rounded-lg text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent disabled:opacity-60';

export const AdminDeleteButton: React.FC<AdminDeleteButtonProps> = ({ itemLabel, onConfirm }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
      setIsConfirming(false);
    }
  };

  if (!isConfirming) {
    return (
      <button
        type="button"
        onClick={() => setIsConfirming(true)}
        aria-label={`Remover ${itemLabel}`}
        className={`${actionClassName} bg-brand-surface text-brand-text-soft hover:text-brand-accent border border-brand-border`}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[11px] text-brand-text-soft">Remover?</span>
      <button
        type="button"
        onClick={handleConfirm}
        disabled={isDeleting}
        className={`${actionClassName} bg-brand-primary hover:bg-brand-accent text-white`}
      >
        {isDeleting ? 'Removendo...' : 'Sim'}
      </button>
      <button
        type="button"
        onClick={() => setIsConfirming(false)}
        disabled={isDeleting}
        className={`${actionClassName} bg-brand-surface text-brand-text-soft border border-brand-border`}
      >
        Não
      </button>
    </div>
  );
};
