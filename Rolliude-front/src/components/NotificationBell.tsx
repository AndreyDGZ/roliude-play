import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Bell } from 'lucide-react';
import { AppNotification } from '../types';
import { NotificationPanel } from './NotificationPanel';

const MAX_BADGE_COUNT = 9;

interface NotificationBellProps {
  notifications: AppNotification[];
  naoLidas: number;
  onSelectNotification: (notification: AppNotification) => void;
  onMarkAllAsRead: () => void;
}

function describeUnread(naoLidas: number): string {
  if (naoLidas === 0) return 'Notificações';
  if (naoLidas === 1) return 'Notificações, 1 não lida';
  return `Notificações, ${naoLidas} não lidas`;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  notifications,
  naoLidas,
  onSelectNotification,
  onMarkAllAsRead
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (event.target instanceof Node && containerRef.current?.contains(event.target)) return;
      setIsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsOpen(false);
      buttonRef.current?.focus();
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const badgeLabel = naoLidas > MAX_BADGE_COUNT ? `${MAX_BADGE_COUNT}+` : String(naoLidas);

  const handleSelect = (notification: AppNotification) => {
    setIsOpen(false);
    onSelectNotification(notification);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((open) => !open)}
        aria-label={describeUnread(naoLidas)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="relative p-2 rounded-full bg-brand-surface hover:bg-brand-surface-raised text-brand-text-soft border border-brand-border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
      >
        <Bell className="w-4 h-4 text-brand-accent" />
        <AnimatePresence>
          {naoLidas > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22 }}
              className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-brand-primary text-white text-[10px] font-bold flex items-center justify-center"
            >
              {badgeLabel}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <NotificationPanel
            notifications={notifications}
            naoLidas={naoLidas}
            onSelectNotification={handleSelect}
            onMarkAllAsRead={onMarkAllAsRead}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
