import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';
import { AppNotification } from '../types';

const TOAST_DURATION_MS = 4500;

interface ReleaseToastProps {
  toasts: AppNotification[];
  onDismiss: (notificationId: string) => void;
  onSelect: (notification: AppNotification) => void;
}

interface ReleaseToastItemProps {
  notification: AppNotification;
  onDismiss: (notificationId: string) => void;
  onSelect: (notification: AppNotification) => void;
}

const ReleaseToastItem: React.FC<ReleaseToastItemProps> = ({ notification, onDismiss, onSelect }) => {
  const [isPaused, setIsPaused] = useState(false);
  const remainingRef = useRef(TOAST_DURATION_MS);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (isPaused) return;

    const startedAt = Date.now();
    const timer = window.setTimeout(() => onDismiss(notification.id), remainingRef.current);

    return () => {
      window.clearTimeout(timer);
      remainingRef.current -= Date.now() - startedAt;
    };
  }, [isPaused, notification.id, onDismiss]);

  return (
    <motion.li
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, x: 48 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, x: 48 }}
      transition={{ duration: 0.25 }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative flex items-stretch bg-brand-surface border border-brand-border border-l-4 border-l-brand-primary rounded-xl shadow-2xl overflow-hidden"
    >
      <button
        onClick={() => onSelect(notification)}
        className="flex flex-1 items-center gap-3 p-3 pr-9 text-left min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-accent"
      >
        <img
          src={notification.posterUrl}
          alt={`Pôster de ${notification.titulo}`}
          className="w-12 h-16 rounded-lg object-cover shrink-0 bg-brand-bg"
        />
        <span className="min-w-0">
          <span className="block font-display text-[11px] font-bold tracking-wide text-brand-accent">Novo lançamento</span>
          <span className="block text-sm font-semibold text-brand-text truncate">{notification.titulo}</span>
          <span className="block text-[11px] text-brand-text-soft truncate">
            Filme, {notification.genero[0] ?? 'Cinema regional'}. {notification.municipio}, {notification.estadoSigla}
          </span>
        </span>
      </button>
      <button
        onClick={() => onDismiss(notification.id)}
        aria-label={`Fechar aviso de ${notification.titulo}`}
        className="absolute top-2 right-2 p-1 rounded-lg text-brand-text-muted hover:text-brand-text transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.li>
  );
};

export const ReleaseToast: React.FC<ReleaseToastProps> = ({ toasts, onDismiss, onSelect }) => (
  <div aria-live="polite" className="fixed top-28 right-4 z-50 w-[min(340px,calc(100vw-2rem))]">
    <ul className="flex flex-col gap-2">
      <AnimatePresence initial={false}>
        {toasts.map((notification) => (
          <ReleaseToastItem key={notification.id} notification={notification} onDismiss={onDismiss} onSelect={onSelect} />
        ))}
      </AnimatePresence>
    </ul>
  </div>
);
