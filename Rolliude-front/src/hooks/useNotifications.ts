import { useCallback, useEffect, useRef, useState } from 'react';
import { AppNotification } from '../types';
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  openNotificationStream
} from '../services/api';

const DEVICE_STORAGE_KEY = 'rolliude_dispositivo_v1';
const MAX_VISIBLE_TOASTS = 3;
const STREAM_FAILURES_BEFORE_POLLING = 3;
const POLLING_INTERVAL_MS = 60 * 1000;

function resolveDeviceId(): string {
  try {
    const saved = localStorage.getItem(DEVICE_STORAGE_KEY);
    if (saved) return saved;

    const created = crypto.randomUUID();
    localStorage.setItem(DEVICE_STORAGE_KEY, created);
    return created;
  } catch (error) {
    console.warn('Erro ao recuperar o dispositivo das notificações', error);
    return crypto.randomUUID();
  }
}

export interface NotificationsState {
  notifications: AppNotification[];
  naoLidas: number;
  toasts: AppNotification[];
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  dismissToast: (notificationId: string) => void;
}

export function useNotifications(onRelease: (notification: AppNotification) => void): NotificationsState {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [naoLidas, setNaoLidas] = useState(0);
  const [toasts, setToasts] = useState<AppNotification[]>([]);
  const [deviceId] = useState<string>(resolveDeviceId);
  const knownIdsRef = useRef<Set<string>>(new Set());
  const onReleaseRef = useRef(onRelease);

  const loadNotifications = useCallback((): void => {
    getNotifications(deviceId)
      .then(list => {
        knownIdsRef.current = new Set(list.notifications.map(notification => notification.id));
        setNotifications(list.notifications);
        setNaoLidas(list.naoLidas);
      })
      .catch(error => console.warn('Erro ao carregar notificações', error));
  }, [deviceId]);

  const receiveRelease = useCallback((notification: AppNotification): void => {
    if (knownIdsRef.current.has(notification.id)) return;

    knownIdsRef.current.add(notification.id);
    setNotifications(previous => [notification, ...previous]);
    setNaoLidas(previous => previous + 1);
    setToasts(previous => [notification, ...previous].slice(0, MAX_VISIBLE_TOASTS));
    onReleaseRef.current(notification);
  }, []);

  useEffect(() => {
    onReleaseRef.current = onRelease;
  }, [onRelease]);

  useEffect(() => {
    loadNotifications();

    let consecutiveFailures = 0;
    let pollingTimer: number | null = null;
    const stream = openNotificationStream(receiveRelease);

    stream.onopen = () => {
      consecutiveFailures = 0;
      if (pollingTimer === null) return;

      window.clearInterval(pollingTimer);
      pollingTimer = null;
      loadNotifications();
    };

    stream.onerror = () => {
      consecutiveFailures += 1;
      if (consecutiveFailures < STREAM_FAILURES_BEFORE_POLLING || pollingTimer !== null) return;

      pollingTimer = window.setInterval(loadNotifications, POLLING_INTERVAL_MS);
    };

    return () => {
      stream.close();
      if (pollingTimer !== null) window.clearInterval(pollingTimer);
    };
  }, [loadNotifications, receiveRelease]);

  const markAsRead = (notificationId: string): void => {
    const target = notifications.find(notification => notification.id === notificationId);
    if (!target || target.lida) return;

    setNotifications(previous =>
      previous.map(notification => (notification.id === notificationId ? { ...notification, lida: true } : notification))
    );
    setNaoLidas(previous => Math.max(0, previous - 1));
    markNotificationAsRead(notificationId, deviceId).catch(error =>
      console.warn('Erro ao marcar notificação como lida', error)
    );
  };

  const markAllAsRead = (): void => {
    setNotifications(previous => previous.map(notification => ({ ...notification, lida: true })));
    setNaoLidas(0);
    markAllNotificationsAsRead(deviceId).catch(error =>
      console.warn('Erro ao marcar notificações como lidas', error)
    );
  };

  const dismissToast = useCallback((notificationId: string): void => {
    setToasts(previous => previous.filter(toast => toast.id !== notificationId));
  }, []);

  return { notifications, naoLidas, toasts, markAsRead, markAllAsRead, dismissToast };
}
