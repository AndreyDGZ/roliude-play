import React from 'react';
import { RotateCcw } from 'lucide-react';

interface AdminStatusMessageProps {
  message: string;
  onRetry?: () => void;
}

export const AdminStatusMessage: React.FC<AdminStatusMessageProps> = ({ message, onRetry }) => (
  <div className="py-10 flex flex-col items-center gap-3 text-center">
    <p className="text-sm text-brand-text-soft">{message}</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-accent text-white text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Tentar novamente</span>
      </button>
    )}
  </div>
);
