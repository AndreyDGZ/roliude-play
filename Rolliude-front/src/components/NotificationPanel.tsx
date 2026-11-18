import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CheckCheck } from 'lucide-react';
import { AppNotification } from '../types';
import { formatReleaseTime } from '../data/releases';

interface NotificationPanelProps {
  notifications: AppNotification[];
  naoLidas: number;
  onSelectNotification: (notification: AppNotification) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  naoLidas,
  onSelectNotification,
  onMarkAllAsRead
}) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      role="dialog"
      aria-label="Notificações"
      initial={reduceMotion ? false : { opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
      transition={{ duration: 0.18 }}
      className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] bg-brand-surface border border-brand-border rounded-xl shadow-2xl overflow-hidden z-50"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border">
        <h2 className="font-display text-sm font-bold text-brand-text tracking-wide">Notificações</h2>
        {naoLidas > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="inline-flex items-center gap-1 text-xs text-brand-text-soft hover:text-brand-accent rounded-lg px-1.5 py-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Marcar todas como lidas</span>
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="px-4 py-8 text-center text-xs leading-relaxed text-brand-text-soft">
          Nenhuma notificação ainda. Quando um filme novo chegar ao catálogo, ele aparece aqui.
        </p>
      ) : (
        <ul className="max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <li key={notification.id}>
              <button
                onClick={() => onSelectNotification(notification)}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left border-l-2 transition hover:bg-brand-surface-raised focus-visible:outline-none focus-visible:bg-brand-surface-raised ${
                  notification.lida ? 'border-transparent' : 'border-brand-primary bg-brand-primary/10'
                }`}
              >
                <img
                  src={notification.posterUrl}
                  alt={`Pôster de ${notification.titulo}`}
                  className="w-11 h-11 rounded-lg object-cover shrink-0 bg-brand-bg"
                  loading="lazy"
                />
                <span className="min-w-0 flex-1">
                  <span className={`block text-xs truncate ${notification.lida ? 'text-brand-text-soft' : 'text-brand-text font-semibold'}`}>
                    Novo filme: {notification.titulo}
                  </span>
                  <span className="block text-[11px] text-brand-text-muted truncate mt-0.5">
                    {notification.genero.slice(0, 2).join(', ')}
                  </span>
                  <span className="block text-[11px] text-brand-text-muted mt-0.5">
                    {formatReleaseTime(notification.createdAt)}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};
